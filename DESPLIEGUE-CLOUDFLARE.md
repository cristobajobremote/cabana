# 🚀 Despliegue en Cloudflare - Cabaña Sol del Nevado

## 📋 **Resumen de la Arquitectura**

### **Componentes Cloudflare:**
- **Pages:** Frontend estático (HTML, CSS, JS)
- **Workers:** API backend con CRUD completo
- **D1:** Base de datos SQLite para reseñas
- **R2:** Almacenamiento de imágenes de huéspedes
- **Access:** Autenticación corporativa (Google/Microsoft)
- **KV:** Configuración y caché del sistema

### **Ventajas de esta Arquitectura:**
- ✅ **Sin servidor** - Escalabilidad automática
- ✅ **Global** - CDN en 200+ países
- ✅ **Seguro** - Protección DDoS y WAF incluida
- ✅ **Económico** - Solo pagas por uso real
- ✅ **Rápido** - Edge computing en todo el mundo

## 🛠️ **Prerrequisitos**

### **1. Cuenta Cloudflare**
- [Crear cuenta en Cloudflare](https://dash.cloudflare.com/sign-up)
- Verificar dominio (opcional para desarrollo)

### **2. Node.js y npm**
```bash
# Verificar versiones
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
```

### **3. Wrangler CLI**
```bash
# Instalar Wrangler globalmente
npm install -g wrangler

# Verificar instalación
wrangler --version
```

### **4. Autenticación con Cloudflare**
```bash
# Iniciar sesión
wrangler login

# Verificar autenticación
wrangler whoami
```

## 🗄️ **Configuración de Base de Datos D1**

### **1. Crear Base de Datos**
```bash
# Crear base de datos D1
wrangler d1 create cabanasoldelnevado-reviews

# El comando devuelve un database_id
# Copiarlo en wrangler.toml
```

### **2. Aplicar Esquema**
```bash
# Aplicar esquema de base de datos
wrangler d1 execute cabanasoldelnevado-reviews --file=./schema.sql

# Verificar tablas creadas
wrangler d1 execute cabanasoldelnevado-reviews --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### **3. Datos de Prueba (Opcional)**
```bash
# Insertar datos de ejemplo
wrangler d1 execute cabanasoldelnevado-reviews --file=./seed.sql
```

## 🗂️ **Configuración de R2 Storage**

### **1. Crear Bucket**
```bash
# Crear bucket para imágenes
wrangler r2 bucket create cabanasoldelnevado-images

# Verificar bucket creado
wrangler r2 bucket list
```

### **2. Configurar CORS (Opcional)**
```bash
# Crear archivo de configuración CORS
cat > cors.json << EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

# Aplicar configuración CORS
wrangler r2 bucket cors put cabanasoldelnevado-images cors.json
```

## 🔐 **Configuración de Cloudflare Access**

### **1. Crear Aplicación en Access**
1. Ir a [Cloudflare Access](https://dash.cloudflare.com/access/applications)
2. **Add an application** → **Self-hosted**
3. **Application name:** `Cabaña Sol del Nevado - Panel Admin`
4. **Session Duration:** 24 hours
5. **Application domain:** `tu-dominio.com` (o subdominio)

### **2. Configurar Políticas de Acceso**
1. **Add a policy**
2. **Action:** Allow
3. **Rules:**
   - **Include:** Emails
   - **Emails:** `contacto@cabanasoldelnevado.cl`
   - **Additional options:** Require email verification

### **3. Configurar Identity Providers**
1. **Add identity provider**
2. **Google** (recomendado para empresas)
   - Configurar OAuth 2.0
   - Agregar dominios autorizados
3. **Microsoft** (alternativa)
   - Configurar Azure AD
   - Agregar usuarios autorizados

### **4. Obtener Configuración**
- **Application ID:** Copiar para `wrangler.toml`
- **Audience Tag:** Configurar en políticas

## 📝 **Configuración de KV**

### **1. Crear Namespace**
```bash
# Crear namespace para configuración
wrangler kv:namespace create CONFIG

# El comando devuelve un id
# Copiarlo en wrangler.toml
```

### **2. Configuración Inicial**
```bash
# Insertar configuración por defecto
wrangler kv:key put --binding=CONFIG "maintenance_mode" "false"
wrangler kv:key put --binding=CONFIG "max_reviews_per_page" "20"
wrangler kv:key put --binding=CONFIG "allow_guest_uploads" "false"
```

## ⚙️ **Configuración de Wrangler**

### **1. Actualizar wrangler.toml**
```toml
# Reemplazar los IDs con los valores reales
[[d1_databases]]
binding = "DB"
database_name = "cabanasoldelnevado-reviews"
database_id = "TU_DATABASE_ID_AQUI"

[[kv_namespaces]]
binding = "CONFIG"
id = "TU_KV_NAMESPACE_ID_AQUI"
```

### **2. Variables de Entorno**
```bash
# Configurar variables de entorno
wrangler secret put ENVIRONMENT
wrangler secret put MAX_IMAGE_SIZE
wrangler secret put ALLOWED_IMAGE_TYPES
```

## 🚀 **Despliegue**

### **1. Desarrollo Local**
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# La API estará disponible en http://localhost:8787
```

### **2. Despliegue a Staging**
```bash
# Desplegar a entorno de staging
npm run deploy:staging

# Verificar despliegue
wrangler tail --env staging
```

### **3. Despliegue a Producción**
```bash
# Desplegar a producción
npm run deploy:production

# Verificar despliegue
wrangler tail --env production
```

### **4. Verificar Funcionamiento**
```bash
# Health check
curl https://tu-worker.cabanasoldelnevado.workers.dev/health

# Obtener reseñas (requiere autenticación)
curl -H "Authorization: Bearer TU_JWT" \
     https://tu-worker.cabanasoldelnevado.workers.dev/api/reviews
```

## 🌐 **Configuración de Dominio**

### **1. Workers Domain (Opcional)**
```bash
# Configurar dominio personalizado
wrangler domain create tu-dominio.com

# O usar subdominio
wrangler domain create api.tu-dominio.com
```

### **2. DNS y SSL**
- **DNS:** Configurar automáticamente por Cloudflare
- **SSL:** Full (strict) recomendado
- **Always Use HTTPS:** Habilitado

## 📊 **Monitoreo y Analytics**

### **1. Cloudflare Analytics**
- **Workers Analytics:** Métricas de API
- **R2 Analytics:** Uso de almacenamiento
- **D1 Analytics:** Consultas de base de datos

### **2. Logs en Tiempo Real**
```bash
# Ver logs en tiempo real
wrangler tail --env production

# Filtrar por tipo de request
wrangler tail --env production --format pretty
```

### **3. Métricas Personalizadas**
```javascript
// En tu código Worker
request.env.CONFIG.put(`metric:${metricName}`, JSON.stringify({
  value: metricValue,
  timestamp: new Date().toISOString()
}));
```

## 🔒 **Seguridad y Compliance**

### **1. Headers de Seguridad**
```javascript
// Agregar headers de seguridad
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-XSS-Protection', '1; mode=block');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

### **2. Rate Limiting**
- **Por IP:** 100 requests/minuto
- **Por usuario:** 1000 requests/hora
- **Por endpoint:** Configurable por ruta

### **3. Validación de Datos**
- **Input sanitization:** Prevenir XSS
- **SQL injection:** Prepared statements
- **File uploads:** Validación de tipos y tamaños

## 🧪 **Testing**

### **1. Tests Unitarios**
```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

### **2. Tests de Integración**
```bash
# Tests contra base de datos local
npm run test:integration

# Tests contra staging
npm run test:staging
```

### **3. Tests de Carga**
```bash
# Usar herramientas como k6 o Artillery
npm run test:load
```

## 📈 **Escalabilidad**

### **1. Auto-scaling**
- **Workers:** Escalado automático por request
- **D1:** Escalado automático por consultas
- **R2:** Escalado automático por almacenamiento

### **2. Caching**
```javascript
// Cache en KV para respuestas frecuentes
const cacheKey = `cache:reviews:${platform}:${rating}`;
const cached = await request.env.CONFIG.get(cacheKey, 'json');

if (cached && Date.now() - cached.timestamp < 300000) {
  return new Response(JSON.stringify(cached.data));
}
```

### **3. CDN Global**
- **200+ ubicaciones** de Cloudflare
- **Edge computing** en cada ubicación
- **Optimización automática** de imágenes

## 🚨 **Solución de Problemas**

### **1. Errores Comunes**

#### **Worker no responde:**
```bash
# Verificar logs
wrangler tail --env production

# Verificar estado
wrangler deployment list --env production
```

#### **Base de datos no conecta:**
```bash
# Verificar binding
wrangler d1 list

# Probar conexión
wrangler d1 execute cabanasoldelnevado-reviews --command="SELECT 1;"
```

#### **R2 no funciona:**
```bash
# Verificar bucket
wrangler r2 bucket list

# Verificar permisos
wrangler r2 bucket info cabanasoldelnevado-images
```

### **2. Debugging**
```bash
# Modo debug
wrangler dev --inspect

# Logs detallados
wrangler tail --env production --format json
```

### **3. Rollback**
```bash
# Revertir a versión anterior
wrangler rollback --env production

# Ver historial de despliegues
wrangler deployment list --env production
```

## 💰 **Costos Estimados**

### **Workers:**
- **Requests:** $0.50 por millón de requests
- **CPU time:** $0.30 por millón de requests
- **Ejemplo:** 100,000 requests/mes = ~$0.05

### **D1:**
- **Reads:** $0.40 por millón de reads
- **Writes:** $1.00 por millón de writes
- **Storage:** $0.75 por GB/mes
- **Ejemplo:** 10,000 operaciones/mes = ~$0.01

### **R2:**
- **Storage:** $0.015 por GB/mes
- **Class A operations:** $4.50 por millón
- **Class B operations:** $0.36 por millón
- **Ejemplo:** 1GB + 100,000 operaciones = ~$0.50

### **Total Estimado:**
- **Mensual:** $0.50 - $2.00
- **Anual:** $6.00 - $24.00

## 🔄 **Mantenimiento**

### **1. Actualizaciones Automáticas**
```bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Actualizar Wrangler
npm install -g wrangler@latest
```

### **2. Backups**
```bash
# Exportar base de datos
wrangler d1 execute cabanasoldelnevado-reviews --command=".dump" > backup.sql

# Exportar configuración KV
wrangler kv:key list --binding=CONFIG > config-backup.json
```

### **3. Monitoreo Continuo**
- **Health checks** cada 5 minutos
- **Alertas** por email/Slack
- **Métricas** en dashboard personalizado

## 📚 **Recursos Adicionales**

### **Documentación Oficial:**
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare Access](https://developers.cloudflare.com/access/)

### **Comunidad:**
- [Cloudflare Community](https://community.cloudflare.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/cloudflare-workers)
- [GitHub Discussions](https://github.com/cloudflare/workers/discussions)

---

**¡Tu API de reseñas está lista para producción en Cloudflare! 🎉**

**Siguiente paso:** Configurar el frontend para usar la nueva API en lugar del localStorage. 