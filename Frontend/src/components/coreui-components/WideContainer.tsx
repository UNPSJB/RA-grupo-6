import React from 'react'
import { CContainer } from '@coreui/react'

interface WideContainerProps {
  children: React.ReactNode
}

/**
 * A container component that occupies more width than the default lg container.
 * It uses 'fluid' to take up the full available width with consistent padding.
 */
const WideContainer: React.FC<WideContainerProps> = ({ children }) => {
  return (
    <CContainer fluid className="px-4">
      {children}
    </CContainer>
  )
}

export default WideContainer
