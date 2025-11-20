import React from 'react'
import { useSelector, useDispatch,  } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import { useAuth } from '../../context/AuthContext'

import logo from '../../assets/Unipat.png'
//import { sygnet } from 'src/assets/brand/sygnet'

import navigation from '../../_nav'

interface RootState {
  sidebarUnfoldable: boolean
  sidebarShow: boolean
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state: RootState) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state: RootState) => state.sidebarShow)
  const { user } = useAuth();

  const userRole = user?.rol?.nombre.toLowerCase() || 'default';
  const navItems = navigation[userRole as keyof typeof navigation] || navigation['default'];


  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom pb-0 pt-0">
        <CSidebarBrand href="/" className="text-decoration-none ">
          <div className="sidebar-brand-full ">
            
            <img src={logo} height={32} alt="Logo" className=' mb-2'/><span className="sidebar-brand-text fs-3 fw-semibold "> UNPSJB</span>
          </div>
          <img src={logo} height={32} alt="Logo" className="sidebar-brand-narrow" />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navItems} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
