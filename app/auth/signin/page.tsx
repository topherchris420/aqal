"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User, Sparkles } from "lucide-react"
import { authService } from "@/lib/auth"
import Image from "next/image"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await authService.signIn(email, password)

    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || "Sign in failed")
    }

    setIsLoading(false)
  }

  const handleGuestSignIn = async () => {
    setIsLoading(true)
    setError("")

    const result = await authService.signInAsGuest()

    if (result.success) {
      router.push("/")
    } else {
      setError("Guest sign in failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md elevation-3 animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Image src="/logo.png" alt="AQAL Logo" width={64} height={64} className="rounded-xl elevation-2" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-medium text-gradient-primary">Welcome to AQAL Studio</CardTitle>
            <p className="text-muted-foreground mt-2">Sign in to your integral development platform</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 transition-smooth"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 transition-smooth"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full animate-ripple elevation-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full animate-ripple bg-transparent"
            onClick={handleGuestSignIn}
            disabled={isLoading}
          >
            <User className="mr-2 h-4 w-4" />
            Continue as Guest
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Demo credentials:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Admin: admin@aqal-app.com / admin123</div>
              <div>User: user@aqal-app.com / user123</div>
              <div>Guest: guest@aqal-app.com / guest123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
