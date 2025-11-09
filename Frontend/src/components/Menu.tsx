import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'


import logo from "../assets/Unipat.png"

function Menu(){

    return (
        <Navbar expand={false} className='bg-body-tertiary'>
            <Container className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3 align-items-center">

                    <Navbar.Brand href='/' className='d-flex gap-3 align-items-center'> 
                        <img src={logo} width="100" height="100" className="d-inline-block align-top" alt="Logo UNPSJB" />
                    </Navbar.Brand>
                    <h1 className="text-nowrap" > Sistema de encuestas UNPSJB </h1>                
                </div>
                
                <Navbar.Toggle aria-controls="menu-navbar-nav" />

                <Navbar.Collapse id="menu-navbar-nav">
                    <Nav>
                        <Nav.Link href='/'> <i className="fa-solid fa-house"></i> Volver al inicio </Nav.Link>
                        <Nav.Link href="/EstadisticasDeDocente"> Ver Estadisticas Catedra</Nav.Link>
                        <Nav.Link href='/RespuestasFormularios'> Ver Respuestas </Nav.Link>
                        <Nav.Link href="/VerPregunta">Ver preguntas</Nav.Link>
                        <Nav.Link href="/CrearFormulario">Crear Formulario</Nav.Link>  
                        <Nav.Link href="/VerInformesSinteticos">Informes Sintéticos</Nav.Link>  
                        <Nav.Link href="/VerInformeActividadCurricular">Ver Informes de Actividad Curricular</Nav.Link>  
                        <Nav.Link href="/VerEncuestasEstudiante">Encuestas de Estudiante</Nav.Link>
                        <Nav.Link href="/seleccionar-informe-sintetico">Responder Informe Sintetico</Nav.Link>
                        <Nav.Link href="/instrumentos-docente">Responder Informe Catedra</Nav.Link>
                        <Nav.Link href="/materias">Responder Encuestas</Nav.Link>
                        <Nav.Link href="/MostrarEstadisticas">Ver Estadisticas Encuestados</Nav.Link>
                        <Nav.Link href="/monitoreo-recordatorios">Testing de emails</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    )

}


export default Menu;