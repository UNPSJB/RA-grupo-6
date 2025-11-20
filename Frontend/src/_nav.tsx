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
    cilBuilding,
    cilEducation,
    cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const navSecretaria = [
    { component: CNavTitle, name: 'Secretaría Académica' },
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
    { component: CNavTitle, name: 'Formularios y Reportes' },
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
];

const navDepartamento = [
    { component: CNavTitle, name: 'Departamento' },
    {
        component: CNavItem,
        name: 'Completar Informe Sintético',
        to: '/seleccionar-informe-sintetico',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Ver Informes de Cátedra',
        to: '/VerInformeActividadCurricular',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Ver Encuestas de Estudiantes',
        to: '/VerEncuestasEstudiante',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    },
];

const navDocente = [
    { component: CNavTitle, name: 'Acciones' },
    {
        component: CNavItem,
        name: 'Completar Informe',
        to: '/instrumentos-docente',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Ver Encuestas',
        to: '/VerEncuestasEstudiante',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    },
];

const navEstudiante = [
    { component: CNavTitle, name: 'Estudiante' },
    {
        component: CNavItem,
        name: 'Responder Encuestas',
        to: '/materias',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    },
];

const navDefault = [
    {
        component: CNavItem,
        name: 'Inicio',
        to: '/',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
];

const navigation = {
    'secretaria': navSecretaria,
    'departamento': navDepartamento,
    'docente': navDocente,
    'alumno': navEstudiante,
    'default': navDefault
};

export default navigation;
