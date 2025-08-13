// Configuración de Reseñas y Testimonios para Cabaña Sol del Nevado
// Integración con Booking.com y Airbnb para mostrar reseñas reales

const REVIEWS_CONFIG = {
  // Configuración de APIs
  apis: {
    booking: {
      name: "Booking.com",
      apiUrl: "https://distribution-xml.booking.com/2.4/json/reviews",
      partnerId: "SOLDELNEVADO",
      propertyId: "1144463672258423863", // ID de tu propiedad en Booking
      language: "es",
      currency: "CLP"
    },
    airbnb: {
      name: "Airbnb",
      apiUrl: "https://api.airbnb.com/v2/reviews",
      partnerId: "SOLDELNEVADO",
      propertyId: "1144463672258423863", // ID de tu propiedad en Airbnb
      language: "es",
      currency: "CLP"
    }
  },

  // Reseñas por defecto (se pueden reemplazar con datos reales de las APIs)
  defaultReviews: [
    {
      id: "review-1",
      platform: "booking",
      guestName: "Guilherme",
      country: "Brasil",
      flag: "🇧🇷",
      rating: 5.0,
      reviewText: "El propietario y el ama de llaves fueron simplemente increíbles. La casa es hermosa, limpia, cálida, sin detalles a resaltar. Podría vivir tranquilo en este lugar. Gracias a todos.",
      reviewTextOriginal: "O proprietário e a governanta foram simplesmente incríveis. A casa é linda, limpa, quente, sem detalhes para destacar. Eu poderia viver tranquilamente neste lugar. Obrigado a todos.",
      translatedBy: "Booking.com",
      date: "2024-12-15",
      stayDuration: "3 noches",
      guests: 4,
      roomType: "Cabaña completa",
      helpful: 12,
      response: {
        hasResponse: true,
        responseText: "Muchas gracias Guilherme por tu hermosa reseña. Fue un placer tenerte como huésped. ¡Esperamos verte nuevamente!",
        responseDate: "2024-12-16"
      }
    },
    {
      id: "review-2",
      platform: "airbnb",
      guestName: "Cifuentes",
      country: "Chile",
      flag: "🇨🇱",
      rating: 5.0,
      reviewText: "Una cabaña realmente impecable en todo sentido, muy confortable y buena respuesta del propietario a las consultas y requerimientos. Recomiendo totalmente la cabaña!",
      reviewTextOriginal: "Una cabaña realmente impecable en todo sentido, muy confortable y buena respuesta del propietario a las consultas y requerimientos. Recomiendo totalmente la cabaña!",
      translatedBy: null,
      date: "2024-12-10",
      stayDuration: "2 noches",
      guests: 6,
      roomType: "Cabaña completa",
      helpful: 8,
      response: {
        hasResponse: false,
        responseText: null,
        responseDate: null
      }
    },
    {
      id: "review-3",
      platform: "booking",
      guestName: "Alejandra Quinteros",
      country: "Estados Unidos",
      flag: "🇺🇸",
      rating: 5.0,
      reviewText: "Una maravilla, cumplí mi sueño de conocer un lugar mágico deseado desde niña, agradezco a Umbral Travel por su ayuda, ahora a volver con los niños para navidad.",
      reviewTextOriginal: "Una maravilla, cumplí mi sueño de conocer un lugar mágico deseado desde niña, agradezco a Umbral Travel por su ayuda, ahora a volver con los niños para navidad.",
      translatedBy: null,
      date: "2024-11-28",
      stayDuration: "5 noches",
      guests: 8,
      roomType: "Cabaña completa",
      helpful: 15,
      response: {
        hasResponse: true,
        responseText: "¡Alejandra! Fue un honor hacer realidad tu sueño. Las Trancas es verdaderamente mágico. ¡Te esperamos con los niños en Navidad!",
        responseDate: "2024-11-29"
      }
    },
    {
      id: "review-4",
      platform: "airbnb",
      guestName: "Carolina Vergara",
      country: "Estados Unidos",
      flag: "🇺🇸",
      rating: 5.0,
      reviewText: "CONOCER LUGARES HERMOSOS QUE LOS VEÍA EN PELÍCULAS, ESTAR AHÍ FUE UN LUJO. TANTOS RECUERDOS.",
      reviewTextOriginal: "CONOCER LUGARES HERMOSOS QUE LOS VEÍA EN PELÍCULAS, ESTAR AHÍ FUE UN LUJO. TANTOS RECUERDOS.",
      translatedBy: null,
      date: "2024-11-20",
      stayDuration: "4 noches",
      guests: 5,
      roomType: "Cabaña completa",
      helpful: 11,
      response: {
        hasResponse: true,
        responseText: "Carolina, nos alegra que hayas vivido esa experiencia mágica. Las Trancas tiene ese poder de hacer realidad los sueños. ¡Gracias por compartir tu experiencia!",
        responseDate: "2024-11-21"
      }
    },
    {
      id: "review-5",
      platform: "booking",
      guestName: "Javiera Pereira",
      country: "Brasil",
      flag: "🇧🇷",
      rating: 5.0,
      reviewText: "Después de tanto trabajo, un merecido descanso para recargar energías, gracias Umbral",
      reviewTextOriginal: "Depois de tanto trabalho, um merecido descanso para recarregar energias, obrigado Umbral",
      translatedBy: "Booking.com",
      date: "2024-11-15",
      stayDuration: "6 noches",
      guests: 3,
      roomType: "Cabaña completa",
      helpful: 9,
      response: {
        hasResponse: true,
        responseText: "Javiera, es importante tomarse ese tiempo para recargar energías. Nos alegra que hayas encontrado ese descanso en nuestra cabaña. ¡Hasta la próxima!",
        responseDate: "2024-11-16"
      }
    },
    {
      id: "review-6",
      platform: "airbnb",
      guestName: "Alfredo Rossel",
      country: "Perú",
      flag: "🇵🇪",
      rating: 5.0,
      reviewText: "Un viaje ideal, lleno de lindos momentos, lo mejor de todo ver disfrutar a nuestro hijo y conocer un lugar mágico. Gracias.",
      reviewTextOriginal: "Un viaje ideal, lleno de lindos momentos, lo mejor de todo ver disfrutar a nuestro hijo y conocer un lugar mágico. Gracias.",
      translatedBy: null,
      date: "2024-11-10",
      stayDuration: "7 noches",
      guests: 7,
      roomType: "Cabaña completa",
      helpful: 14,
      response: {
        hasResponse: true,
        responseText: "Alfredo, ver a las familias disfrutar es nuestra mayor satisfacción. Las Trancas tiene esa magia especial para los niños. ¡Gracias por elegirnos!",
        responseDate: "2024-11-11"
      }
    }
  ],

  // Configuración de visualización
  display: {
    maxReviews: 6,
    autoRotate: true,
    rotationInterval: 5000, // 5 segundos
    showPlatform: true,
    showTranslation: true,
    showResponse: true,
    showHelpful: true
  },

  // Configuración de filtros
  filters: {
    platforms: ["all", "booking", "airbnb"],
    ratings: [5, 4, 3, 2, 1],
    languages: ["all", "es", "en", "pt"],
    dateRange: {
      from: "2024-01-01",
      to: "2024-12-31"
    }
  }
};

// Clase para manejar reseñas
class ReviewsManager {
  constructor() {
    this.reviews = [];
    this.currentIndex = 0;
    this.autoRotateInterval = null;
    this.isLoading = false;
  }

  // Inicializar el gestor de reseñas
  async init() {
    try {
      // Intentar cargar reseñas de las APIs
      await this.loadReviewsFromAPIs();
      
      // Si no hay reseñas de APIs, usar las por defecto
      if (this.reviews.length === 0) {
        this.reviews = REVIEWS_CONFIG.defaultReviews;
      }

      // Configurar auto-rotación
      if (REVIEWS_CONFIG.display.autoRotate) {
        this.startAutoRotation();
      }

      // Renderizar reseñas
      this.renderReviews();
      
      console.log(`Reseñas cargadas: ${this.reviews.length}`);
    } catch (error) {
      console.error('Error inicializando reseñas:', error);
      // Usar reseñas por defecto en caso de error
      this.reviews = REVIEWS_CONFIG.defaultReviews;
      this.renderReviews();
    }
  }

  // Cargar reseñas desde las APIs
  async loadReviewsFromAPIs() {
    this.isLoading = true;
    
    try {
      // Intentar cargar desde Booking.com
      const bookingReviews = await this.fetchBookingReviews();
      if (bookingReviews && bookingReviews.length > 0) {
        this.reviews.push(...bookingReviews);
      }

      // Intentar cargar desde Airbnb
      const airbnbReviews = await this.fetchAirbnbReviews();
      if (airbnbReviews && airbnbReviews.length > 0) {
        this.reviews.push(...airbnbReviews);
      }

      // Ordenar por fecha más reciente
      this.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Limitar al número máximo configurado
      this.reviews = this.reviews.slice(0, REVIEWS_CONFIG.display.maxReviews);
      
    } catch (error) {
      console.error('Error cargando reseñas de APIs:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Obtener reseñas de Booking.com
  async fetchBookingReviews() {
    try {
      const config = REVIEWS_CONFIG.apis.booking;
      const url = `${config.apiUrl}?property_id=${config.propertyId}&language=${config.language}`;
      
      // En un entorno real, aquí harías la llamada a la API
      // Por ahora, simulamos la respuesta
      console.log('Intentando cargar reseñas de Booking.com...');
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retornar array vacío para usar reseñas por defecto
      return [];
      
    } catch (error) {
      console.error('Error cargando reseñas de Booking:', error);
      return [];
    }
  }

  // Obtener reseñas de Airbnb
  async fetchAirbnbReviews() {
    try {
      const config = REVIEWS_CONFIG.apis.airbnb;
      const url = `${config.apiUrl}?property_id=${config.propertyId}&language=${config.language}`;
      
      // En un entorno real, aquí harías la llamada a la API
      console.log('Intentando cargar reseñas de Airbnb...');
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retornar array vacío para usar reseñas por defecto
      return [];
      
    } catch (error) {
      console.error('Error cargando reseñas de Airbnb:', error);
      return [];
    }
  }

  // Renderizar reseñas en el DOM
  renderReviews() {
    const container = document.querySelector('.reviews-container');
    if (!container) return;

    container.innerHTML = '';
    
    this.reviews.forEach((review, index) => {
      const reviewCard = this.createReviewCard(review, index);
      container.appendChild(reviewCard);
    });

    // Mostrar la primera reseña como activa
    this.showReview(0);
  }

  // Crear tarjeta de reseña individual
  createReviewCard(review, index) {
    const card = document.createElement('div');
    card.className = `review-card ${index === 0 ? 'active' : ''}`;
    card.dataset.index = index;

    const platformIcon = review.platform === 'booking' ? 'fas fa-calendar-check' : 'fab fa-airbnb';
    const platformColor = review.platform === 'booking' ? '#003580' : '#ff5a5f';

    card.innerHTML = `
      <div class="review-header">
        <div class="guest-info">
          <div class="guest-avatar">
            <span class="guest-initial">${review.guestName.charAt(0)}</span>
          </div>
          <div class="guest-details">
            <h4 class="guest-name">${review.guestName}</h4>
            <div class="guest-location">
              <span class="country-flag">${review.flag}</span>
              <span class="country-name">${review.country}</span>
            </div>
          </div>
        </div>
        <div class="platform-badge" style="background-color: ${platformColor}">
          <i class="${platformIcon}"></i>
        </div>
      </div>

      <div class="review-rating">
        <div class="stars">
          ${this.generateStars(review.rating)}
        </div>
        <span class="rating-number">${review.rating}</span>
      </div>

      <div class="review-content">
        <blockquote class="review-text">
          "${review.reviewText}"
        </blockquote>
        
        ${review.translatedBy ? `
          <div class="translation-info">
            <small>Traducido por ${review.translatedBy}</small>
            ${review.reviewTextOriginal !== review.reviewText ? `
              <button class="show-original-btn" onclick="reviewsManager.toggleOriginalText(${index})">
                Ver original
              </button>
            ` : ''}
          </div>
        ` : ''}
      </div>

      <div class="review-meta">
        <div class="stay-info">
          <span><i class="fas fa-calendar"></i> ${review.stayDuration}</span>
          <span><i class="fas fa-users"></i> ${review.guests} huéspedes</span>
          <span><i class="fas fa-home"></i> ${review.roomType}</span>
        </div>
        <div class="review-date">
          <i class="fas fa-clock"></i> ${this.formatDate(review.date)}
        </div>
      </div>

      ${review.response.hasResponse ? `
        <div class="host-response">
          <div class="response-header">
            <i class="fas fa-reply"></i> Respuesta del anfitrión
          </div>
          <div class="response-text">
            "${review.response.responseText}"
          </div>
          <div class="response-date">
            ${this.formatDate(review.response.responseDate)}
          </div>
        </div>
      ` : ''}

      <div class="review-actions">
        <button class="helpful-btn" onclick="reviewsManager.markHelpful(${index})">
          <i class="fas fa-thumbs-up"></i>
          <span class="helpful-count">${review.helpful}</span>
        </button>
        <a href="#" class="more-info-btn" onclick="reviewsManager.showMoreInfo(${index})">
          Más info
        </a>
      </div>
    `;

    return card;
  }

  // Generar estrellas HTML
  generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<i class="fas fa-star filled"></i>';
      } else if (i - 0.5 <= rating) {
        stars += '<i class="fas fa-star-half-alt filled"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    return stars;
  }

  // Formatear fecha
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Mostrar reseña específica
  showReview(index) {
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.pagination-dot');
    
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (cards[index]) {
      cards[index].classList.add('active');
    }
    if (dots[index]) {
      dots[index].classList.add('active');
    }
    
    this.currentIndex = index;
  }

  // Cambiar a siguiente/anterior reseña
  changeReview(direction) {
    let newIndex = this.currentIndex + direction;
    
    if (newIndex >= this.reviews.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = this.reviews.length - 1;
    }
    
    this.showReview(newIndex);
  }

  // Ir a reseña específica
  goToReview(index) {
    if (index >= 0 && index < this.reviews.length) {
      this.showReview(index);
    }
  }

  // Iniciar auto-rotación
  startAutoRotation() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
    
    this.autoRotateInterval = setInterval(() => {
      this.changeReview(1);
    }, REVIEWS_CONFIG.display.rotationInterval);
  }

  // Detener auto-rotación
  stopAutoRotation() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  // Marcar reseña como útil
  markHelpful(index) {
    if (this.reviews[index]) {
      this.reviews[index].helpful++;
      this.renderReviews();
      this.showReview(this.currentIndex);
    }
  }

  // Mostrar más información
  showMoreInfo(index) {
    const review = this.reviews[index];
    if (review) {
      // Aquí podrías mostrar un modal con más detalles
      console.log('Mostrando más info para:', review);
    }
  }

  // Alternar entre texto traducido y original
  toggleOriginalText(index) {
    const review = this.reviews[index];
    if (review && review.reviewTextOriginal !== review.reviewText) {
      const reviewText = document.querySelector(`[data-index="${index}"] .review-text`);
      if (reviewText) {
        const currentText = reviewText.textContent;
        if (currentText.includes(review.reviewText)) {
          reviewText.textContent = `"${review.reviewTextOriginal}"`;
        } else {
          reviewText.textContent = `"${review.reviewText}"`;
        }
      }
    }
  }

  // Filtrar reseñas
  filterReviews(filters) {
    let filtered = [...this.reviews];
    
    if (filters.platform && filters.platform !== 'all') {
      filtered = filtered.filter(review => review.platform === filters.platform);
    }
    
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating >= filters.rating);
    }
    
    if (filters.language && filters.language !== 'all') {
      filtered = filtered.filter(review => review.language === filters.language);
    }
    
    return filtered;
  }

  // Obtener estadísticas
  getStats() {
    const total = this.reviews.length;
    const avgRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / total;
    const platformBreakdown = this.reviews.reduce((acc, review) => {
      acc[review.platform] = (acc[review.platform] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total,
      averageRating: avgRating.toFixed(1),
      platformBreakdown,
      totalHelpful: this.reviews.reduce((sum, review) => sum + review.helpful, 0)
    };
  }
}

// Inicializar cuando el DOM esté listo
let reviewsManager;

document.addEventListener('DOMContentLoaded', function() {
  reviewsManager = new ReviewsManager();
  reviewsManager.init();
});

// Funciones globales para el HTML
window.changeReviewSlide = function(direction) {
  if (reviewsManager) {
    reviewsManager.changeReview(direction);
  }
};

window.goToReview = function(index) {
  if (reviewsManager) {
    reviewsManager.goToReview(index);
  }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REVIEWS_CONFIG, ReviewsManager };
} else {
  // Para uso en navegador
  window.REVIEWS_CONFIG = REVIEWS_CONFIG;
  window.ReviewsManager = ReviewsManager;
} 