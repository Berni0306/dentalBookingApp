// Formulario.js
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import './formulario.css';

function Formulario() {
  const {register, 
    handleSubmit, 
    formState: {errors},
    reset,
    clearErrors
  } = useForm();

  const backendUrl = process.env.REACT_APP_BACKEND_URL; //url del backend
  const appointmentNextDayAvailableTime = process.env.REACT_APP_APPOINTMENT_NEXT_DAY_AVAILABLE_TIME; //Horario disponible cita un dia antes 14hrs (2pm)
  const timePerAppointment = process.env.REACT_APP_TIME_PER_APPOINTMENT; //Tiempo para cada cita ne horas
  const confirmationMessage = process.env.REACT_APP_CONFIRMATION_MESSAGE;
  const failureMessage = process.env.REACT_APP_FAILURE_MESSAGE;
  const minDaysBeforeAppointment = process.env.REACT_APP_MIN_DAYS_BEFORE_APPOINTMENT; //Tiempo minimo para agendar cita en dias
  const availableTimeErrorMessage = process.env.REACT_APP_AVAILABLE_TIME_ERROR_MESSAGE;
  const holidays = process.env.REACT_APP_HOLIDAYS.split(','); //Días feriados (formato YYYY-MM-DD)
  
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [dateError, setDateError] = useState('');

  const onSubmit = handleSubmit(async (data)=>{
    const startDateTime = `${data.appointmentDate}T${data.appointmentTime}:00-06:00`;
    const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime}:00-06:00`);
    appointmentDateTime.setHours(appointmentDateTime.getHours() + timePerAppointment);
    const formattedEndDateTime = `${appointmentDateTime.getFullYear()}-${String(appointmentDateTime.getMonth() + 1)
      .padStart(2, '0')}-${String(appointmentDateTime.getDate())
        .padStart(2, '0')}T${String(appointmentDateTime.getHours())
          .padStart(2, '0')}:${String(appointmentDateTime.getMinutes())
            .padStart(2, '0')}:00-06:00`;

    const jsonData = {
      summary: `${data.name} : ${data.cel}`, //Nombre y celular
      start: startDateTime,                //Fecha y hora de inicio
      end: formattedEndDateTime      //Fecha y hora de end
    };

    try {
      const response = await fetch(`${backendUrl}create-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        console.log(confirmationMessage, await response.json());
        alert(confirmationMessage);
        reset();
        setAvailableTimes([]);
      } else {
        console.error(failureMessage);
        alert(failureMessage);
      }
    } catch (error) {
      console.error(failureMessage, error);
      alert(failureMessage);
    }
  });

  const handleDateChange = async (e) => {
    const today = new Date();
    const selectedDate = e.target.value;
    setIsDateSelected(!!selectedDate);

    const appointmentDate = new Date(selectedDate);
    const dayOfWeek = appointmentDate.getUTCDay();
    
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(24, 0, 0, 0);
    const diffInMs = appointmentDate - today;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if ( (diffInDays < minDaysBeforeAppointment) || (dayOfWeek === 0 || dayOfWeek === 6 || holidays.includes(selectedDate))) {  //No working dates (Saturday=6, Sunday=0)
      setDateError("Fecha invalida o no disponible. Seleccione otra.");
      setAvailableTimes([]);
    } else {
      setDateError('');
      clearErrors("appointmentDate");
      try {
        const response = await fetch(`${backendUrl}available-time?date=${selectedDate}`);
        if (response.ok) {
          let availableTimes = await response.json();
          if (diffInDays === minDaysBeforeAppointment){
              availableTimes = availableTimes.filter(time => {
                const [hours] = time.split(":");
                return parseInt(hours, 10) >= appointmentNextDayAvailableTime;
              });
          }
          setAvailableTimes(availableTimes);
        } else {
          console.error(availableTimeErrorMessage);
          setAvailableTimes([]);
        }
      } catch (error) {
        console.error(availableTimeErrorMessage, error);
        setAvailableTimes([]);
      }
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
                id='appointmentDate'
                type="date"
                className='placeholderDate'
                {...register("appointmentDate", {
                  required: {
                    value: true,
                    message: "Fecha requerida"
                  }
                })}
                onChange={handleDateChange}
              />
            {
              errors.appointmentDate && <span className='warning'>{errors.appointmentDate.message}</span>
            }
            {
              dateError && <span className='warning'>{dateError}</span>
            }
          </div>

          { /*appointmentTime*/ }
          {(
          <div className= "input-group">
              <select
                placeholder="Horario" className='placeholderDate'
                {...register("appointmentTime", {
                  required: {
                    value: true,
                    message: "Horario requerido"
                  }
                })}
                defaultValue=""
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