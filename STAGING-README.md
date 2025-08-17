# 🧪 **Entorno de Staging - Cabaña Sol del Nevado**

## 📋 **Descripción**

Este es el entorno de **staging** (pruebas) para el sistema de reseñas de Cabaña Sol del Nevado. Aquí puedes probar todas las funcionalidades antes de desplegarlas a producción.

## 🌐 **URLs de Staging**

### **Frontend (Sitio Web)**
- **Página Principal:** `staging-index.html`
- **Panel de Administración:** `reviews-manager-staging.html`

### **Backend (API)**
- **URL de la API:** `https://cabanasoldelnevado-reviews-staging.solnevadolastrancas.workers.dev`
- **Health Check:** `/health`
- **API de Reseñas:** `/api/reviews`

## 🚀 **Cómo Acceder al Sitio de Staging**

### **Opción 1: Archivos Locales**
1. Abre `staging-index.html` en tu navegador
2. Verás el banner naranja indicando "ENTORNO DE STAGING"
3. Haz clic en "Panel Admin" para acceder al panel de administración

### **Opción 2: Servidor Local**
```bash
# Iniciar servidor local
python3 -m http.server 8000

# Abrir en navegador
http://localhost:8000/staging-index.html
```

## 🔧 **Funcionalidades Disponibles en Staging**

### ✅ **Frontend**
- [x] Página principal con banner de staging
- [x] Panel de administración conectado a la API
- [x] Formulario para agregar/editar reseñas
- [x] Lista de reseñas existentes
- [x] Filtros por plataforma y calificación
- [x] Subida de fotos (base64)
- [x] Estadísticas en tiempo real
- [x] Exportación de datos

### ✅ **Backend (API)**
- [x] Health check funcionando
- [x] Endpoint básico de reseñas
- [x] Base de datos D1 configurada
- [x] Almacenamiento R2 configurado
- [x] Configuración KV configurada

### 🔄 **En Desarrollo**
- [ ] CRUD completo de reseñas
- [ ] Sistema de fotos con R2
- [ ] Estadísticas avanzadas
- [ ] Autenticación con Cloudflare Access

## 📊 **Estado de la Infraestructura**

| Servicio | Estado | URL |
|----------|--------|-----|
| **API Backend** | ✅ Saludable | `cabanasoldelnevado-reviews-staging.solnevadolastrancas.workers.dev` |
| **Base de Datos** | ✅ Conectada | D1 SQLite |
| **Almacenamiento** | ✅ Conectado | R2 Bucket |
| **Configuración** | ✅ Conectada | KV Namespace |

## 🧪 **Pruebas Recomendadas**

### **1. Verificar Salud de la API**
```bash
curl https://cabanasoldelnevado-reviews-staging.solnevadolastrancas.workers.dev/health
```

### **2. Probar Endpoint de Reseñas**
```bash
curl https://cabanasoldelnevado-reviews-staging.solnevadolastrancas.workers.dev/api/reviews
```

### **3. Probar Panel de Administración**
1. Abre `reviews-manager-staging.html`
2. Verifica que se conecte a la API
3. Prueba agregar una reseña de prueba
4. Verifica que se muestre en la lista

### **4. Probar Sitio Principal**
1. Abre `staging-index.html`
2. Verifica que el banner de staging aparezca
3. Verifica que se conecte a la API
4. Prueba la navegación entre secciones

## 🚨 **Limitaciones del Entorno de Staging**

### **⚠️ Datos de Prueba**
- Los datos agregados en staging **NO se sincronizan** con producción
- Cada entorno tiene su propia base de datos
- Las fotos se almacenan localmente (base64)

### **⚠️ Funcionalidades Limitadas**
- No hay autenticación real
- No hay envío de emails
- No hay integración con APIs externas

### **⚠️ Rendimiento**
- El entorno puede ser más lento que producción
- Los recursos están limitados para pruebas

## 🔄 **Sincronización con Producción**

### **Desplegar a Producción**
```bash
# Desplegar API a producción
wrangler deploy --env=production

# Aplicar esquema de base de datos
wrangler d1 execute --remote=true cabanasoldelnevado-reviews --file=./schema.sql
```

### **Migrar Datos**
- Exportar reseñas desde staging: `Exportar` en el panel admin
- Importar reseñas en producción: Usar el mismo archivo JSON

## 📝 **Logs y Debugging**

### **Ver Logs en Tiempo Real**
```bash
# Logs de staging
wrangler tail --env=staging

# Logs de producción
wrangler tail --env=production
```

### **Verificar Estado de los Servicios**
```bash
# Listar bases de datos
wrangler d1 list

# Listar buckets R2
wrangler r2 bucket list

# Listar namespaces KV
wrangler kv namespace list
```

## 🎯 **Próximos Pasos**

### **1. Completar Funcionalidades Básicas**
- [ ] Implementar CRUD completo en la API
- [ ] Conectar subida de fotos con R2
- [ ] Agregar validaciones de datos

### **2. Implementar Autenticación**
- [ ] Configurar Cloudflare Access
- [ ] Proteger endpoints sensibles
- [ ] Implementar roles de usuario

### **3. Desplegar a Producción**
- [ ] Probar todas las funcionalidades en staging
- [ ] Desplegar API a producción
- [ ] Migrar datos de prueba
- [ ] Configurar dominio personalizado

## 📞 **Soporte**

### **Problemas Comunes**
1. **API no responde:** Verificar `wrangler tail --env=staging`
2. **Base de datos vacía:** Aplicar esquema con `wrangler d1 execute`
3. **Fotos no se cargan:** Verificar permisos de R2

### **Contacto**
- **Desarrollador:** Asistente AI
- **Proyecto:** Cabaña Sol del Nevado
- **Entorno:** Staging

---

## 🎉 **¡Disfruta Probando tu Sistema de Reseñas!**

El entorno de staging está listo para que pruebes todas las funcionalidades antes de desplegarlas a producción. ¡Experimenta sin miedo! 