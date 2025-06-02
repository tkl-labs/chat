'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
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
      setLoading(true)
      await checkAuth()
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const value: UserContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
    checkAuth,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}