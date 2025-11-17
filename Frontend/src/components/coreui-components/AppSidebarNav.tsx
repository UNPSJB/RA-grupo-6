import React, { type FC } from 'react' 
import { NavLink } from 'react-router-dom'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavGroup, CNavItem, CNavLink, CNavTitle, CSidebarNav } from '@coreui/react'

interface NavBadge {
  color: string 
  text: string 
}
interface NavItemBase {
  component: React.ElementType
  name?: string
  icon?: React.ReactNode 
  badge?: NavBadge
  className?: string
  [key: string]: any 
}

interface NavLinkItem extends NavItemBase {
  to?: string 
  href?: string 
  items?: NavItem[] 
}

interface NavGroupItem extends NavItemBase {
  items: NavItem[] 
  to?: never 
  href?: never
}

type NavItem = NavLinkItem | NavGroupItem

interface AppSidebarNavProps {
  items: NavItem[] 
}


export const AppSidebarNav: FC<AppSidebarNavProps> = ({ items }) => {
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

  const navItem = (item: NavLinkItem, index: number, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component

    if (Component !== CNavItem && Component !== CNavTitle && Component !== CNavGroup) {
      return <Component key={index} {...item} />
    }
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })} 
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })} 
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item: NavGroupItem, index: number) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {items?.map((subItem, subIndex) =>
          'items' in subItem && subItem.items ? navGroup(subItem as NavGroupItem, subIndex) : navItem(subItem as NavLinkItem, subIndex, true),
        )}
      </Component>
    )
  }

  return (
  <CSidebarNav as={SimpleBar}>
    {items &&
      items.map((item, index) =>
        'items' in item && item.items ? 
          navGroup(item as NavGroupItem, index) : 
          navItem(item as NavLinkItem, index),
      )}
  </CSidebarNav>
)
}