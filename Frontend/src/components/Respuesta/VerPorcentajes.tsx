import { useEffect, useState } from "react";
import { Badge, Button, ListGroup } from "react-bootstrap";
import { EnumTipoPregunta, type GrupoPregunta, type Instrumento, type Pregunta } from "../types";
import { ModalRespuestasAbiertas } from "./ModalRespuestasAbiertas";
import { CBadge, CButton, CCardHeader, CCardTitle, CListGroup, CListGroupItem } from "@coreui/react";


export function Llamadora({ id_instrumento }: { id_instrumento: number }) {
  const [instrumento, setInstrumento] = useState<Instrumento>();
  const url_base = `http://127.0.0.1:8000/instrumentos/${1}/detail`;

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
  const [grupoActivoId, setGrupoActivoId] = useState<number | null>(null);

  
  const todasLasRespuestas = instrumento?.respuestas_formulario?.flatMap(rf => rf.respuestas) ?? [];

  useEffect(() => {
    if (instrumento) {
      const grupos = obtenerGrupos();
      if (grupos.length > 0) {
        const primerGrupo = grupos[0];
        setGrupoActivoId(primerGrupo.id);
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
    <>
      <CCardHeader className='border-0 rounded'>
        <div className='m-2'>
        <CCardTitle>
          {/* <i className="fa-solid fa-graduation-cap"></i>  */}
          Respuestas de los estudiantes
        
        </CCardTitle>
        <p className='text-muted'>{instrumento?.plantilla_formulario.preguntas.length} preguntas</p>
        </div>
      </CCardHeader>
      <div className="choose-group d-flex gap-3 m-3">
        {obtenerGrupos().map(grupo => (
          <CButton
            color={grupoActivoId === grupo.id ? 'primary' : 'outline-primary'}
            key={grupo.id}
            onClick={() => {
              setGrupoActivoId(grupo.id);
              setRespuestasMostradas(
                instrumento?.plantilla_formulario.preguntas.filter(p => p.grupo_pregunta.id === grupo.id) ?? []
              );
            }}
          >
            Grupo {grupo.letra}
          </CButton>
        ))}
      </div>

      {respuestasMostradas.map((pregunta, numero) => (
        <CListGroup key={pregunta.id} className="border p-3 mb-3">
          <div className="d-flex gap-3">
            <CBadge color='primary'>
              {pregunta.grupo_pregunta.letra}{numero + 1}
            </CBadge>
            <CBadge color='secondary'>Pregunta {pregunta.tipo}</CBadge>
          </div>

          <p className="mb-3 mt-3">{pregunta.texto}</p>

          {pregunta.tipo?.toLowerCase() === EnumTipoPregunta.cerrada.toLowerCase() ? (
            pregunta.opciones.map(opcion => {
              const total = obtenerCantRespuestas(pregunta.id);
              const cantOpcion = obtenerCantRespuestasOpcion(pregunta.id, opcion.texto);
              const porcentaje = total ? Math.round((cantOpcion * 100) / total) : 0;

              return (
                <CListGroupItem
                  key={opcion.id}
                  className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
                >
                  <p className="mb-0">{opcion.texto}</p>
                  <div className="d-flex gap-3">
                    <p className="mb-0">({cantOpcion} respuestas)</p>
                    <CBadge color='info' className="p-2">{porcentaje}%</CBadge>
                  </div>
                </CListGroupItem>
              );
            })
          ) : (
            <>
              {todasLasRespuestas
                .filter(r => r.pregunta.id === pregunta.id)
                .slice(0, 3)
                .map((r, idx) => (
                  <CListGroupItem key={idx} className="mb-3 border rounded p-3">
                    <p className="mb-0">{r.texto}</p>
                  </CListGroupItem>
                ))}

              {todasLasRespuestas.filter(r => r.pregunta.id === pregunta.id).length > 3 && (
                <>
                  <CButton onClick={() => setMostrar(true)}>
                    Ver todas las respuestas ({obtenerCantRespuestas(pregunta.id)})
                  </CButton>
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
        </CListGroup>
      ))}
    </>
  );
}
