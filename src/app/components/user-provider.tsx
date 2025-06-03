'use client'

import { AxiosError } from 'axios'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/db-types'

interface UserContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  checkAuth: () => Promise<boolean>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on app load
  const checkAuth = async (): Promise<boolean> => {
    try {
      // Try to get user info from backend using the JWT cookie
      const response = await api.get('/auth/me')
      if (response.data) {
        setUser(response.data)
        return true
      }
      return false
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        (error as AxiosError).isAxiosError &&
        (error as AxiosError).response?.status === 401
      ) {
        // Unauthorized - don't log an error, just reset user
        setUser(null)
      } else {
        // Log errors that are not 401
        console.error('Auth check failed:', error)
      }
      return false
    }
  }

  const login = (userData: User) => {
    setUser(userData)
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to clear the JWT cookie
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      router.push('/login')
    }
  }

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  // Check authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (user === null) {
        setLoading(true)
        await checkAuth()
        setLoading(false)
      }
    }

    initializeAuth()
  }, [user])

  const value: UserContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
    checkAuth,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
