import type { InstanciaRespuestas } from '../types';
import { validarInstanciaCompleta } from '../Respuesta/ValidarRespuestas';
import { CButton } from '@coreui/react';

type Props = {
    grupoCuadroId: number;
    preguntasDelGrupo: any[];
    instancias: InstanciaRespuestas[];
    onAgregar: (grupoCuadroId: number, nuevaInstancia: InstanciaRespuestas) => void;
};

function AgregarInstancia({ grupoCuadroId, preguntasDelGrupo, instancias, onAgregar }: Props) {
    const agregarInstancia = () => {
        const nuevaInstancia: InstanciaRespuestas = {};

        preguntasDelGrupo.forEach((pregunta) => {
            nuevaInstancia[pregunta.id] = {
                pregunta_id: pregunta.id,
                texto: '',
                opcion_id: undefined,
                instancia_respuesta: instancias.length + 1,
            };
        });

        onAgregar(grupoCuadroId, nuevaInstancia);
    };

    const ultimaInstanciaCompleta =
        instancias.length === 0 || validarInstanciaCompleta(instancias[instancias.length - 1]);

    return (
        <div className="text-end">
            <CButton
                size="sm"
                onClick={agregarInstancia}
                disabled={!ultimaInstanciaCompleta}
                className="d-flex align-items-center gap-2 ms-auto btn-primary"
            >
                <i className="fas fa-plus"></i>
                Agregar más
            </CButton>

            {!ultimaInstanciaCompleta && (
                <small className="text-muted d-block mt-2">
                    Complete todas las respuestas antes de agregar más
                </small>
            )}
        </div>
    );
}

export default AgregarInstancia;