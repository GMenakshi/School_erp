import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/firebase'
import { Navigate, useLocation } from 'react-router-dom'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Setting up auth listener')
    // Check if there's a stored user in sessionStorage
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
      setLoading(false)
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user')
      if (user) {
        // Store user in sessionStorage
        const userToStore = {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
        }
        sessionStorage.setItem('user', JSON.stringify(userToStore))
        setCurrentUser(user)
      } else {
        sessionStorage.removeItem('user')
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return () => {
      console.log('Cleaning up auth listener')
      unsubscribe()
    }
  }, [])

  const value = {
    currentUser,
    setCurrentUser,
    isAuthenticated: !!currentUser,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export function RequireAuth({ children }) {
  const { currentUser, isAuthenticated } = useAuth()
  const location = useLocation()

  console.log('RequireAuth check:', { isAuthenticated, path: location.pathname })

  // Check both the context and sessionStorage
  const storedUser = sessionStorage.getItem('user')
  if (!currentUser && !storedUser) {
    console.log('No authenticated user found, redirecting to login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
