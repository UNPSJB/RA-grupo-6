import React, { type JSX } from 'react'
import { useSelector, type TypedUseSelectorHook } from 'react-redux'
import { Navigate } from 'react-router-dom'

interface AuthState {
  isAuthenticated: boolean
  // ... otras propiedades del estado de autenticación
}

interface RootState {
  auth: AuthState
}

const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuthSelector((state) => state.auth)

  //si no está logueado, redirige a la página de login.
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
export default PrivateRoute