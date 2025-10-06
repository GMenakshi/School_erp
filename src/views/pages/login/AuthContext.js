import React, { createContext, useState, useContext, useEffect } from 'react'

// Create the context
const AuthContext = createContext(null)

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Add a loading state

  // Check for existing session on initial load
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error)
    }
    setLoading(false) // Finished checking
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    sessionStorage.setItem('user', JSON.stringify(userData))
    sessionStorage.setItem('authToken', token)
    sessionStorage.setItem('isLoggedIn', 'true')
  }

  const logout = () => {
    setUser(null)
    sessionStorage.clear()
  }

  const value = { user, login, logout, isAuthenticated: !!user }

  // Render children only after checking the session
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

// Custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext)
}
