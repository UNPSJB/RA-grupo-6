import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import type { MultiValue, StylesConfig, OptionProps, GroupBase } from "react-select";
import { components } from "react-select";

// Tipos
type Opcion = {
  id: number;
  texto: string;
};

type PreguntaCerrada = {
  texto: string;
  opciones: number[];
  tipo: string;
};

type SeleccionOpcion = {
  value: number;
  label: string;
};

// Props tipadas para el componente custom Option
interface OpcionConEliminarProps extends OptionProps<SeleccionOpcion, true, GroupBase<SeleccionOpcion>> {
  eliminarOpcion: (id: number) => void;
}

const OpcionConEliminar = ({
  data,
  innerRef,
  innerProps,
  eliminarOpcion,
  ...rest
}: OpcionConEliminarProps) => {
  return (
    <components.Option {...rest} innerRef={innerRef} innerProps={innerProps} data={data}>
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            eliminarOpcion(data.value);
          }}
          style={{
            position: "absolute",
            left: "20px",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "14px",
            padding: "0 4px",
          }}
        >
        x 
        </button>
        <span>
         {data.label}{/* muestra los datos de las opciones */}
        </span>
      </div>
    </components.Option>
  );
};

function CrearPreguntaCerrada() {
  const [preguntaCerrada, setPreguntaCerrada] = useState("");
  const [opcionesBackend, setOpcionesBackend] = useState<Opcion[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/opciones/")
      .then((res) => res.json())
      .then((data: Opcion[]) => setOpcionesBackend(data))
      .catch((err) => console.log("Error al cargar opciones", err));
  }, []);

  const opcionesSelect: SeleccionOpcion[] = opcionesBackend.map((op) => ({
    value: op.id,
    label: op.texto,
  }));

  const valorSeleccionado = opcionesSelect.filter((op) => seleccionadas.includes(op.value));

  const handleChange = (seleccion: MultiValue<SeleccionOpcion>) => {
    const ids = seleccion.map((op) => op.value);
    setSeleccionadas(ids);
  };

  const handleCreate = (texto: string) => {
    if (!texto.trim()) return;

    fetch("http://127.0.0.1:8000/opciones/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    })
      .then((res) => res.json())
      .then((data: Opcion) => {
        setOpcionesBackend([...opcionesBackend, data]);
        setSeleccionadas([...seleccionadas, data.id]);
      });
  };

  const crearPregunta = () => {
    if (!preguntaCerrada.trim() || seleccionadas.length === 0) {
      alert("Escribe la pregunta y selecciona al menos una opción");
      return;
    }

    const nuevaPregunta: PreguntaCerrada = {
      texto: preguntaCerrada,
      opciones: seleccionadas,
      tipo: "cerrada",
    };

    fetch("http://127.0.0.1:8000/preguntas/cerrada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaPregunta),
    }).then(() => {
      setPreguntaCerrada("");
      setSeleccionadas([]);
    });
  };

  const eliminarOpcion = async (id: number) => {
    try {
      const resCheck = await fetch(`http://127.0.0.1:8000/opciones/${id}/preguntas`);
      const preguntasRelacionadas: PreguntaCerrada[] = await resCheck.json();

      if (preguntasRelacionadas.length > 0) {
        alert("No se puede eliminar esta opción porque está asociada a una pregunta.");
        return;
      }

      const resDelete = await fetch(`http://127.0.0.1:8000/opciones/${id}`, {
        method: "DELETE",
      });

      if (!resDelete.ok) throw new Error("No se pudo eliminar la opción");

      setOpcionesBackend(opcionesBackend.filter((op) => op.id !== id));
      setSeleccionadas(seleccionadas.filter((sel) => sel !== id));
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Error desconocido al eliminar la opción");
    }
  };

  const customStyles: StylesConfig<SeleccionOpcion, true> = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#646cff"
        : state.isFocused
        ? "#535bf2"
        : "#1a1a1a",
      color: "white",
      paddingLeft: "32px",
    }),
    menu: (provided) => ({ ...provided, backgroundColor: "#1a1a1a" }),
    multiValue: (provided) => ({ ...provided, backgroundColor: "#646cff" }),
    multiValueLabel: (provided) => ({ ...provided, color: "white" }),
    control: (provided) => ({ ...provided, backgroundColor: "#1a1a1a", color: "white" }),
  };

  return (
    <div>
      <div>
        <label>Pregunta: </label>
        <input
          type="text"
          value={preguntaCerrada}
          onChange={(e) => setPreguntaCerrada(e.target.value)}
        />
      </div>

      <div>
        <h3>Opciones</h3>

        <CreatableSelect
          isMulti
          options={opcionesSelect}
          onChange={handleChange}
          onCreateOption={handleCreate}
          value={valorSeleccionado}
          styles={customStyles}
          placeholder="Opciones..."
          components={{
            Option: (props: OptionProps<SeleccionOpcion, true, GroupBase<SeleccionOpcion>>) => (
              <OpcionConEliminar {...props} eliminarOpcion={eliminarOpcion} />
            ),
          }}
        />
      </div>

      <button onClick={crearPregunta}>Crear Pregunta</button>
    </div>
  );
}

export default CrearPreguntaCerrada;