import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext' // Adjust path if needed

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
