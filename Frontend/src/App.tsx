import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SeleccionarMateria from './components/alumno/SeleccionarMateria';
import MateriaList from './components/materia';
import Layout from './components/Layout';

import './App.css';

function App() {
  return (
    <div className="bg-black text-white min-vh-100 p-4">
      <SeleccionarMateria />
    </div>
  )
}

export default App;

/*
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alumno" element={<SeleccionarMateria/>} />
          <Route path="/profesor" element={<MateriaList />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center mt-5">
      <h2>Sistema de Encuestas UNPSJB</h2>
      <div className="mt-4">
        <a href="/alumno" className="btn btn-primary me-3">Soy Alumno</a>
        <a href="/profesor" className="btn btn-secondary">Soy Profesor</a>
      </div>
    </div>
  );
}

export default App;
*/