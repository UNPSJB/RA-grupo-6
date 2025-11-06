import type { instrumentoList } from "../types";
import type { DetalleEncuestaCompleto, DetalleInformeSinteticoCompleto } from "./types";


export const mockInformeSinteticoCompleto: DetalleInformeSinteticoCompleto = {
    id: 201,
    titulo_formulario: "Informe Sintético",
    fecha_completado: "2025-10-01",
    autor_administrativo: "Personal Administrativo",
    estadisticas: [
    { pregunta_id: 1, pregunta_texto: "¿El material de estudio fue suficiente para comprender el contenido?", opciones: [{ texto_opcion: "Sí", cantidad: 15 }, { texto_opcion: "Parcialmente", cantidad: 8 }, { texto_opcion: "No", cantidad: 2 }] },
    { pregunta_id: 2, pregunta_texto: "¿La dificultad fue...?", opciones: [{ texto_opcion: "Adecuada", cantidad: 20 }, { texto_opcion: "Demasiado difícil", cantidad: 5 }] },
  ],
    respuestas_sintesis_agrupadas: [
        {
        "grupo": "A",
        "titulo_grupo": "Análisis de Patrones y Dificultades",
        "respuestas": [
            {
            "pregunta_texto": "Identifique patrones o dificultades recurrentes observadas en los informes de cátedra.",
            "respuesta_texto": "Se observa una dificultad generalizada en la retención de alumnos de primer año..."
            }
        ]
        },
        {
        "grupo": "B",
        "titulo_grupo": "Propuestas de Mejora Departamentales",
        "respuestas": [
            {
            "pregunta_texto": "Describa las propuestas de mejora o acompañamiento que el Departamento implementará.",
            "respuesta_texto": "Se propondrá un taller de 'Nuevas Estrategias de Evaluación'..."
            }
        ]
        },
        {
        "grupo": "C",
        "titulo_grupo": "Gestión de Recursos",
        "respuestas": [
            {
            "pregunta_texto": "Reflexión sobre los recursos solicitados por las cátedras (software, equipamiento, etc.).",
            "respuesta_texto": "Es recurrente la solicitud de actualización de software de laboratorios..."
            }
        ]
        }
    ],
    informes_academicos_base: [
        {
        id: 101,
        titulo_formulario: "Informe de Actividad Curricular",
        docente_nombre: "Dr. Juan Pérez",
        respuestas_abiertas_agrupadas: [
            {
            "grupo": "A",
            "titulo_grupo": "Planificación de la enseñanza...",
            "respuestas": [
                {
                "pregunta_texto": "¿En qué medida pudo cumplir con el cronograma...?",
                "respuesta_texto": "Se logró cubrir el 90% del programa..."
                },
                {
                "pregunta_texto": "Reflexione sobre las estrategias pedagógicas...",
                "respuesta_texto": "La modalidad de taller en las últimas unidades..."
                }
            ]
            },
            {
            "grupo": "B",
            "titulo_grupo": "Régimen de cursada...",
            "respuestas": [
                {
                "pregunta_texto": "Analice los resultados de la cursada...",
                "respuesta_texto": "La promoción fue baja (15%)..."
                }
            ]
            }
        ]
        },
        {
        id: 102,
        titulo_formulario: "Informe de Actividad Curricular - Algoritmos - 2C 2025",
        docente_nombre: "Ing. Ana Gómez",
        respuestas_abiertas_agrupadas: [
            {
            "grupo": "A",
            "titulo_grupo": "Planificación de la enseñanza...",
            "respuestas": [
                {
                "pregunta_texto": "¿En qué medida pudo cumplir con el cronograma...?",
                "respuesta_texto": "Tuvimos que acortar la Unidad 4 por el paro."
                }
            ]
            },
            {
            "grupo": "C",
            "titulo_grupo": "Material didáctico y bibliografía",
            "respuestas": [
                {
                "pregunta_texto": "¿Qué recursos considera necesarios...",
                "respuesta_texto": "Se solicita un ayudante de segunda adicional..."
                }
            ]
            }
        ]
        }
    ]
};


export const mockDetalleCompleto: DetalleEncuestaCompleto = { 
  id: 301, 
  titulo_formulario: 'Encuesta de fin de cursada - Algorítmica y Programación I', 
  estadisticas: [
    { pregunta_id: 1, pregunta_texto: "¿El material de estudio proporcionado fue claro y útil?", opciones: [{ texto_opcion: "Sí, completamente", cantidad: 85 }, { texto_opcion: "Parcialmente", cantidad: 30 }, { texto_opcion: "No, fue confuso", cantidad: 5 }] },
    { pregunta_id: 2, pregunta_texto: "¿La dificultad de las evaluaciones fue adecuada?", opciones: [{ texto_opcion: "Demasiado fácil", cantidad: 10 }, { texto_opcion: "Adecuada", cantidad: 105 }, { texto_opcion: "Demasiado difícil", cantidad: 5 }] },
  ],
  respuestas_abiertas_agrupadas: [
    {
      grupo: 'GENERAL',
      titulo_grupo: 'Respuestas Abiertas',
      preguntas: [ 
        { pregunta_texto: '¿Qué tema te resultó más interesante?', respuestas_abiertas: [ 'El manejo de punteros.', 'La recursividad.', 'Entender arrays por dentro.' ] }, 
        { pregunta_texto: 'Sugerencias para el próximo cuatrimestre', respuestas_abiertas: [ 'Más ejercicios prácticos.', 'Un proyecto final más grande.', 'Ninguna, todo perfecto.' ] } 
      ]
    }
  ] 
};


export const INSTRUMENTO_CONFIG = {
  INFORME_SINTETICO: {
    titulo: "Informes Sintéticos",
    subtitulo: "Seleccione un informe para visualizar su contenido y estadísticas.",
    emptyState: "No hay informes sintéticos disponibles en este momento.",
    variant: "primary",
  },
  INFORME_CATEDRA: {
    titulo: "Informes de Cátedra",
    subtitulo: "Seleccione un informe de cátedra para revisar los detalles.",
    emptyState: "No se encontraron informes de cátedra.",
    variant: "primary",
  },
  ENCUESTA_ESTUDIANTE: {
    titulo: "Encuestas de Estudiantes",
    subtitulo: "Seleccione una encuesta para analizar las respuestas individuales.",
    emptyState: "No hay encuestas de estudiantes para mostrar.",
    variant: "primary",
  },
};


// --- datos hardcodeados ---
export const mockCatedra: instrumentoList[] = [
    { id: 201, tipo: 'INFORME_CATEDRA', 
      fecha_inicio: '2025-07-15', 
      fecha_cierre: '2025-08-15', 
      materia: { id: 'FIS1', nombre: 'Física I' }, 
      plantilla_formulario: { id: 3, titulo: 'Reporte de Cátedra Física I - 2C 2025' },
      docente: { id: 10, nombre: 'Juan', apellido: 'Martínez' }
    }
];


export const mockSinteticos: instrumentoList[] = [
  { id: 101, tipo: 'INFORME_SINTETICO', 
    fecha_inicio: '2025-08-01', 
    fecha_cierre: '2025-08-31', 
    materia: { id: 'ALG', nombre: 'Álgebra' }, 
    plantilla_formulario: { id: 1, titulo: 'Informe Sintético  2C 2025' } },
    
  { id: 102, 
    tipo: 'INFORME_SINTETICO', 
    fecha_inicio: '2025-08-01', 
    fecha_cierre: '2025-08-31', 
    materia: { id: 'AM1', nombre: 'Análisis Matemático I' }, 
    plantilla_formulario: { id: 2, titulo: 'Informe Sintético de Análisis Matemático I - 2C 2025' } }
];


