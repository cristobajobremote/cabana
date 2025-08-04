# Configuración EmailJS para Cabaña Sol del Nevado

## 📧 Configuración Requerida

### 1. Crear cuenta en EmailJS
- Ir a: https://www.emailjs.com/
- Registrarse con tu email
- Verificar la cuenta

### 2. Configurar Email Service
1. En EmailJS Dashboard, ir a "Email Services"
2. Agregar nuevo servicio (Gmail, Outlook, etc.)
3. Conectar con tu cuenta de email
4. Copiar el **Service ID**

### 3. Crear Email Template
1. En EmailJS Dashboard, ir a "Email Templates"
2. Crear nuevo template con este contenido:

```
Asunto: Nueva Solicitud de Reserva - Cabaña Sol del Nevado

Contenido:
Nueva solicitud de reserva recibida desde el sitio web.

Datos del cliente:
- Nombre: {{from_name}}
- Email: {{from_email}}
- Teléfono: {{phone}}
- Fecha de Llegada: {{checkin_date}}
- Fecha de Salida: {{checkout_date}}
- Número de Huéspedes: {{guests}}
- Mensaje: {{message}}

---
Enviado desde: {{website}}
```

3. Copiar el **Template ID**

### 4. Obtener User ID
1. En EmailJS Dashboard, ir a "Account" → "API Keys"
2. Copiar el **Public Key**

### 5. Actualizar el código
Reemplazar en index.html:
- `YOUR_USER_ID` → Tu Public Key
- `YOUR_SERVICE_ID` → Tu Service ID  
- `YOUR_TEMPLATE_ID` → Tu Template ID

## 🔧 Configuración Actual

```javascript
emailjs.init("YOUR_USER_ID");
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

## 📋 Datos que se envían

- **to_email**: contacto@cabanasoldelnevado.cl
- **from_name**: Nombre del cliente
- **from_email**: Email del cliente
- **phone**: Teléfono del cliente
- **checkin_date**: Fecha de llegada
- **checkout_date**: Fecha de salida
- **guests**: Número de huéspedes
- **message**: Mensaje opcional
- **website**: URL del sitio web

## ⚡ Beneficios

- ✅ Envío directo sin cliente de email
- ✅ Datos estructurados
- ✅ Notificaciones automáticas
- ✅ Fallback al portapapeles
- ✅ Sin dependencia del navegador 