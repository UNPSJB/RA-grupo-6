import React, { useEffect, useRef, type RefObject } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch, type TypedUseSelectorHook } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import AppHeaderDropdown from './header/AppHeaderDropdown'
import AppBreadcrumb from './AppBreadcrumb'

// --- 1. Definición del Tipo de Estado de Redux (Ejemplo) ---

// Debes reemplazar 'RootState' con el tipo real de tu estado de Redux.
// Basado en tu uso de `state.sidebarShow`, el estado global se vería así:
interface RootState {
  sidebarShow: boolean | 'responsive' // CoreUI a menudo usa 'responsive' o booleanos
  sidebarUnfoldable: boolean
  // ... cualquier otra propiedad en tu estado global
  // type: string // Si tu estado contiene el action type (menos común)
}

// Creamos un `useSelector` tipado para usarlo sin aserciones 'any'.
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
// (Si usas Redux Toolkit, esto se haría en tu store file, pero funciona aquí temporalmente)

// --- 2. Implementación del Componente ---

const AppHeader = () => {
  // 💡 Tipificación de useRef: Usamos HTMLDivElement o null.
  const headerRef: RefObject<HTMLDivElement | null> = useRef(null)
  
  // 💡 useColorModes devuelve el modo (string) y la función set (función)
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  // 💡 Tipificación de useDispatch
  const dispatch = useDispatch()
  
  // 💡 Tipificación de useSelector: Usamos el hook tipado `useAppSelector`
  const sidebarShow = useAppSelector((state) => state.sidebarShow)

  useEffect(() => {
    const handleScroll = () => {
      // 💡 Comprobación de tipo para asegurarse de que ref.current no es null
      if (headerRef.current) {
        // Toggle 'shadow-sm' en la clase del elemento
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    }

    document.addEventListener('scroll', handleScroll)
    // El cleanup es importante y tipado correctamente
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          // 💡 Manejador de eventos (dispatch)
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        
        {/* ... Resto del CHeaderNav con enlaces ... */}
        
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>
        
        {/* ... CHeaderNav iconos de notificación ... */}
        
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        
        {/* ... CHeaderNav Dropdown para Color Mode ... */}
        
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader