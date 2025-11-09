// src/components/Layout/AppSidebarNav.tsx

import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
// 1. ELIMINAMOS la importación de PropTypes
import { CBadge } from '@coreui/react'

// 2. DEFINIMOS la interface de Props
interface AppSidebarNavProps {
  items: any[];
}

export const AppSidebarNav = ({ items }: AppSidebarNavProps) => { // 3. APLICAMOS el tipo aquí
  const location = useLocation()

  // 4. AÑADIMOS 'any' y hacemos 'badge' opcional con '?'
  const navLink = (name: any, icon: any, badge?: any) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item: any, index: any) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            // 5. CAMBIO V5: 'component' ahora es 'as'
            as: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }

  const navGroup = (item: any, index: any) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        // 6. Esta llamada ahora es VÁLIDA porque 'badge' es opcional
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item: any, index: any) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item: any, index: any) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

// 7. ELIMINAMOS todo el bloque 'AppSidebarNav.propTypes'