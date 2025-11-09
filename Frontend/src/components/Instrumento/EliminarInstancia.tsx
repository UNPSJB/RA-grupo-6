import { Button } from 'react-bootstrap';

type Props = {
    grupoCuadroId: number;
    instanciaIndex: number;
    totalInstancias: number;
    onEliminar: (grupoCuadroId: number, instanciaIndex: number) => void;
};

function EliminarInstancia({ grupoCuadroId, instanciaIndex, totalInstancias, onEliminar }: Props) {
    if (totalInstancias <= 1) {
        return null;
    }

    return (
        <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onEliminar(grupoCuadroId, instanciaIndex)}
        >
            <i className="fas fa-trash me-1"></i>
            Eliminar
        </Button>
    );
}

export default EliminarInstancia;
