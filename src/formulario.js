// Formulario.js
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import './formulario.css';

function Formulario() {
  const {register, 
    handleSubmit, 
    formState: {errors},
    reset,
  } = useForm();

  const [dateSelected, setDateSelected] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]); // Estado para manejar los horarios disponibles
  const [isDateSelected, setIsDateSelected] = useState(false);

  // URL del backend (cambia la URL según la configuración de tu servidor)
  const backendUrl = "http://localhost:3001/available-times";

  const onSubmit = handleSubmit(async (data)=>{
    console.log(data)
    alert("Cita agendada con Exito!")
    reset()
    setDateSelected(false);
    setAvailableTimes([]);
  });

  const handleDateChange = async (e) => {
    const today = new Date();
    const selectedDate = e.target.value;
    setIsDateSelected(!!selectedDate); // Si hay una fecha seleccionada, el label desaparecerá
    const appointmentDate = new Date(e.target.value);
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    const diffInMs = appointmentDate - today;
    const diffInSeconds = diffInMs / 1000;
    if (diffInSeconds > 86399) {
      setDateSelected(true); // Muestra el selector de horario si la fecha es válida

      try {
        const response = await fetch(`${backendUrl}?date=${selectedDate}`);
        if (response.ok) {
          const availableTimes = await response.json(); // Suponiendo que el backend responde con un array de horarios
          setAvailableTimes(availableTimes); // Actualiza el estado con los horarios disponibles
        } else {
          console.error("Error al obtener los horarios.");
          setAvailableTimes([]); // Reinicia los horarios si hay un error
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setAvailableTimes([]); // Reinicia los horarios si hay un error
      }

    } else {
      setDateSelected(false);
      setAvailableTimes([]);  // Reinicia los horarios disponibles
    }
  };

  return (
    <div className="form-container">

      { /*doctorMap*/ }
      <div 
      className="map-section">
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233.4675454078047!2d-100.41292460436645!3d20.56841679227943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d345b2369e1453%3A0x8ca73caad87571ec!2sConsultorio%20Dental%20Dra.%20Fernanda%20Romero!5e0!3m2!1ses-419!2smx!4v1720504800864!5m2!1ses-419!2smx"
          width="700px"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      <div className="form-section">

      { /*doctorImage*/ }  
      <div 
      className="image-section">
      </div>
        <h1>C.D. Fernanda Romero</h1>
        <p>Cuidando tu sonrisa</p>
        <form onSubmit={onSubmit}>

        { /*nameField*/ }
          <div className="input-group">
            <input
              type="text"
              placeholder="Tu nombre"
              {...register("name", {
                required: {
                  value: true,
                  message: "Nombre requerido"
                },
                minLength: {
                  value: 3,
                  message: "Nombre debe tener almenos 3 caracteres"
                },
                maxLength: {
                  value: 50,
                  message: "Nombre debe tener maximo 50 caracteres"
                }
              })}
            />
            {
              errors.name && <span className='warning'>{errors.name.message}</span>
            }
          </div> 

          { /*phoneField*/ }
          <div className="input-group">
            <input
              type="tel"
              placeholder="Tu celular"
              {...register("cel", {
                required: {
                  value: true,
                  message: "Celular requerido"
                },
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Celular debe tener 10 digitos numericos"
                }
              })}
            />
            {
              errors.cel && <span className='warning'>{errors.cel.message}</span>
            }
          </div>

          { /*appointmentDate*/ }
          <div className= "input-group">
            {!isDateSelected && (
              <label className='labelDate' htmlFor="appointmentDate">Selecciona una fecha</label>
            )}
              <input
                type="date"
                className='placeholderDate'
                {...register("appointmentDate", {
                  required: {
                    value: true,
                    message: "Fecha requerida"
                  }
                })}
                onChange={handleDateChange} // Usa el evento onChange directamente
              />
            {
              errors.appointmentDate && <span className='warning'>{errors.appointmentDate.message}</span>
            } 
          </div>

          { /*appointmentTime*/ }
          {dateSelected && (
          <div className= "input-group">
              <select
                placeholder="Horario" className='placeholderDate'
                {...register("appointmentTime", {
                  required: {
                    value: true,
                    message: "Horario requerido"
                  }
                })}
                defaultValue="" // Usa defaultValue para seleccionar el valor por defecto
              >
                <option value="" disabled>Selecciona un horario</option>
                {availableTimes.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            {
              errors.appointmentTime && <span className='warning'>{errors.appointmentTime.message}</span>
            } 
          </div>
          )}

          { /*button*/ }
          <button type="submit">Agendar Cita</button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;