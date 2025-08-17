// Validaciones para la API de reseñas
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function validateReviewData(data, isUpdate = false) {
  const errors = [];
  
  if (!isUpdate) {
    if (!data.guestName || data.guestName.trim().length < 2) {
      errors.push('Nombre del huésped es requerido y debe tener al menos 2 caracteres');
    }
    
    if (!data.country || data.country.trim().length === 0) {
      errors.push('País es requerido');
    }
    
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.push('Calificación debe estar entre 1 y 5');
    }
    
    if (!data.reviewText || data.reviewText.trim().length < 10) {
      errors.push('Texto de reseña es requerido y debe tener al menos 10 caracteres');
    }
    
    if (!data.platform || !['booking', 'airbnb', 'direct'].includes(data.platform)) {
      errors.push('Plataforma debe ser booking, airbnb o direct');
    }
  }
  
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.push('Calificación debe estar entre 1 y 5');
  }
  
  if (data.guestCount && (data.guestCount < 1 || data.guestCount > 20)) {
    errors.push('Número de huéspedes debe estar entre 1 y 20');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 