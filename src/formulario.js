// Formulario.js
import { useForm } from 'react-hook-form';
import './formulario.css';

function Formulario() {
  const {register, handleSubmit, 
    formState: {errors},
    reset
  } = useForm();
  

  const onSubmit = handleSubmit((data)=>{
    console.log(data)
    //send json file if backend response is ok continue
    alert("Cita agendada con Exito!")
    reset()
  });

  return (
    <div className="form-container">
      <div 
      ////////////////////////////////////////////Map////////////////////////////
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
      <div 
      ////////////////////////////////////////image/////////////////////////////////
      className="image-section">
      </div>
        <h1>C.D. Fernanda Romero</h1>
        <p>Cuidando tu sonrisa</p>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <input
            ////////////////////////////////////////name////////////////////////
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
          <div className="input-group">
            <input
            ////////////////////////////////////////////////cel//////////////////////
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
          <div className= "input-group">
            <label className='labelDate' htmlFor="appointmentDate">Selecciona fecha:</label>
              <input
              /////////////////////////////////////////////////////appointmentDate//////////////////
                type="date"
                placeholder="" className='placeholderDate'
                {...register("appointmentDate", {
                  required: {
                    value: true,
                    message: "Fecha requerida"
                  }
                  ,
                  validate: (value) => {
                    const today = new  Date()
                    const appointmentDate = new Date(value)
                    const validDate = (appointmentDate-today)/1000
                    // Minimo 24 horas antes la cita
                    return validDate > 86399 || "Fecha invalida"
                  }
                })}
              />
            {
              errors.appointmentDate && <span className='warning'>{errors.appointmentDate.message}</span>
            } 
          </div>
          <div className= "input-group">
            <label className='labelDate' htmlFor="appointmentTime">Selecciona horario:</label>
              <select
              /////////////////////////////////////////////////////appointmentTime//////////////////
                placeholder="Horario" className='placeholderDate'
                {...register("appointmentTime", {
                  required: {
                    value: true,
                    message: "Horario requerido"
                  }
                })}
              >
                <option className='option'>10:00 am</option>
                <option className='option'>11:00 am</option>
                <option className='option'>12:00 am</option>
                <option className='option'>13:00 am</option>
              </select>
            {
              errors.appointmentTime && <span className='warning'>{errors.appointmentTime.message}</span>
            } 
          </div>
          <button type="submit">Agendar Cita</button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;