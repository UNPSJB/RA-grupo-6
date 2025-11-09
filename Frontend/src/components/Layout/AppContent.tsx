// src/components/Layout/AppContent.tsx
import React, { Suspense } from 'react'
import { CContainer, CSpinner } from '@coreui/react'

// ¡Mucho más simple! Solo acepta 'children' (que será el <Outlet/>)
const AppContent = ({ children }: any) => {
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        {children} {/* Renderiza el Outlet aquí */}
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)