// src/_nav.tsx
import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilNotes, cilPencil, cilList } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Estadísticas',
    to: '/', // Tu ruta "index"
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Materias',
    to: '/Materias',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Crear Formulario',
    to: '/CrearFormulario',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Ver Preguntas',
    to: '/VerPregunta',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  // ... Agrega todos tus otros enlaces aquí
]

export default _nav