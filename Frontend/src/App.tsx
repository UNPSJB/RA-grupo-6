import React, { Suspense, useEffect, type FC } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector, type TypedUseSelectorHook } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

import PrivateRoute from './PrivateRoute.tsx' 
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login.tsx'))
const Register = React.lazy(() => import('./views/pages/register/Register.tsx'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404.tsx'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500.tsx'))


interface AuthState {
  isAuthenticated: boolean
}

interface RootState {
  theme: string
}

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


const App: FC = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useAppSelector((state) => state.theme)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const themeMatch = urlParams.get('theme') && urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)
    const theme = themeMatch ? themeMatch[0] : null
    if (theme) {
      setColorMode(theme)
    }
    if (isColorModeSet()) {
      return
    }
    setColorMode(storedTheme)
  }, [isColorModeSet, setColorMode, storedTheme])
  return (
    <BrowserRouter >
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <DefaultLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App