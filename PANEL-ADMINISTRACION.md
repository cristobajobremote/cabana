# Panel de Administración de Reseñas - Cabaña Sol del Nevado

## Descripción

Este panel te permite gestionar fácilmente todas las reseñas de tus huéspedes, incluyendo la capacidad de agregar fotos reales de los visitantes, editar reseñas existentes y mantener un control completo sobre la información que se muestra en tu sitio web.

## 🚀 **Cómo Acceder al Panel**

### **Opción 1: Acceso Directo**
1. Abre en tu navegador: `reviews-manager.html`
2. El panel se cargará automáticamente con las reseñas existentes

### **Opción 2: Desde tu Sitio Principal**
1. Agrega un enlace en tu sitio principal
2. Por ejemplo: `<a href="reviews-manager.html">Administrar Reseñas</a>`

## ✨ **Características del Panel**

### **📊 Dashboard de Estadísticas**
- **Total de reseñas** en tu sistema
- **Calificación promedio** de todos los huéspedes
- **Conteo por plataforma** (Booking.com, Airbnb, Directo)
- **Actualización en tiempo real** de métricas

### **📝 Gestión de Reseñas**
- **Agregar nuevas reseñas** con formulario completo
- **Editar reseñas existentes** con un clic
- **Eliminar reseñas** no deseadas
- **Subir fotos reales** de los huéspedes
- **Gestionar respuestas** del anfitrión

### **🔍 Filtros y Búsqueda**
- **Filtrar por plataforma** (Booking, Airbnb, Directo)
- **Filtrar por calificación** (5 estrellas, 4+, 3+)
- **Búsqueda rápida** en la lista de reseñas

### **📤 Importación y Exportación**
- **Importar desde CSV** para grandes volúmenes
- **Importar desde JSON** para respaldos
- **Exportar todas las reseñas** en formato JSON
- **Preparado para integración** con APIs de Airbnb

## 📱 **Cómo Usar el Panel**

### **1. Agregar Nueva Reseña**

#### **Información Básica:**
- **Nombre del huésped** (obligatorio)
- **País de origen** (con bandera automática)
- **Calificación** (1-5 estrellas con sistema visual)

#### **Contenido de la Reseña:**
- **Texto completo** de la reseña
- **Plataforma** donde se originó
- **Fecha de estadía** (opcional)
- **Duración** de la estadía
- **Número de huéspedes**

#### **Foto del Huésped:**
- **Subir imagen** desde tu computadora
- **Preview en tiempo real** antes de guardar
- **Soporte para JPG, PNG, GIF**
- **Compresión automática** para optimización

#### **Respuesta del Anfitrión:**
- **Agregar tu respuesta** a la reseña
- **Mostrar engagement** con los huéspedes
- **Opcional** - solo si quieres responder

### **2. Editar Reseña Existente**

1. **Hacer clic en "Editar"** en cualquier reseña
2. **Modificar los campos** que necesites
3. **Cambiar la foto** si es necesario
4. **Actualizar la información** de la estadía
5. **Guardar cambios** con el botón "Actualizar"

### **3. Eliminar Reseña**

1. **Hacer clic en "Eliminar"** en la reseña
2. **Confirmar la acción** en el diálogo
3. **La reseña se elimina** permanentemente
4. **Las estadísticas se actualizan** automáticamente

## 📁 **Gestión de Fotos**

### **Formatos Soportados:**
- **JPG/JPEG** - Recomendado para fotos
- **PNG** - Para imágenes con transparencia
- **GIF** - Para imágenes animadas
- **WebP** - Formato moderno y optimizado

### **Tamaños Recomendados:**
- **Mínimo:** 200x200 píxeles
- **Óptimo:** 400x400 píxeles
- **Máximo:** 800x800 píxeles
- **Formato:** Cuadrado para mejor presentación

### **Proceso de Subida:**
1. **Hacer clic** en el área de subida
2. **Seleccionar archivo** de imagen
3. **Preview automático** de la imagen
4. **Confirmar** antes de guardar la reseña

## 🔄 **Importación de Reseñas**

### **Desde CSV:**
```csv
guestName,country,rating,reviewText,platform,stayDate,stayDuration,guestCount
"María González","Chile",5,"Excelente experiencia","airbnb","2024-12-20","2 noches",3
"John Smith","Estados Unidos",5,"Amazing place","booking","2024-12-18","5 noches",4
```

### **Desde JSON:**
```json
[
  {
    "guestName": "María González",
    "country": "Chile",
    "rating": 5,
    "reviewText": "Excelente experiencia",
    "platform": "airbnb",
    "stayDate": "2024-12-20",
    "stayDuration": "2 noches",
    "guestCount": 3
  }
]
```

### **Desde Airbnb (Futuro):**
- **Pegar URL** de tu perfil de Airbnb
- **Importación automática** de reseñas
- **Sincronización** con tu cuenta
- **Actualizaciones** en tiempo real

## 💾 **Almacenamiento y Respaldo**

### **Almacenamiento Local:**
- **localStorage** del navegador
- **Persistencia** entre sesiones
- **Límite:** ~5-10 MB por navegador
- **Recomendado:** Exportar regularmente

### **Respaldo Automático:**
- **Exportar mensualmente** en formato JSON
- **Guardar copias** en tu computadora
- **Backup en la nube** (Google Drive, Dropbox)
- **Versionado** con fechas

### **Migración de Datos:**
- **Importar desde archivo** JSON de respaldo
- **Restaurar reseñas** en cualquier momento
- **Sincronización** entre dispositivos
- **Mantenimiento** de historial completo

## 🎨 **Personalización del Panel**

### **Colores y Estilos:**
- **Tema azul** corporativo de Sol del Nevado
- **Responsive design** para móviles y tablets
- **Iconos FontAwesome** para mejor UX
- **Animaciones suaves** para interacciones

### **Configuración:**
- **Idioma:** Español (configurable)
- **Moneda:** CLP (Peso Chileno)
- **Zona horaria:** Chile (UTC-3)
- **Formato de fecha:** DD/MM/YYYY

## 🔒 **Seguridad y Privacidad**

### **Protección de Datos:**
- **No se envían** datos a servidores externos
- **Almacenamiento local** en tu navegador
- **Información privada** protegida
- **Cumplimiento** con leyes de privacidad

### **Acceso Controlado:**
- **Panel local** sin acceso externo
- **Sin contraseñas** (configurable)
- **Solo desde tu dispositivo**
- **Control total** sobre la información

## 📊 **Métricas y Analytics**

### **Estadísticas en Tiempo Real:**
- **Total de reseñas** actualizadas
- **Calificación promedio** calculada
- **Distribución por plataforma**
- **Tendencias** de satisfacción

### **Reportes Exportables:**
- **Datos en JSON** para análisis
- **Compatible** con Excel, Google Sheets
- **Gráficos** y visualizaciones
- **Análisis** de satisfacción

## 🚀 **Próximas Funcionalidades**

### **Integración con APIs:**
- **Airbnb API** para reseñas automáticas
- **Booking.com API** para sincronización
- **Google My Business** para reseñas locales
- **WhatsApp Business** para feedback directo

### **Funcionalidades Avanzadas:**
- **Sistema de respuestas** en tiempo real
- **Notificaciones** de nuevas reseñas
- **Moderación** automática de contenido
- **Análisis** de sentimientos

### **Herramientas de Marketing:**
- **Generación** de testimonios destacados
- **Compartir** en redes sociales
- **Email marketing** con reseñas
- **Widgets** para otros sitios

## 🆘 **Soporte y Ayuda**

### **Problemas Comunes:**

#### **Las reseñas no se guardan:**
- Verificar que el navegador soporte localStorage
- Limpiar caché y cookies
- Usar navegador moderno (Chrome, Firefox, Safari)

#### **Las fotos no se suben:**
- Verificar formato de imagen (JPG, PNG, GIF)
- Comprobar tamaño del archivo (< 5MB)
- Habilitar JavaScript en el navegador

#### **El panel no carga:**
- Verificar que todos los archivos estén presentes
- Comprobar conexión a internet
- Revisar consola del navegador para errores

### **Contacto para Soporte:**
- **Email:** contacto@cabanasoldelnevado.cl
- **WhatsApp:** +56 9 40990286
- **Horario:** Lunes a Domingo, 9:00 - 21:00

## 📋 **Checklist de Uso Diario**

### **Mantenimiento Regular:**
- [ ] **Revisar** nuevas reseñas diariamente
- [ ] **Responder** a reseñas cuando sea apropiado
- [ ] **Actualizar** información de huéspedes
- [ ] **Exportar** respaldo mensual
- [ ] **Verificar** estadísticas y métricas

### **Optimización:**
- [ ] **Revisar** calidad de las fotos
- [ ] **Actualizar** reseñas antiguas
- [ ] **Moderar** contenido inapropiado
- [ ] **Mantener** consistencia en la información
- [ ] **Optimizar** para SEO y conversiones

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0  
**Desarrollado por:** Equipo Sol del Nevado  
**Estado:** ✅ Funcionando y Listo para Uso 