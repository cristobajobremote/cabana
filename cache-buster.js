// Cache Buster - Forzar actualización de recursos
(function() {
    // Agregar timestamp a los recursos para evitar caché
    const timestamp = new Date().getTime();
    
    // Función para agregar timestamp a URLs
    function addTimestamp(url) {
        const separator = url.includes('?') ? '&' : '?';
        return url + separator + 'v=' + timestamp;
    }
    
    // Actualizar enlaces CSS
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
        link.href = addTimestamp(link.href);
    });
    
    // Actualizar imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.src && !img.src.includes('data:')) {
            img.src = addTimestamp(img.src);
        }
    });
    
    // Actualizar videos/iframes
    const videos = document.querySelectorAll('video source');
    videos.forEach(source => {
        source.src = addTimestamp(source.src);
    });
    
    console.log('Cache buster aplicado - Timestamp:', timestamp);
})(); 