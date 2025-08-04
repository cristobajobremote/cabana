# Guía de Desarrollo - Cabaña Sol del Nevado

## 🚀 Para Desarrollo Local

### Opción 1: Servidor de Desarrollo (Recomendado)
```bash
# Instalar Node.js si no lo tienes
# Luego ejecutar:
node dev-server.js
# Visitar: http://localhost:3000
```

### Opción 2: Servidor Python
```bash
python -m http.server 8000
# Visitar: http://localhost:8000
```

### Opción 3: Servidor PHP
```bash
php -S localhost:8000
# Visitar: http://localhost:8000
```

## 🔄 Solución de Problemas de Caché

### En el Navegador:
1. **Forzar recarga completa**: `Ctrl + F5` (Windows) o `Cmd + Shift + R` (Mac)
2. **Modo incógnito**: Abrir en ventana privada
3. **Limpiar caché**: Herramientas de desarrollador → Network → Disable cache

### En el Código:
- **Cache buster automático**: Se aplica automáticamente en cada carga
- **Meta tags**: Configurados para evitar caché
- **Headers del servidor**: Configurados en .htaccess

### Para Producción:
- **Cloudflare Pages**: Configurado para evitar caché en desarrollo
- **Deploy automático**: Los cambios se reflejan inmediatamente

## 📁 Estructura de Archivos
```
soldelnevado-site/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── photos.json         # Configuración de imágenes
├── .htaccess          # Configuración del servidor
├── dev-server.js      # Servidor de desarrollo
├── cache-buster.js    # Script anti-caché
├── fotos/             # Imágenes del sitio
└── videos/            # Videos (convertidos a YouTube)
```

## 🛠️ Comandos Útiles

### Verificar cambios:
```bash
# Ver archivos modificados
ls -la

# Ver contenido de un archivo
cat index.html

# Ver logs del servidor
tail -f logs/server.log
```

### Forzar actualización:
```bash
# Reiniciar servidor de desarrollo
pkill -f "node dev-server.js"
node dev-server.js

# Limpiar caché del navegador
# Ctrl + F5 o Cmd + Shift + R
```

## ⚡ Consejos Rápidos

1. **Siempre usar el servidor de desarrollo** para ver cambios inmediatos
2. **Verificar la consola del navegador** para errores
3. **Usar modo incógnito** para pruebas limpias
4. **Revisar Network tab** en herramientas de desarrollador

## 🔧 Troubleshooting

### Los cambios no se ven:
1. Verificar que el servidor esté corriendo
2. Forzar recarga completa (Ctrl + F5)
3. Limpiar caché del navegador
4. Verificar consola para errores

### Problemas de CSS:
1. Verificar que styles.css se esté cargando
2. Revisar Network tab en herramientas de desarrollador
3. Verificar que no haya errores de sintaxis

### Problemas de imágenes:
1. Verificar que las imágenes existan en la carpeta fotos/
2. Verificar que photos.json esté actualizado
3. Revisar la consola para errores de carga 