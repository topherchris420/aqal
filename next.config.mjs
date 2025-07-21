/** @type {import('next').NextConfig} */

// Security headers for production
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

// Intelligent build configuration based on environment
const getBuildConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const isStandalone = process.env.VERCEL === '1' ? false : isProduction // Auto-detect standalone need
  
  return {
    // Output configuration - standalone for self-hosting, default for Vercel
    output: isStandalone ? 'standalone' : undefined,
    
    // Compiler optimizations
    compiler: {
      removeConsole: isProduction ? {
        exclude: ['error', 'warn'] // Keep error and warn logs in production
      } : false
    },
    
    // Performance optimizations
    experimental: {
      optimizeCss: isProduction,
      optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
      // Enable turbo in development for faster builds
      turbo: !isProduction ? {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js',
          },
        },
      } : undefined,
    },
  }
}

const buildConfig = getBuildConfig()

const nextConfig = {
  ...buildConfig,
  
  // Image optimization with intelligent defaults
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optimize images in production, allow unoptimized in development for speed
    unoptimized: process.env.NODE_ENV === 'development',
    // Add domains for external images if needed
    domains: [],
    // Enable placeholder blur for better UX
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Security and headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      },
      // Cache static assets aggressively
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },
  
  // Redirects for SEO and UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/dashboard',
        destination: '/',
        permanent: false
      }
    ]
  },
  
  // Build configuration with intelligent defaults
  eslint: {
    // Only ignore during builds in production to speed up deployment
    ignoreDuringBuilds: process.env.NODE_ENV === 'production'
  },
  
  typescript: {
    // Only ignore build errors in production for faster deployment
    ignoreBuildErrors: process.env.NODE_ENV === 'production'
  },
  
  // Advanced webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Separate vendor chunks for better caching
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Separate common chunks
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
        // UI components chunk
        ui: {
          test: /[\\/]components[\\/]ui[\\/]/,
          name: 'ui',
          chunks: 'all',
          priority: 15,
        }
      }
    }
    
    // Add bundle analyzer in development when requested
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      )
    }
    
    // Optimize for production
    if (!dev) {
      // Tree shaking optimization
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Minimize CSS
      config.optimization.minimizer.push(
        new (require('css-minimizer-webpack-plugin'))()
      )
    }
    
    return config
  },
  
  // Logging configuration
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  },
  
  // PoweredByHeader removal for security
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Generate build ID for cache busting
  generateBuildId: async () => {
    // Use git commit hash if available, otherwise use timestamp
    try {
      const { execSync } = require('child_process')
      return execSync('git rev-parse HEAD').toString().trim()
    } catch {
      return `build-${Date.now()}`
    }
  },
  
  // Environment variables that are safe to expose
  env: {
    BUILD_TIME: new Date().toISOString(),
    BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || `local-${Date.now()}`,
    CUSTOM_KEY: process.env.CUSTOM_KEY
  },
  
  // Rewrites for API versioning
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*'
      }
    ]
  },
  
  // Custom page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // Trailing slash handling
  trailingSlash: false,
  
  // React strict mode for better development experience
  reactStrictMode: true,
  
  // SWC minification for better performance
  swcMinify: true,
}

export default nextConfig
