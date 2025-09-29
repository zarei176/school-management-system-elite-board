import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  user: { username: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'iran@1404'
}

const AUTH_STORAGE_KEY = 'school_admin_auth'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ username: string } | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY)
      if (authData) {
        const { isAuth, username, timestamp } = JSON.parse(authData)
        
        // Check if session is still valid (24 hours)
        const now = Date.now()
        const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours
        
        if (isAuth && username && (now - timestamp) < sessionDuration) {
          setIsAuthenticated(true)
          setUser({ username })
        } else {
          // Session expired
          localStorage.removeItem(AUTH_STORAGE_KEY)
          setIsAuthenticated(false)
          setUser(null)
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      localStorage.removeItem(AUTH_STORAGE_KEY)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const authData = {
          isAuth: true,
          username,
          timestamp: Date.now()
        }
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
        setIsAuthenticated(true)
        setUser({ username })
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
    setUser(null)
  }

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext