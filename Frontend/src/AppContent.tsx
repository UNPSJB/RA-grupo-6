import { CContainer } from '@coreui/react'

const AppContent = () => {
  return (
    <CContainer lg>
      {/* --- PRUEBA DE AISLAMIENTO --- */}
      {/* Si el layout se ve bien con esto, el problema está en uno de los componentes de las rutas. */}
      <div>
        <h1>El contenido del Body se renderiza aquí.</h1>
      </div>
    </CContainer>
  )
}

export default AppContent