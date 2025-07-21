import { randomUUID } from "nanoid"
import type { Session } from "next-auth"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user" | "guest"
  avatar?: string
  preferences?: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    privacy: "public" | "private"
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Demo users for self-contained authentication
const demoUsers: User[] = [
  {
    id: "1",
    email: "admin@aqal-app.com",
    name: "Admin User",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    preferences: {
      theme: "system",
      notifications: true,
      privacy: "private",
    },
  },
  {
    id: "2",
    email: "user@aqal-app.com",
    name: "Demo User",
    role: "user",
    avatar: "/placeholder-user.jpg",
    preferences: {
      theme: "light",
      notifications: true,
      privacy: "public",
    },
  },
  {
    id: "3",
    email: "guest@aqal-app.com",
    name: "Guest User",
    role: "guest",
    preferences: {
      theme: "system",
      notifications: false,
      privacy: "private",
    },
  },
]

class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }
  private listeners: ((state: AuthState) => void)[] = []

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
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("aqal_user")
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          this.authState = {
            user,
            isAuthenticated: true,
            isLoading: false,
          }
        } catch (error) {
          console.error("Failed to parse saved user:", error)
          localStorage.removeItem("aqal_user")
        }
      }
    }
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.authState))
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.authState.isLoading = true
    this.notify()

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = demoUsers.find((u) => u.email === email)

    if (!user) {
      this.authState.isLoading = false
      this.notify()
      return { success: false, error: "User not found" }
    }

    // In a real app, you'd verify the password hash
    const validPasswords = {
      "admin@aqal-app.com": "admin123",
      "user@aqal-app.com": "user123",
      "guest@aqal-app.com": "guest123",
    }

    if (validPasswords[email as keyof typeof validPasswords] !== password) {
      this.authState.isLoading = false
      this.notify()
      return { success: false, error: "Invalid password" }
    }

    this.authState = {
      user,
      isAuthenticated: true,
      isLoading: false,
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("aqal_user", JSON.stringify(user))
    }

    this.notify()
    return { success: true }
  }

  async signInAsGuest(): Promise<{ success: boolean }> {
    this.authState.isLoading = true
    this.notify()

    await new Promise((resolve) => setTimeout(resolve, 500))

    const guestUser = demoUsers.find((u) => u.role === "guest")!

    this.authState = {
      user: guestUser,
      isAuthenticated: true,
      isLoading: false,
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("aqal_user", JSON.stringify(guestUser))
    }

    this.notify()
    return { success: true }
  }

  async signOut(): Promise<void> {
    this.authState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("aqal_user")
    }

    this.notify()
  }

  getAuthState(): AuthState {
    return this.authState
  }

  getCurrentUser(): User | null {
    return this.authState.user
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated
  }

  hasRole(role: string): boolean {
    return this.authState.user?.role === role
  }

  async updateUserPreferences(preferences: Partial<User["preferences"]>): Promise<void> {
    if (!this.authState.user) return

    const updatedUser = {
      ...this.authState.user,
      preferences: {
        ...this.authState.user.preferences,
        ...preferences,
      },
    }

    this.authState.user = updatedUser

    if (typeof window !== "undefined") {
      localStorage.setItem("aqal_user", JSON.stringify(updatedUser))
    }

    this.notify()
  }
}

export const authService = AuthService.getInstance()
export type { User, AuthState, Session }

/**
 * Lightweight, self-contained auth helpers.
 *
 * These satisfy legacy named-export requirements (`createGuestSession`
 * and `authOptions`) while delegating to the new `AuthService`.
 */

/**
 * Create a minimal guest session object.
 * In production you’d persist this to StorageService or a DB.
 */
export function createGuestSession(): Session {
  return {
    id: randomUUID(),
    role: "guest",
    createdAt: Date.now(),
  }
}

/**
 * Dummy `authOptions` kept only for backward compatibility with
 * older code that imported it (e.g. NextAuth).
 * New code should prefer the in-house `AuthService`.
 */
export const authOptions = {
  session: { strategy: "jwt" },
  providers: [],
  pages: {},
}
