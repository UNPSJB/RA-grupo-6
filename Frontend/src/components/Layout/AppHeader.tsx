// src/components/Layout/AppHeader.tsx
import React from 'react'
import { NavLink,Link } from 'react-router-dom'
// 1. ¡Eliminados useSelector y useDispatch!
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header'

// 2. Comentamos Breadcrumb porque no lo usaremos por ahora
// import { AppBreadcrumb } from './AppBreadcrumb' 

// 3. Importa tu logo (¡ajusta esta ruta!)
// Asumo que no tienes este logo, así que lo comento.
// import { logo } from '../../assets-coreui/brand/logo' 

// 4. Recibe las props de AdminLayout
const AppHeader = ({ sidebarShow, setSidebarShow }: any) => {

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          // 5. El click ahora usa la prop, ¡sin Redux!
          onClick={() => setSidebarShow(!sidebarShow)}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" as={Link} to="/">
          {/* <CIcon icon={logo} height={48} alt="Logo" /> */}
          <span>Tu App</span>
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          {/* Estos son enlaces de ejemplo, puedes borrarlos */}
          <CNavItem>
          <CNavLink to="/dashboard" as={NavLink}>
            Dashboard
          </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
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
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        {/* <AppBreadcrumb /> */} {/* Comentado */}
      </CContainer>
    </CHeader>
  )
}

export default AppHeader