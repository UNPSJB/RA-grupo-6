import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilDescription,
  cilNotes,
  cilPencil,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import RequireAuthNavItem from './components/Auth/RequireAuthNavItem'

const _nav = [
  
  {
    component: CNavItem,
    name: 'Comparar Plantillas',
    to: '/',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: RequireAuthNavItem,
    roles: ['Docente'], 
    item: {
      component: CNavTitle,
      name: 'Secretaría Académica',
    },
  },
  {
    component: CNavItem,
    name: 'Estadísticas Generales',
    to: '/MostrarEstadisticas',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Estadísticas por Docente',
    to: '/EstadisticasDeDocente',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Planificar Períodos',
    to: '/PlanificarPeriodos',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Formularios y Reportes',
  },
  {
    component: CNavItem,
    name: 'Crear Formulario',
    to: '/CrearFormulario',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Ver Informes Sintéticos',
    to: '/VerInformesSinteticos',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Monitoreo de Recordatorios',
    to: '/monitoreo-recordatorios',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Roles',
  },
  {
    component: CNavGroup,
    name: 'Departamento',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Informe Sintético',
        to: '/seleccionar-informe-sintetico',
      },
      {
        component: CNavItem,
        name: 'Informe Act. Curricular',
        to: '/VerInformeActividadCurricular',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Docente',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Instrumentos',
        to: '/instrumentos-docente',
      },
      {
        component: CNavItem,
        name: 'Ver Encuestas',
        to: '/VerEncuestasEstudiante',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Estudiante',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Materias',
        to: '/materias',
      },
      {
        component: CNavItem,
        name: 'Responder Formularios',
        to: '/RespuestasFormularios',
      },
    ],
  },
]

export default _nav
