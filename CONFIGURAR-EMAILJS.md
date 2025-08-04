# 🔧 Configurar EmailJS para Envío Directo de Emails

## ⚠️ IMPORTANTE: Los correos no llegan porque necesitas configurar EmailJS

### 📋 Pasos para Configurar EmailJS:

#### 1️⃣ **Crear cuenta en EmailJS**
- Ve a: https://www.emailjs.com/
- Haz clic en "Sign Up"
- Regístrate con tu email: `contacto@cabanasoldelnevado.cl`
- Verifica tu cuenta

#### 2️⃣ **Configurar Email Service**
1. En el dashboard de EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona "Gmail" (recomendado)
4. Conecta con tu cuenta de Gmail
5. **Copia el Service ID** (ejemplo: `service_abc123`)

#### 3️⃣ **Crear Email Template**
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa este contenido:

**Asunto:**
```
Nueva Solicitud de Reserva - Cabaña Sol del Nevado
```

**Contenido:**
```
Nueva solicitud de reserva recibida desde el sitio web.

DATOS DEL CLIENTE:
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

4. **Copia el Template ID** (ejemplo: `template_xyz789`)

#### 4️⃣ **Obtener Public Key**
1. Ve a "Account" → "API Keys"
2. **Copia el Public Key** (ejemplo: `user_def456`)

#### 5️⃣ **Actualizar el código**
Reemplaza en `index.html` estas líneas:

```javascript
// Línea 1: Reemplazar "public_key"
emailjs.init("public_key");
// Por:
emailjs.init("user_def456"); // Tu Public Key real

// Línea 2: Reemplazar 'service_id'
emailjs.send('service_id', 'template_id', templateParams)
// Por:
emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

### 🎯 **Resultado Final:**
- ✅ Los correos llegarán directamente a `contacto@cabanasoldelnevado.cl`
- ✅ Sin usar el email del cliente
- ✅ Datos estructurados y profesionales
- ✅ Notificaciones automáticas

### 🔄 **Fallback:**
Si EmailJS falla, se abrirá automáticamente el cliente de email del usuario con los datos pre-rellenados.

### 📞 **Soporte:**
Si necesitas ayuda con la configuración, puedo asistirte paso a paso.

---

**¿Quieres que te ayude a configurar EmailJS ahora?** 