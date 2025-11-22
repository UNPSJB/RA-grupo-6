import React, { type JSX } from 'react'
import { useSelector, type TypedUseSelectorHook } from 'react-redux'
import { Navigate } from 'react-router-dom'

interface AuthState {
  isAuthenticated: boolean
}

interface RootState {
  auth: AuthState
}

const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuthSelector((state) => state.auth)

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
export default PrivateRoute