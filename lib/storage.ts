import { nanoid } from "nanoid"

interface StorageItem {
  id: string
  data: any
  timestamp: number
  ttl?: number
  version: string
}

interface UserData {
  profile?: any
  progress?: any
  insights?: any
  preferences?: any
  installedPacks?: string[]
}

class StorageService {
  private static instance: StorageService
  private readonly STORAGE_PREFIX = "aqal_"
  private readonly CURRENT_VERSION = "1.0.0"
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

  private getKey(key: string): string {
    return `${this.STORAGE_PREFIX}${key}`
  }

  private isExpired(item: StorageItem): boolean {
    if (!item.ttl) return false
    return Date.now() > item.timestamp + item.ttl
  }

  private cleanup(): void {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_PREFIX))

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
  }

  private getStorageSize(): number {
    let total = 0
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_PREFIX))

    keys.forEach((key) => {
      const value = localStorage.getItem(key)
      if (value) {
        total += value.length
      }
    })

    return total
  }

  private makeSpace(requiredSize: number): void {
    if (this.getStorageSize() + requiredSize <= this.MAX_STORAGE_SIZE) {
      return
    }

    // Get all items with timestamps
    const items: { key: string; timestamp: number }[] = []
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_PREFIX))

    keys.forEach((key) => {
      try {
        const item = JSON.parse(localStorage.getItem(key) || "{}")
        items.push({ key, timestamp: item.timestamp || 0 })
      } catch (error) {
        localStorage.removeItem(key)
      }
    })

    // Sort by timestamp (oldest first)
    items.sort((a, b) => a.timestamp - b.timestamp)

    // Remove oldest items until we have enough space
    for (const item of items) {
      localStorage.removeItem(item.key)
      if (this.getStorageSize() + requiredSize <= this.MAX_STORAGE_SIZE) {
        break
      }
    }
  }

  set(key: string, data: any, ttl?: number): boolean {
    try {
      const item: StorageItem = {
        id: nanoid(),
        data,
        timestamp: Date.now(),
        ttl: ttl || this.DEFAULT_TTL,
        version: this.CURRENT_VERSION,
      }

      const serialized = JSON.stringify(item)
      this.makeSpace(serialized.length)

      localStorage.setItem(this.getKey(key), serialized)
      return true
    } catch (error) {
      console.error("Storage set failed:", error)
      return false
    }
  }

  get<T>(key: string): T | null {
    try {
      const serialized = localStorage.getItem(this.getKey(key))
      if (!serialized) return null

      const item: StorageItem = JSON.parse(serialized)

      if (this.isExpired(item)) {
        localStorage.removeItem(this.getKey(key))
        return null
      }

      return item.data as T
    } catch (error) {
      console.error("Storage get failed:", error)
      localStorage.removeItem(this.getKey(key))
      return null
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error("Storage remove failed:", error)
      return false
    }
  }

  clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_PREFIX))
      keys.forEach((key) => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error("Storage clear failed:", error)
      return false
    }
  }

  // User-specific data management
  saveUserData(userId: string, data: UserData): boolean {
    return this.set(`user_${userId}`, data)
  }

  getUserData(userId: string): UserData | null {
    return this.get<UserData>(`user_${userId}`)
  }

  // Export/Import functionality
  exportUserData(userId: string): string | null {
    const userData = this.getUserData(userId)
    if (!userData) return null

    const exportData = {
      userId,
      data: userData,
      exportedAt: new Date().toISOString(),
      version: this.CURRENT_VERSION,
    }

    return JSON.stringify(exportData, null, 2)
  }

  importUserData(userId: string, importData: string): boolean {
    try {
      const parsed = JSON.parse(importData)

      if (!parsed.data || !parsed.version) {
        throw new Error("Invalid import format")
      }

      return this.saveUserData(userId, parsed.data)
    } catch (error) {
      console.error("Import failed:", error)
      return false
    }
  }

  // Analytics and monitoring
  getStorageStats(): {
    totalSize: number
    itemCount: number
    oldestItem: number
    newestItem: number
  } {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_PREFIX))
    let totalSize = 0
    let oldestTimestamp = Date.now()
    let newestTimestamp = 0

    keys.forEach((key) => {
      const value = localStorage.getItem(key)
      if (value) {
        totalSize += value.length
        try {
          const item = JSON.parse(value)
          if (item.timestamp) {
            oldestTimestamp = Math.min(oldestTimestamp, item.timestamp)
            newestTimestamp = Math.max(newestTimestamp, item.timestamp)
          }
        } catch (error) {
          // Ignore parsing errors
        }
      }
    })

    return {
      totalSize,
      itemCount: keys.length,
      oldestItem: oldestTimestamp,
      newestItem: newestTimestamp,
    }
  }
}

export const storageService = StorageService.getInstance()

// Legacy export for backward compatibility
export function saveSession(sessionData: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const success = storageService.set("session", sessionData)
    if (success) {
      resolve()
    } else {
      reject(new Error("Failed to save session"))
    }
  })
}
