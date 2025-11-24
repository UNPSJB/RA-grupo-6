import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilAccountLogout,
  cilFile,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useAuth } from '../../../context/AuthContext'
import avatar8 from '../../../assets/images/user/avatar_unknown.png'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    console.log('Cerrando sesión...')
    logout() 
    navigate('/login')
  }

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle className="py-0 pe-0" caret={false}>
        <i className="fa-solid fa-user mt-1" style={{fontSize:"28px"}}></i>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {user ? `${user.nombre} ${user.apellido}` : 'Cuenta'}
          <div className="small text-medium-emphasis">{user?.rol?.nombre}</div>
        </CDropdownHeader>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
