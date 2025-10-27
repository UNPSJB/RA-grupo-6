import { useEffect, useState } from "react";
import { Badge, Button, ListGroup } from "react-bootstrap";
import { EnumTipoPregunta, type GrupoPregunta, type Instrumento, type Pregunta } from "../types";
import { ModalRespuestasAbiertas } from "./ModalRespuestasAbiertas";


export function Llamadora({ id_instrumento }: { id_instrumento: number }) {
  const [instrumento, setInstrumento] = useState<Instrumento>();
  const url_base = `http://127.0.0.1:8000/instrumentos/${1}/detail`;

  console.log("ID instrumento recibido en Llamadora:", id_instrumento);

  useEffect(() => {
    fetch(url_base)
      .then(res => res.json())
      .then(data => setInstrumento(data))
      .catch(err => console.log(err));
  }, [url_base]);

  return instrumento ? <VerPorcentajes instrumento={instrumento} /> : <p>Cargando...</p>;
}


export function VerPorcentajes({ instrumento }: { instrumento: Instrumento }) {
  const [respuestasMostradas, setRespuestasMostradas] = useState<Pregunta[]>([]);
  const [mostrar, setMostrar] = useState(false);

  
  const todasLasRespuestas = instrumento?.respuestas_formulario?.flatMap(rf => rf.respuestas) ?? [];

    console.log("Todas las respuestas planas:", todasLasRespuestas);
  console.log("Preguntas del formulario:", instrumento.plantilla_formulario.preguntas);
  useEffect(() => {
    if (instrumento) {
      const grupos = obtenerGrupos();
      if (grupos.length > 0) {
        const primerGrupo = grupos[0];
        setRespuestasMostradas(
          instrumento.plantilla_formulario.preguntas.filter(
            p => p.grupo_pregunta.id === primerGrupo.id
          )
        );
      }
    }
  }, [instrumento]);

  function obtenerCantRespuestasOpcion(id_pregunta: number, texto_opcion: string) {
    return todasLasRespuestas.filter(r => r.pregunta.id === id_pregunta && r.opcion?.texto === texto_opcion).length;
  }

  function obtenerCantRespuestas(id_pregunta: number) {
    return todasLasRespuestas.filter(r => r.pregunta.id === id_pregunta).length;
  }

  function obtenerGrupos(): GrupoPregunta[] {
    const grupos: GrupoPregunta[] = [];
    const ids: number[] = [];
    instrumento?.plantilla_formulario.preguntas.forEach(p => {
      if (!ids.includes(p.grupo_pregunta.id)) {
        grupos.push(p.grupo_pregunta);
        ids.push(p.grupo_pregunta.id);
      }
    });
    return grupos;
  }

  return (
    <div className="container border rounded p-3">
      <div className="d-flex align-items-end justify-content-between m-3">
        <h3>
          <i className="fa-solid fa-graduation-cap m-3"></i> Respuestas de los estudiantes
        </h3>
        <h4>{instrumento?.plantilla_formulario.preguntas.length} preguntas</h4>
      </div>

      <div className="choose-group d-flex gap-3 m-3">
        {obtenerGrupos().map(grupo => (
          <Button
            key={grupo.id}
            onClick={() =>
              setRespuestasMostradas(
                instrumento?.plantilla_formulario.preguntas.filter(p => p.grupo_pregunta.id === grupo.id) ?? []
              )
            }
          >
            Grupo {grupo.letra}
          </Button>
        ))}
      </div>

      {respuestasMostradas.map((pregunta, numero) => (
        <ListGroup key={pregunta.id} className="border p-3 mb-3">
          <div className="d-flex gap-3">
            <Badge className="p-2 align-content-center">
              {pregunta.grupo_pregunta.letra}{numero + 1}
            </Badge>
            <Badge className="p-2 align-content-center">Pregunta {pregunta.tipo}</Badge>
          </div>

          <p className="mb-3 mt-3">{pregunta.texto}</p>

          {pregunta.tipo.toLowerCase() === EnumTipoPregunta.cerrada.toLowerCase() ? (
            pregunta.opciones.map(opcion => {
              const total = obtenerCantRespuestas(pregunta.id);
              const cantOpcion = obtenerCantRespuestasOpcion(pregunta.id, opcion.texto);
              const porcentaje = total ? Math.round((cantOpcion * 100) / total) : 0;

              return (
                <ListGroup.Item
                  key={opcion.id}
                  className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
                >
                  <p className="mb-0">{opcion.texto}</p>
                  <div className="d-flex gap-3">
                    <p className="mb-0">({cantOpcion} respuestas)</p>
                    <Badge className="p-2">{porcentaje}%</Badge>
                  </div>
                </ListGroup.Item>
              );
            })
          ) : (
            <>
              {todasLasRespuestas
                .filter(r => r.pregunta.id === pregunta.id)
                .slice(0, 3)
                .map((r, idx) => (
                  <ListGroup.Item key={idx} className="mb-3 border rounded p-3">
                    <p className="mb-0">{r.texto}</p>
                  </ListGroup.Item>
                ))}

              {todasLasRespuestas.filter(r => r.pregunta.id === pregunta.id).length > 3 && (
                <>
                  <Button onClick={() => setMostrar(true)}>
                    Ver todas las respuestas ({obtenerCantRespuestas(pregunta.id)})
                  </Button>
                  {mostrar && (
                    <ModalRespuestasAbiertas
                      ListaRespuestas={todasLasRespuestas}
                      numeroPregunta={numero}
                      pregunta={pregunta}
                      mostrar={mostrar}
                      setMostrar={setMostrar}
                    />
                  )}
                </>
              )}
            </>
          )}
        </ListGroup>
      ))}
    </div>
  );
}
