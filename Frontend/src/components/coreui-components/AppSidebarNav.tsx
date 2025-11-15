import React, { type FC } from 'react' 
import { NavLink } from 'react-router-dom'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

// --- 1. Definición de Tipos de Datos (Interfaces) ---

/**
 * Define la estructura de la insignia (badge)
 */
interface NavBadge {
  color: string // El color de la insignia (ej: 'info', 'success')
  text: string // El texto dentro de la insignia
}

/**
 * Define la estructura básica de un elemento de navegación (item)
 */
interface NavItemBase {
  component: React.ElementType // El componente CoreUI a usar (ej: 'CNavItem', 'CNavGroup')
  name?: string // El texto principal del enlace/grupo
  icon?: React.ReactNode // El icono del enlace/grupo
  badge?: NavBadge // La insignia opcional
  className?: string
  [key: string]: any // Permite otras propiedades de CoreUI o React
}

/**
 * Define un elemento de navegación que es un ENLACE (tiene 'to' o 'href')
 */
interface NavLinkItem extends NavItemBase {
  to?: string // Ruta interna para NavLink
  href?: string // URL externa
  items?: NavItem[] // Permitimos 'items' pero el componente lo manejará como un enlace si tiene 'to'/'href'
}

/**
 * Define un elemento de navegación que es un GRUPO (tiene 'items')
 */
interface NavGroupItem extends NavItemBase {
  items: NavItem[] // Array de sub-elementos (recursivo)
  to?: never // Un grupo generalmente no tiene una ruta principal
  href?: never
}

/**
 * Tipo para cualquier elemento de navegación: un Enlace o un Grupo
 */
type NavItem = NavLinkItem | NavGroupItem

/**
 * Define las propiedades (props) del componente AppSidebarNav
 */
interface AppSidebarNavProps {
  items: NavItem[] // El array principal de elementos de navegación
}

// --- 2. Implementación del Componente ---

export const AppSidebarNav: FC<AppSidebarNavProps> = ({ items }) => {
  // Función auxiliar para renderizar el contenido de un CNavLink o CNavGroup
  const navLink = (name?: string, icon?: React.ReactNode, badge?: NavBadge, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  // Función para renderizar un elemento de navegación individual (link)
  const navItem = (item: NavLinkItem, index: number, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })} // Usa NavLink si hay 'to'
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })} // Para enlaces externos
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          // Si no tiene 'to' ni 'href', se renderiza solo el contenido (útil para títulos o textos simples si se usa CNavItem)
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  // Función para renderizar un grupo de navegación (recursivo)
  const navGroup = (item: NavGroupItem, index: number) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {/* Recorrer los sub-elementos del grupo */}
        {items?.map((subItem, subIndex) =>
          // Si el sub-elemento tiene 'items', es otro grupo; si no, es un enlace
          'items' in subItem && subItem.items ? navGroup(subItem as NavGroupItem, subIndex) : navItem(subItem as NavLinkItem, subIndex, true),
        )}
      </Component>
    )
  }

  return (
  <CSidebarNav as={SimpleBar}>
    {items &&
      items.map((item, index) =>
        // Usa la comprobación de tipo ('items' in item) para distinguir
        'items' in item && item.items ? 
          navGroup(item as NavGroupItem, index) : 
          navItem(item as NavLinkItem, index),
      )}
  </CSidebarNav>
)
}