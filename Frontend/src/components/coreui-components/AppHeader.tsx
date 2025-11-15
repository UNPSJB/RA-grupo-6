import { CContainer, CHeader, CHeaderToggler } from '@coreui/react'

interface AppHeaderProps {
  onToggleSidebar: () => void
}

const AppHeader = ({ onToggleSidebar }: AppHeaderProps) => {
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler onClick={onToggleSidebar} style={{ marginInlineStart: '-14px' }} />
        {/* Aquí puedes añadir más elementos, como un menú de perfil de usuario */}
      </CContainer>
    </CHeader>
  )
}

export default AppHeader