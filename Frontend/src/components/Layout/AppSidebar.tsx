// src/components/Layout/AppSidebar.tsx
import React, { useState } from 'react' // Importa useState
// 1. ¡Eliminados useSelector y useDispatch!
import { Link } from 'react-router-dom'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav' // Asegúrate de tener este archivo

// 2. Asumo que no tienes estos logos, ajusta las rutas
// import { logoNegative } from 'src/assets-coreui/brand/logo-negative'
// import { sygnet } from 'src/assets-coreui/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

// 3. Importa TU config de navegación
import navigation from '../../_nav' // Sube un nivel para encontrar _nav.tsx

// 4. Recibe las props
const AppSidebar = ({ sidebarShow, setSidebarShow }: any) => {
  // 5. El estado 'unfoldable' ahora es local, no de Redux
  const [unfoldable, setUnfoldable] = useState(false)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow} // Usa la prop
      onVisibleChange={(visible) => {
        setSidebarShow(visible) // Usa el 'setter' de la prop
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" as={Link} to="/">
      {/* ... tus CIcon ... */}
      <h3>Encuestas</h3>
</CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        // 6. El Toggler ahora usa el estado local
        onClick={() => setUnfoldable(!unfoldable)}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)