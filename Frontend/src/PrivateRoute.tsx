import React, { type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext' 

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return null // O un spinner global
  }

  return user ? children : <Navigate to="/login" replace />
}

export default PrivateRoute