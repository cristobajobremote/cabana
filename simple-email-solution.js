// Solución simple para envío de email sin EmailJS
// Reemplazar la función de envío en index.html

function sendReservationEmail(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const checkin = formData.get('checkin');
  const checkout = formData.get('checkout');
  const guests = formData.get('guests');
  const message = formData.get('message');

  // Crear contenido del email
  const emailContent = `Nueva solicitud de reserva recibida:

Nombre: ${name}
Email: ${email}
Teléfono: ${phone || 'No proporcionado'}
Fecha de Llegada: ${checkin}
Fecha de Salida: ${checkout}
Número de Huéspedes: ${guests}
Mensaje: ${message || 'Sin mensaje adicional'}

---
Enviado desde el sitio web: https://www.cabanasoldelnevado.cl`;

  // Opción 1: Copiar al portapapeles
  if (navigator.clipboard) {
    navigator.clipboard.writeText(emailContent).then(() => {
      showNotification('Datos copiados al portapapeles. Envía un email a contacto@cabanasoldelnevado.cl con esta información.', 'success');
    }).catch(() => {
      showNotification('Por favor, envía un email a contacto@cabanasoldelnevado.cl con los datos del formulario.', 'info');
    });
  } else {
    // Opción 2: Mostrar datos en pantalla
    const dataDisplay = document.createElement('div');
    dataDisplay.className = 'email-data-display';
    dataDisplay.innerHTML = `
      <h4>Datos de la solicitud:</h4>
      <pre>${emailContent}</pre>
      <p>Por favor, envía un email a <strong>contacto@cabanasoldelnevado.cl</strong> con esta información.</p>
      <button onclick="this.parentElement.remove()">Cerrar</button>
    `;
    document.body.appendChild(dataDisplay);
  }

  return true;
}

// Estilos CSS adicionales para la solución simple
const additionalStyles = `
.email-data-display {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 10000;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.email-data-display pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  white-space: pre-wrap;
  font-size: 0.9rem;
}

.email-data-display button {
  background: #2c5aa0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}
`; 