# Cabaña Sol del Nevado

Sitio web moderno y responsive para la Cabaña Sol del Nevado, ubicada en Las Trancas, Chile.

## Características

- **Diseño Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- **Navegación Moderna**: Menú fijo con navegación suave
- **Galería de Imágenes**: Presentación atractiva de las fotos de la cabaña
- **Formulario de Reserva**: Sistema completo para solicitudes de reserva
- **Secciones Organizadas**: 
  - Hero Section con llamada a la acción
  - Información sobre la cabaña
  - Detalles del alojamiento
  - Actividades del entorno
  - Galería multimedia
  - Formulario de contacto

## Tecnologías Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript (ES6+)
- Font Awesome (Iconos)
- Diseño inspirado en Eluney Cabañas

## Estructura del Proyecto

```
soldelnevado-site/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── photos.json         # Configuración de imágenes
├── fotos/              # Directorio de imágenes
│   ├── 1.jpg
│   ├── 2.jpg
│   └── 3.jpg
└── videos/             # Directorio de videos
```

## Instalación y Uso

1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. Para desarrollo local, puedes usar un servidor local:
   ```bash
   python -m http.server 8000
   # o
   npx serve .
   ```

## Personalización

### Colores
Los colores principales están definidos en CSS:
- Azul principal: `#2c5aa0`
- Azul oscuro: `#1e3f6b`
- Gris claro: `#f8f9fa`

### Imágenes
Para agregar más imágenes:
1. Coloca las imágenes en la carpeta `fotos/`
2. Actualiza `photos.json` con la información de las nuevas imágenes

### Contenido
Edita `index.html` para personalizar:
- Textos y descripciones
- Información de contacto
- Precios y detalles del alojamiento

## Características Responsive

- **Desktop**: Diseño completo con navegación horizontal
- **Tablet**: Adaptación de layouts y tamaños
- **Mobile**: Menú hamburguesa y layouts optimizados

## Optimizaciones

- Imágenes optimizadas para web
- CSS minificado para producción
- JavaScript modular y eficiente
- Carga asíncrona de recursos

## Licencia

© 2025 Cabaña Sol del Nevado. Todos los derechos reservados.
