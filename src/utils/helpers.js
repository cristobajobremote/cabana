// Utilidades y helpers para la API
import { generateId, validateReviewData } from './validation.js';

// Sanitizar texto HTML
export function sanitizeHtml(text) {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Formatear fecha ISO
export function formatDate(isoString) {
  if (!isoString) return '';
  
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return isoString;
  }
}

// Generar slug para URLs
export function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Validar tipo de imagen
export function validateImageType(mimeType) {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  return allowedTypes.includes(mimeType);
}

// Validar tamaño de imagen
export function validateImageSize(sizeBytes, maxSizeMB = 5) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return sizeBytes <= maxSizeBytes;
}

// Generar nombre único para archivo
export function generateFileName(originalName, extension) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}.${extension}`;
}

// Obtener extensión de archivo
export function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

// Calcular dimensiones de imagen
export function calculateImageDimensions(width, height, maxWidth = 800, maxHeight = 800) {
  let newWidth = width;
  let newHeight = height;
  
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    newWidth = Math.round(width * ratio);
    newHeight = Math.round(height * ratio);
  }
  
  return { width: newWidth, height: newHeight };
}

// Generar URL de imagen optimizada
export function generateOptimizedImageUrl(originalUrl, width, height) {
  // Para Cloudflare Images, puedes usar transformaciones
  if (originalUrl.includes('imagedelivery.net')) {
    return `${originalUrl}/w=${width},h=${height},fit=cover`;
  }
  
  return originalUrl;
}

// Paginar resultados
export function paginateResults(items, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: endIndex < items.length,
      hasPrev: page > 1
    }
  };
}

// Filtrar reseñas
export function filterReviews(reviews, filters) {
  return reviews.filter(review => {
    if (filters.platform && filters.platform !== 'all' && review.platform !== filters.platform) {
      return false;
    }
    
    if (filters.rating && filters.rating !== 'all') {
      const minRating = parseInt(filters.rating);
      if (review.rating < minRating) {
        return false;
      }
    }
    
    if (filters.country && filters.country !== 'all' && review.country !== filters.country) {
      return false;
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `${review.guestName} ${review.reviewText} ${review.country}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
}

// Ordenar reseñas
export function sortReviews(reviews, sortBy = 'created_at', sortOrder = 'desc') {
  return [...reviews].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Manejar fechas
    if (sortBy.includes('_at') || sortBy.includes('date')) {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    // Manejar números
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      aValue = aValue;
      bValue = bValue;
    }
    
    // Manejar strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

// Re-exportar funciones de validación
export { generateId, validateReviewData }; 