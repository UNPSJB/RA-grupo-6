import React, { Suspense, useEffect, type FC } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector, type TypedUseSelectorHook } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// --- 1. Lazy Loading Components ---
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// Importa los componentes perezosos como React.Lazy<FC> o React.Lazy<() => JSX.Element>
const Login = React.lazy(() => import('./views/pages/login/Login.tsx'))
const Register = React.lazy(() => import('./views/pages/register/Register.tsx'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404.tsx'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500.tsx'))

// --- 2. Definición del Tipo de Estado de Redux ---

/**
 * Define la estructura del estado global de Redux que App necesita.
 * Asumimos que 'theme' es de tipo string (ej: 'light', 'dark', 'auto').
 */
interface RootState {
  theme: string
  // ... otras propiedades de tu estado global
}

// Creamos un `useSelector` tipado para usarlo sin aserciones 'any'.
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// --- 3. Componente Principal ---

const App: FC = () => {
  // 💡 useColorModes devuelve un objeto con la función isColorModeSet y la función setColorMode.
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  
  // 💡 Uso del hook tipado para obtener 'theme' del estado de Redux.
  const storedTheme = useAppSelector((state) => state.theme)

  useEffect(() => {
    // 💡 Tipificación implícita: URLSearchParams y window.location son objetos de navegador tipados.
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    
    // El método .match() devuelve string[] o null. TS infiere esto.
    const themeMatch = urlParams.get('theme') && urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)
    
    // 💡 Uso de Type Guard (themeMatch && themeMatch[0]) para asegurar el valor.
    const theme = themeMatch ? themeMatch[0] : null
    
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
    
  }, [isColorModeSet, setColorMode, storedTheme]) // 💡 Se añaden dependencias explícitas para evitar el warning 'exhaustive-deps'

  return (
    <HashRouter>
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
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App