interface StorageItem<T = any> {
  data: T
  timestamp: number
  ttl?: number
  version: string
}

interface UserData {
  profile: any
  progress: Record<string, any>
  preferences: any
  analytics: any
}

class StorageService {
  private static instance: StorageService
  private readonly VERSION = "1.0.0"
  private readonly DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024 // 50MB

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  private constructor() {
    this.cleanup()
  }

  private getStorageKey(key: string): string {
    return `aqal_${key}`
  }

  private isExpired(item: StorageItem): boolean {
    if (!item.ttl) return false
    return Date.now() > item.timestamp + item.ttl
  }

  private cleanup(): void {
    if (typeof window === "undefined") return

    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("aqal_"))

      keys.forEach((key) => {
        try {
          const item = JSON.parse(localStorage.getItem(key) || "{}")
          if (this.isExpired(item)) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // Remove corrupted items
          localStorage.removeItem(key)
        }
      })

      // Check storage size and cleanup if needed
      this.enforceStorageLimit()
    } catch (error) {
      console.warn("Storage cleanup failed:", error)
    }
  }

  private enforceStorageLimit(): void {
    if (typeof window === "undefined") return

    try {
      const storageSize = new Blob(Object.values(localStorage)).size

      if (storageSize > this.MAX_STORAGE_SIZE) {
        // Remove oldest items first
        const items = Object.keys(localStorage)
          .filter((key) => key.startsWith("aqal_"))
          .map((key) => {
            try {
              const item = JSON.parse(localStorage.getItem(key) || "{}")
              return { key, timestamp: item.timestamp || 0 }
            } catch {
              return { key, timestamp: 0 }
            }
          })
          .sort((a, b) => a.timestamp - b.timestamp)

        // Remove oldest 25% of items
        const itemsToRemove = items.slice(0, Math.ceil(items.length * 0.25))
        itemsToRemove.forEach((item) => localStorage.removeItem(item.key))
      }
    } catch (error) {
      console.warn("Storage limit enforcement failed:", error)
    }
  }

  set<T>(key: string, data: T, ttl?: number): boolean {
    if (typeof window === "undefined") return false

    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.DEFAULT_TTL,
        version: this.VERSION,
      }

      localStorage.setItem(this.getStorageKey(key), JSON.stringify(item))
      return true
    } catch (error) {
      console.error("Storage set failed:", error)
      return false
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(this.getStorageKey(key))
      if (!stored) return null

      const item: StorageItem<T> = JSON.parse(stored)

      if (this.isExpired(item)) {
        this.remove(key)
        return null
      }

      return item.data
    } catch (error) {
      console.error("Storage get failed:", error)
      this.remove(key) // Remove corrupted item
      return null
    }
  }

  remove(key: string): boolean {
    if (typeof window === "undefined") return false

    try {
      localStorage.removeItem(this.getStorageKey(key))
      return true
    } catch (error) {
      console.error("Storage remove failed:", error)
      return false
    }
  }

  clear(): boolean {
    if (typeof window === "undefined") return false

    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("aqal_"))
      keys.forEach((key) => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error("Storage clear failed:", error)
      return false
    }
  }

  // User data specific methods
  saveUserData(userId: string, data: Partial<UserData>): boolean {
    const existing = this.getUserData(userId) || {}
    const merged = { ...existing, ...data }
    return this.set(`user_${userId}`, merged)
  }

  getUserData(userId: string): UserData | null {
    return this.get<UserData>(`user_${userId}`)
  }

  exportUserData(userId: string): string | null {
    const userData = this.getUserData(userId)
    if (!userData) return null

    try {
      return JSON.stringify(
        {
          ...userData,
          exportedAt: new Date().toISOString(),
          version: this.VERSION,
        },
        null,
        2,
      )
    } catch (error) {
      console.error("Export failed:", error)
      return null
    }
  }

  importUserData(userId: string, jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      // Validate data structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data format")
      }

      // Remove metadata
      const { exportedAt, version, ...userData } = data

      return this.saveUserData(userId, userData)
    } catch (error) {
      console.error("Import failed:", error)
      return false
    }
  }

  // Analytics and caching
  cacheAnalytics(data: any): boolean {
    return this.set("analytics", data, 24 * 60 * 60 * 1000) // 24 hours
  }

  getCachedAnalytics(): any {
    return this.get("analytics")
  }

  // Session management
  setSession(sessionData: any): boolean {
    return this.set("session", sessionData, 60 * 60 * 1000) // 1 hour
  }

  getSession(): any {
    return this.get("session")
  }

  clearSession(): boolean {
    return this.remove("session")
  }

  // Storage info
  getStorageInfo(): {
    used: number
    available: number
    itemCount: number
    version: string
  } {
    if (typeof window === "undefined") {
      return { used: 0, available: 0, itemCount: 0, version: this.VERSION }
    }

    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith("aqal_"))
      const used = new Blob(keys.map((key) => localStorage.getItem(key) || "")).size

      return {
        used,
        available: this.MAX_STORAGE_SIZE - used,
        itemCount: keys.length,
        version: this.VERSION,
      }
    } catch (error) {
      return { used: 0, available: 0, itemCount: 0, version: this.VERSION }
    }
  }
}

export const storageService = StorageService.getInstance()
export type { UserData, StorageItem }

/* ------------------------------------------------------------------
 * Legacy-compatibility helper for session persistence
 * -----------------------------------------------------------------*/

/**
 * Saves a session using the new StorageService while preserving the
 * original API signature.
 */
export const saveSession = (session: any): boolean => storageService.setSession(session)
