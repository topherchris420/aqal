import { nanoid } from "nanoid"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user" | "guest"
  createdAt: string
  lastActive: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }
  private subscribers: ((state: AuthState) => void)[] = []

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private constructor() {
    this.initializeAuth()
  }

  private initializeAuth() {
    // Check for existing session
    const savedUser = localStorage.getItem("aqal_user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        this.authState = {
          user,
          isAuthenticated: true,
          isLoading: false,
        }
        this.notifySubscribers()
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("aqal_user")
      }
    }
  }

  subscribe(callback: (state: AuthState) => void): () => void {
    this.subscribers.push(callback)
    // Immediately call with current state
    callback(this.authState)

    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback)
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.authState))
  }

  async signInAsGuest(): Promise<{ success: boolean; user?: User; error?: string }> {
    this.authState.isLoading = true
    this.notifySubscribers()

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const guestUser: User = {
        id: `guest_${nanoid(8)}`,
        name: "Guest User",
        email: "guest@aqal-studio.com",
        role: "guest",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      }

      // Save to localStorage
      localStorage.setItem("aqal_user", JSON.stringify(guestUser))

      this.authState = {
        user: guestUser,
        isAuthenticated: true,
        isLoading: false,
      }

      this.notifySubscribers()

      return { success: true, user: guestUser }
    } catch (error) {
      this.authState.isLoading = false
      this.notifySubscribers()
      return { success: false, error: "Failed to create guest session" }
    }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    this.authState.isLoading = true
    this.notifySubscribers()

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo users for development
      const demoUsers: User[] = [
        {
          id: "admin_001",
          name: "Admin User",
          email: "admin@aqal-studio.com",
          role: "admin",
          createdAt: "2024-01-01T00:00:00Z",
          lastActive: new Date().toISOString(),
        },
        {
          id: "user_001",
          name: "Demo User",
          email: "user@aqal-studio.com",
          role: "user",
          createdAt: "2024-01-01T00:00:00Z",
          lastActive: new Date().toISOString(),
        },
      ]

      const user = demoUsers.find((u) => u.email === email)

      if (user && password === "demo123") {
        // Update last active
        user.lastActive = new Date().toISOString()

        // Save to localStorage
        localStorage.setItem("aqal_user", JSON.stringify(user))

        this.authState = {
          user,
          isAuthenticated: true,
          isLoading: false,
        }

        this.notifySubscribers()
        return { success: true, user }
      } else {
        this.authState.isLoading = false
        this.notifySubscribers()
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      this.authState.isLoading = false
      this.notifySubscribers()
      return { success: false, error: "Sign in failed" }
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem("aqal_user")

    this.authState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }

    this.notifySubscribers()
  }

  getCurrentUser(): User | null {
    return this.authState.user
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated
  }

  getAuthState(): AuthState {
    return this.authState
  }
}

export const authService = AuthService.getInstance()

// Legacy exports for backward compatibility
export function createGuestSession(): Promise<User> {
  return authService.signInAsGuest().then((result) => {
    if (result.success && result.user) {
      return result.user
    }
    throw new Error(result.error || "Failed to create guest session")
  })
}

export const authOptions = {
  // Legacy NextAuth options - now handled by AuthService
  providers: [],
  callbacks: {},
  pages: {
    signIn: "/auth/signin",
  },
}
