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
                        <Nav.Link href="/VerPregunta">Ver preguntas</Nav.Link>
                        <Nav.Link href="/CrearPregunta">Crear preguntas</Nav.Link>
                        <Nav.Link href="/CrearFormulario">Crear Formulario</Nav.Link>    
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    )

}


export default Menu;