// src/components/Layout/AdminLayout.tsx
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom' // Importa Outlet
import AppContent from './AppContent'     // Importa los componentes localmente
import AppSidebar from './AppSidebar'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'

// Renombramos el componente a AdminLayout
const AdminLayout = () => {
  // 1. Aquí está nuestro estado "sin Redux"
  const [sidebarShow, setSidebarShow] = useState(true)

  return (
    <div>
      {/* 2. Pasamos el estado y el 'setter' como props */}
      <AppSidebar 
        sidebarShow={sidebarShow} 
        setSidebarShow={setSidebarShow} 
      />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader 
          sidebarShow={sidebarShow} 
          setSidebarShow={setSidebarShow} 
        />
        <div className="body flex-grow-1">
          {/* 3. AppContent ahora es solo un 'wrapper' */}
          <AppContent>
            <Outlet /> {/* 4. ¡Aquí se renderizarán TUS rutas! */}
          </AppContent>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default AdminLayout