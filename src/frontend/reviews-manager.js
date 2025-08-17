// Panel de Administración de Reseñas Universal
// Funciona en todos los ambientes: local, staging, production

import { getCurrentEnvironment, environments } from '../config/environments.js';

class UniversalReviewsManager {
  constructor() {
    this.currentEnv = getCurrentEnvironment();
    this.reviews = [];
    this.currentReview = null;
    this.isEditing = false;
    this.currentPhoto = null;
    this.init();
  }

  // Inicializar el panel
  async init() {
    this.updateEnvironmentUI();
    await this.loadReviews();
    this.setupEventListeners();
    this.updateStats();
    await this.checkApiHealth();
  }

  // Actualizar UI según el ambiente
  updateEnvironmentUI() {
    const env = this.currentEnv;
    
    // Actualizar título y badge
    const title = document.querySelector('.admin-header h1');
    if (title) {
      title.innerHTML = `<i class="fas fa-star"></i> Gestión de Reseñas - ${env.name.toUpperCase()}`;
    }
    
    const badge = document.querySelector('.environment-badge');
    if (badge) {
      badge.innerHTML = `${env.icon} ${env.name.toUpperCase()}`;
      badge.style.background = env.color;
    }
    
    // Actualizar descripción
    const description = document.querySelector('.admin-header p');
    if (description) {
      description.textContent = `Cabaña Sol del Nevado - Panel de Administración (${env.description})`;
    }
    
    // Actualizar información de la API
    this.updateApiInfo();
  }

  // Actualizar información de la API
  updateApiInfo() {
    const env = this.currentEnv;
    
    // Actualizar URL de la API
    const apiUrlElement = document.querySelector('.api-status .status-item code');
    if (apiUrlElement) {
      apiUrlElement.textContent = env.apiUrl.replace('https://', '').replace('http://', '');
    }
    
    // Actualizar colores según ambiente
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
      if (badge.classList.contains('status-healthy')) {
        badge.style.background = env.color;
      }
    });
  }

  // Verificar salud de la API
  async checkApiHealth() {
    try {
      const response = await fetch(`${this.currentEnv.apiUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        this.updateApiStatus('healthy', '✅ API Saludable');
        console.log(`API ${this.currentEnv.name} saludable:`, data);
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      this.updateApiStatus('error', '❌ Error de conexión');
      console.error(`Error al verificar salud de la API ${this.currentEnv.name}:`, error);
    }
  }

  // Actualizar estado de la API en la UI
  updateApiStatus(status, message) {
    const statusElement = document.querySelector('.status-badge.status-healthy');
    if (statusElement) {
      statusElement.className = `status-badge status-${status}`;
      statusElement.textContent = message;
    }
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

    // Selector de ambiente
    const envSelector = document.getElementById('environment-selector');
    if (envSelector) {
      envSelector.addEventListener('change', (e) => this.switchEnvironment(e.target.value));
    }
  }

  // Cambiar ambiente
  async switchEnvironment(envName) {
    if (!environments[envName]) return;
    
    this.currentEnv = environments[envName];
    this.updateEnvironmentUI();
    await this.checkApiHealth();
    await this.loadReviews();
    
    this.showNotification(`Cambiado a ambiente: ${this.currentEnv.name}`, 'info');
  }

  // Cargar reseñas desde la API
  async loadReviews() {
    try {
      console.log(`Cargando reseñas desde: ${this.currentEnv.apiUrl}/api/reviews`);
      
      const response = await fetch(`${this.currentEnv.apiUrl}/api/reviews`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Reseñas cargadas desde ${this.currentEnv.name}:`, data);
      
      this.reviews = data.reviews || [];
      this.renderReviewsList();
      
    } catch (error) {
      console.error(`Error al cargar reseñas desde ${this.currentEnv.name}:`, error);
      this.showNotification(`Error al cargar reseñas desde ${this.currentEnv.name}`, 'error');
      
      // Usar reseñas por defecto si la API falla
      this.reviews = this.getDefaultReviews();
      this.renderReviewsList();
    }
  }

  // Obtener reseñas por defecto (fallback)
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
  async handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reviewData = {
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
      photoUrl: this.currentPhoto || null
    };

    try {
      if (this.isEditing) {
        await this.updateReview(reviewData);
      } else {
        await this.addReview(reviewData);
      }

      this.resetForm();
      this.showNotification(`Reseña guardada exitosamente en ${this.currentEnv.name}`, 'success');
      
    } catch (error) {
      console.error(`Error al guardar reseña en ${this.currentEnv.name}:`, error);
      this.showNotification(`Error al guardar la reseña en ${this.currentEnv.name}`, 'error');
    }
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
  async addReview(reviewData) {
    try {
      console.log(`Agregando reseña en ${this.currentEnv.name}:`, reviewData);
      
      const response = await fetch(`${this.currentEnv.apiUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log(`Reseña agregada exitosamente en ${this.currentEnv.name}:`, result);
      
      this.reviews.unshift(result.review);
      this.renderReviewsList();
      this.updateStats();
      
    } catch (error) {
      console.error(`Error al agregar reseña en ${this.currentEnv.name}:`, error);
      throw error;
    }
  }

  // Actualizar reseña existente
  async updateReview(reviewData) {
    try {
      console.log(`Actualizando reseña en ${this.currentEnv.name}:`, reviewData);
      
      const response = await fetch(`${this.currentEnv.apiUrl}/api/reviews/${this.currentReview.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log(`Reseña actualizada exitosamente en ${this.currentEnv.name}:`, result);
      
      const index = this.reviews.findIndex(r => r.id === this.currentReview.id);
      if (index !== -1) {
        this.reviews[index] = result.review;
        this.renderReviewsList();
        this.updateStats();
      }
      
    } catch (error) {
      console.error(`Error al actualizar reseña en ${this.currentEnv.name}:`, error);
      throw error;
    }
  }

  // Eliminar reseña
  async deleteReview(id) {
    if (confirm(`¿Estás seguro de que quieres eliminar esta reseña en ${this.currentEnv.name}?`)) {
      try {
        console.log(`Eliminando reseña en ${this.currentEnv.name}:`, id);
        
        const response = await fetch(`${this.currentEnv.apiUrl}/api/reviews/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        console.log(`Reseña eliminada exitosamente en ${this.currentEnv.name}`);
        
        this.reviews = this.reviews.filter(r => r.id !== id);
        this.renderReviewsList();
        this.updateStats();
        this.showNotification(`Reseña eliminada exitosamente en ${this.currentEnv.name}`, 'success');
        
      } catch (error) {
        console.error(`Error al eliminar reseña en ${this.currentEnv.name}:`, error);
        this.showNotification(`Error al eliminar la reseña en ${this.currentEnv.name}`, 'error');
      }
    }
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
          ${review.photoUrl ? 
            `<img src="${review.photoUrl}" alt="${review.guestName}" class="review-photo">` :
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
    this.currentPhoto = review.photoUrl;
    
    this.populateForm(review);
    this.showNotification(`Modo edición activado en ${this.currentEnv.name}`, 'info');
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
    if (review.photoUrl) {
      this.updatePhotoPreview(review.photoUrl);
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
    link.download = `reseñas-cabaña-sol-del-nevado-${this.currentEnv.name}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    this.showNotification(`Reseñas exportadas desde ${this.currentEnv.name}`, 'success');
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

  // Obtener información del ambiente actual
  getEnvironmentInfo() {
    return {
      name: this.currentEnv.name,
      apiUrl: this.currentEnv.apiUrl,
      color: this.currentEnv.color,
      icon: this.currentEnv.icon,
      description: this.currentEnv.description
    };
  }
}

// Funciones globales
let reviewsAdmin;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  reviewsAdmin = new UniversalReviewsManager();
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

// Exportar para uso en otros módulos
export { UniversalReviewsManager }; 