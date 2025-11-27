import CIcon from '@coreui/icons-react'
import {
    cilBell,
    cilChartPie,
    cilDescription,
    cilNotes,
    cilPencil,
    cilBarChart,
    cilClone,
    cilShortText,
    cilCalendarCheck,
    cilHome,
} from '@coreui/icons'
import {CNavItem, CNavTitle } from '@coreui/react'

const navSecretaria = [
    /* { component: CNavTitle, name: 'Secretaría Académica' }, */
    {
        component: CNavItem,
        name: 'Home',
        to: '/dashboard',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    },
    
    { component: CNavTitle, name: 'Formularios y Reportes' },
    {
        component: CNavItem,
        name: 'Tasa de Respuestas',
        to: '/MostrarEstadisticas',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Comparar plantillas',
        to: '/comparar-plantillas',
        icon: <CIcon icon={cilClone} customClassName="nav-icon" />,
    },
    // {
    //     component: CNavItem,
    //     name: 'Informes Sintéticos',
    //     to: '/VerInformesSinteticos',
    //     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    // },
    {
        component: CNavItem,
        name: 'Banco de Preguntas',
        to: '/VerPregunta',
        icon: <CIcon icon={cilShortText} customClassName="nav-icon" />,
    },
    { component: CNavTitle, name: 'Acciones' },
    
    {
        component: CNavItem,
        name: 'Crear Formulario',
        to: '/CrearFormulario',
        icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    },
    
    
    {
        component: CNavItem,
        name: 'Planificar Períodos',
        to: '/PlanificarPeriodos',
        icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Enviar Recordatorios',
        to: '/monitoreo-recordatorios',
        icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    },
    
    
    
];

const navDepartamento = [
    { component: CNavTitle, name: 'Departamento' },
    {
        component: CNavItem,
        name: 'Home',
        to: '/dashboard',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Responder formularios',
        to: '/seleccionar-informe-sintetico',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Desempeño de Cátedras',
        to: '/EstadisticasDeDocente',
        icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    },
    
    {
        component: CNavItem,
        name: 'Tasa de Respuestas',
        to: '/mostrar-estadisticas-departamento',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Mis Respuestas',
        to: '/respuestas-informe-sintetico',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },


];

const navDocente = [
    { component: CNavTitle, name: 'Docente' },

    {
        component: CNavItem,
        name: 'Home',
        to: '/dashboard',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Responder Formularios',
        to: '/instrumentos-docente',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    },
    /* {
        component: CNavItem,
        name: 'Ver Encuestas',
        to: '/VerEncuestasEstudiante',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    }, */
    {
        component: CNavItem,
        name: 'Tasa Respuestas Alumnos',
        to: '/TasaRespuestasAlumnos/',
        icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Mis Respuestas',
        to: '/respuestas-informe-catedra',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },

];

const navEstudiante = [
    { component: CNavTitle, name: 'Estudiante' },

    {
        component: CNavItem,
        name: 'Home',
        to: '/dashboard',
        icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Responder Formularios',
        to: '/materias',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Mis Respuestas',
        to: '/respuestas-encuesta-estudiante',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },

];

const navDefault = [
    // El componente Home se encarga de la redirección inicial.
];

const navigation = {
    'secretaria academica': navSecretaria,
    'departamento': navDepartamento,
    'docente': navDocente,
    'estudiante': navEstudiante,
    'default': navDefault
};

export default navigation;
