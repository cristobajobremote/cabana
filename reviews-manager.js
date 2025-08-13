// Panel de Administración de Reseñas - Cabaña Sol del Nevado
class ReviewsAdminManager {
  constructor() {
    this.reviews = [];
    this.currentReview = null;
    this.isEditing = false;
    this.init();
  }

  // Inicializar el panel
  init() {
    this.loadReviews();
    this.setupEventListeners();
    this.updateStats();
  }

  // Configurar event listeners
  setupEventListeners() {
    // Formulario principal
    const form = document.getElementById('review-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Subida de fotos
    const photoInput = document.getElementById('guest-photo');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
    }

    // Modal
    const modal = document.getElementById('edit-modal');
    if (modal) {
      const closeBtn = modal.querySelector('.close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }
      
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }
  }

  // Cargar reseñas existentes
  loadReviews() {
    // Intentar cargar desde localStorage
    const savedReviews = localStorage.getItem('cabanasoldelnevado_reviews');
    if (savedReviews) {
      this.reviews = JSON.parse(savedReviews);
    } else {
      // Usar reseñas por defecto
      this.reviews = this.getDefaultReviews();
    }
    
    this.renderReviewsList();
  }

  // Obtener reseñas por defecto
  getDefaultReviews() {
    return [
      {
        id: this.generateId(),
        guestName: "Guilherme",
        country: "Brasil",
        flag: "🇧🇷",
        rating: 5.0,
        reviewText: "El propietario y el ama de llaves fueron simplemente increíbles. La casa es hermosa, limpia, cálida, sin detalles a resaltar. Podría vivir tranquilo en este lugar. Gracias a todos.",
        platform: "booking",
        stayDate: "2024-12-15",
        stayDuration: "3 noches",
        guestCount: 4,
        hostResponse: "Muchas gracias Guilherme por tu hermosa reseña. Fue un placer tenerte como huésped. ¡Esperamos verte nuevamente!",
        photo: null,
        createdAt: new Date().toISOString()
      },
      {
        id: this.generateId(),
        guestName: "Cifuentes",
        country: "Chile",
        flag: "🇨🇱",
        rating: 5.0,
        reviewText: "Una cabaña realmente impecable en todo sentido, muy confortable y buena respuesta del propietario a las consultas y requerimientos. Recomiendo totalmente la cabaña!",
        platform: "airbnb",
        stayDate: "2024-12-10",
        stayDuration: "2 noches",
        guestCount: 6,
        hostResponse: null,
        photo: null,
        createdAt: new Date().toISOString()
      }
    ];
  }

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Manejar envío del formulario
  handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reviewData = {
      id: this.isEditing ? this.currentReview.id : this.generateId(),
      guestName: formData.get('guestName'),
      country: formData.get('country'),
      flag: this.getCountryFlag(formData.get('country')),
      rating: parseInt(formData.get('rating')),
      reviewText: formData.get('reviewText'),
      platform: formData.get('platform'),
      stayDate: formData.get('stayDate'),
      stayDuration: formData.get('stayDuration'),
      guestCount: parseInt(formData.get('guestCount')) || 1,
      hostResponse: formData.get('hostResponse') || null,
      photo: this.currentPhoto || null,
      createdAt: this.isEditing ? this.currentReview.createdAt : new Date().toISOString()
    };

    if (this.isEditing) {
      this.updateReview(reviewData);
    } else {
      this.addReview(reviewData);
    }

    this.resetForm();
    this.showNotification('Reseña guardada exitosamente', 'success');
  }

  // Obtener bandera del país
  getCountryFlag(country) {
    const flags = {
      'Chile': '🇨🇱',
      'Argentina': '🇦🇷',
      'Brasil': '🇧🇷',
      'Perú': '🇵🇪',
      'Estados Unidos': '🇺🇸',
      'Canadá': '🇨🇦',
      'España': '🇪🇸',
      'Alemania': '🇩🇪',
      'Francia': '🇫🇷',
      'Reino Unido': '🇬🇧',
      'Australia': '🇦🇺'
    };
    return flags[country] || '🌍';
  }

  // Agregar nueva reseña
  addReview(reviewData) {
    this.reviews.unshift(reviewData);
    this.saveReviews();
    this.renderReviewsList();
    this.updateStats();
  }

  // Actualizar reseña existente
  updateReview(reviewData) {
    const index = this.reviews.findIndex(r => r.id === reviewData.id);
    if (index !== -1) {
      this.reviews[index] = reviewData;
      this.saveReviews();
      this.renderReviewsList();
      this.updateStats();
    }
  }

  // Eliminar reseña
  deleteReview(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.reviews = this.reviews.filter(r => r.id !== id);
      this.saveReviews();
      this.renderReviewsList();
      this.updateStats();
      this.showNotification('Reseña eliminada', 'success');
    }
  }

  // Guardar reseñas en localStorage
  saveReviews() {
    localStorage.setItem('cabanasoldelnevado_reviews', JSON.stringify(this.reviews));
  }

  // Renderizar lista de reseñas
  renderReviewsList() {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    container.innerHTML = '';
    
    this.reviews.forEach(review => {
      const reviewElement = this.createReviewElement(review);
      container.appendChild(reviewElement);
    });
  }

  // Crear elemento de reseña
  createReviewElement(review) {
    const div = document.createElement('div');
    div.className = 'review-item';
    
    const platformClass = `review-platform ${review.platform}`;
    const platformText = review.platform === 'booking' ? 'Booking.com' : 
                        review.platform === 'airbnb' ? 'Airbnb' : 'Directo';

    div.innerHTML = `
      <div class="review-header">
        <div class="review-info">
          ${review.photo ? 
            `<img src="${review.photo}" alt="${review.guestName}" class="review-photo">` :
            `<div class="review-photo">${review.guestName.charAt(0)}</div>`
          }
          <div class="review-details">
            <h4>${review.guestName}</h4>
            <div class="review-meta">
              ${review.flag} ${review.country} • ${review.stayDate ? new Date(review.stayDate).toLocaleDateString('es-CL') : 'Fecha no especificada'}
            </div>
          </div>
        </div>
        <div class="review-rating">
          <div class="review-stars">
            ${this.generateStarsHTML(review.rating)}
          </div>
          <span class="${platformClass}">${platformText}</span>
        </div>
      </div>
      
      <div class="review-text">"${review.reviewText}"</div>
      
      ${review.hostResponse ? `
        <div class="host-response">
          <strong>Respuesta del anfitrión:</strong> "${review.hostResponse}"
        </div>
      ` : ''}
      
      <div class="review-actions">
        <button class="btn btn-outline" onclick="reviewsAdmin.editReview('${review.id}')">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-danger" onclick="reviewsAdmin.deleteReview('${review.id}')">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    
    return div;
  }

  // Generar HTML de estrellas
  generateStarsHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<i class="fas fa-star"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    return stars;
  }

  // Editar reseña
  editReview(id) {
    const review = this.reviews.find(r => r.id === id);
    if (!review) return;

    this.currentReview = review;
    this.isEditing = true;
    this.currentPhoto = review.photo;
    
    this.populateForm(review);
    this.showNotification('Modo edición activado', 'info');
  }

  // Poblar formulario con datos
  populateForm(review) {
    document.getElementById('guest-name').value = review.guestName;
    document.getElementById('guest-country').value = review.country;
    document.getElementById('rating').value = review.rating;
    document.getElementById('review-text').value = review.reviewText;
    document.getElementById('platform').value = review.platform;
    document.getElementById('stay-date').value = review.stayDate || '';
    document.getElementById('stay-duration').value = review.stayDuration || '';
    document.getElementById('guest-count').value = review.guestCount || '';
    document.getElementById('host-response').value = review.hostResponse || '';

    // Actualizar preview de foto
    if (review.photo) {
      this.updatePhotoPreview(review.photo);
    }

    // Cambiar texto del botón
    const submitBtn = document.querySelector('#review-form .btn-primary');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Reseña';
    }
  }

  // Manejar subida de foto
  handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showNotification('Por favor selecciona un archivo de imagen', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentPhoto = e.target.result;
      this.updatePhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Actualizar preview de foto
  updatePhotoPreview(photoData) {
    const preview = document.getElementById('photo-preview');
    if (!preview) return;

    preview.innerHTML = `<img src="${photoData}" alt="Preview">`;
    preview.classList.add('has-image');
  }

  // Resetear formulario
  resetForm() {
    document.getElementById('review-form').reset();
    document.getElementById('photo-preview').innerHTML = `
      <i class="fas fa-camera"></i>
      <span>Haz clic para subir foto</span>
    `;
    document.getElementById('photo-preview').classList.remove('has-image');
    
    this.currentPhoto = null;
    this.currentReview = null;
    this.isEditing = false;

    // Restaurar texto del botón
    const submitBtn = document.querySelector('#review-form .btn-primary');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Reseña';
    }
  }

  // Actualizar estadísticas
  updateStats() {
    const total = this.reviews.length;
    const avgRating = total > 0 ? 
      (this.reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '0.0';
    const bookingCount = this.reviews.filter(r => r.platform === 'booking').length;
    const airbnbCount = this.reviews.filter(r => r.platform === 'airbnb').length;

    document.getElementById('total-reviews').textContent = total;
    document.getElementById('avg-rating').textContent = avgRating;
    document.getElementById('booking-reviews').textContent = bookingCount;
    document.getElementById('airbnb-reviews').textContent = airbnbCount;
  }

  // Filtrar reseñas
  filterReviews() {
    const platformFilter = document.getElementById('platform-filter').value;
    const ratingFilter = document.getElementById('rating-filter').value;

    let filtered = [...this.reviews];

    if (platformFilter !== 'all') {
      filtered = filtered.filter(r => r.platform === platformFilter);
    }

    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(r => r.rating >= minRating);
    }

    this.renderFilteredReviews(filtered);
  }

  // Renderizar reseñas filtradas
  renderFilteredReviews(filteredReviews) {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    container.innerHTML = '';
    
    filteredReviews.forEach(review => {
      const reviewElement = this.createReviewElement(review);
      container.appendChild(reviewElement);
    });
  }

  // Exportar reseñas
  exportReviews() {
    const dataStr = JSON.stringify(this.reviews, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `reseñas-cabaña-sol-del-nevado-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    this.showNotification('Reseñas exportadas exitosamente', 'success');
  }

  // Importar desde CSV
  importFromCSV(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        const importedReviews = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',');
            const review = {};
            headers.forEach((header, index) => {
              review[header.trim()] = values[index] ? values[index].trim() : '';
            });
            review.id = this.generateId();
            review.createdAt = new Date().toISOString();
            importedReviews.push(review);
          }
        }

        this.reviews.push(...importedReviews);
        this.saveReviews();
        this.renderReviewsList();
        this.updateStats();
        
        this.showNotification(`${importedReviews.length} reseñas importadas desde CSV`, 'success');
      } catch (error) {
        this.showNotification('Error al importar CSV: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  // Importar desde JSON
  importFromJSON(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedReviews = JSON.parse(e.target.result);
        
        importedReviews.forEach(review => {
          review.id = this.generateId();
          review.createdAt = new Date().toISOString();
        });

        this.reviews.push(...importedReviews);
        this.saveReviews();
        this.renderReviewsList();
        this.updateStats();
        
        this.showNotification(`${importedReviews.length} reseñas importadas desde JSON`, 'success');
      } catch (error) {
        this.showNotification('Error al importar JSON: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  // Importar desde Airbnb (simulado)
  importFromAirbnb() {
    const url = document.getElementById('airbnb-url').value;
    if (!url) {
      this.showNotification('Por favor ingresa la URL de Airbnb', 'error');
      return;
    }

    // Simular importación
    this.showNotification('Importando reseñas desde Airbnb...', 'info');
    
    setTimeout(() => {
      // Aquí implementarías la lógica real de importación
      this.showNotification('Función de importación desde Airbnb en desarrollo', 'info');
    }, 2000);
  }

  // Mostrar notificación
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Cerrar modal
  closeModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}

// Funciones globales
let reviewsAdmin;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  reviewsAdmin = new ReviewsAdminManager();
});

// Funciones globales para el HTML
window.resetForm = function() {
  if (reviewsAdmin) {
    reviewsAdmin.resetForm();
  }
};

window.filterReviews = function() {
  if (reviewsAdmin) {
    reviewsAdmin.filterReviews();
  }
};

window.exportReviews = function() {
  if (reviewsAdmin) {
    reviewsAdmin.exportReviews();
  }
};

window.importFromCSV = function(input) {
  if (reviewsAdmin) {
    reviewsAdmin.importFromCSV(input);
  }
};

window.importFromJSON = function(input) {
  if (reviewsAdmin) {
    reviewsAdmin.importFromJSON(input);
  }
};

window.importFromAirbnb = function() {
  if (reviewsAdmin) {
    reviewsAdmin.importFromAirbnb();
  }
}; 