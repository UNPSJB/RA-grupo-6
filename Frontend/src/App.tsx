import './App.css';
import CrearPreguntaAbierta from './components/CrearPreguntaAbierta';
import CrearPreguntaCerrada from'./components/CrearPreguntaCerrada';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>Titulo</h1> */}
      </header>
      <main>
        <CrearPreguntaAbierta />
        <CrearPreguntaCerrada />
      </main>
    </div>
  )
}

export default App;