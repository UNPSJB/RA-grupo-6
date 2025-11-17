import React from 'react'
import AppSidebar from '../components/coreui-components/AppSidebar'
import AppHeader from '../components/coreui-components/AppHeader'
import AppContent from '../components/coreui-components/AppContent'
import AppFooter from '../components/coreui-components/AppFooter'
import { CCard, CContainer } from '@coreui/react'


const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader/>
        <div className="body flex-grow-1">
           <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
