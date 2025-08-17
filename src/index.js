// API Backend para Cabaña Sol del Nevado - Cloudflare Workers
import { Router } from 'itty-router';

// Crear router principal
const router = Router();

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Manejar preflight OPTIONS
router.options('*', () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
});

// Health check
router.get('/health', () => {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), {
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// GET /api/reviews - Listar reseñas
router.get('/api/reviews', async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const platform = searchParams.get('platform');
    const rating = searchParams.get('rating');
    const country = searchParams.get('country');
    const offset = (page - 1) * limit;
    
    // Por ahora, simular respuesta con reseñas de ejemplo
    const mockReviews = [
      {
        id: '1',
        guestName: 'Guilherme',
        country: 'Brasil',
        flag: '🇧🇷',
        rating: 5.0,
        reviewText: 'El propietario y el ama de llaves fueron simplemente increíbles. La casa es hermosa, limpia, cálida, sin detalles a resaltar. Podría vivir tranquilo en este lugar. Gracias a todos.',
        platform: 'booking',
        stayDate: '2024-12-15',
        stayDuration: '3 noches',
        guestCount: 4,
        hostResponse: 'Muchas gracias Guilherme por tu hermosa reseña. Fue un placer tenerte como huésped. ¡Esperamos verte nuevamente!',
        photoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        guestName: 'Cifuentes',
        country: 'Chile',
        flag: '🇨🇱',
        rating: 5.0,
        reviewText: 'Una cabaña realmente impecable en todo sentido, muy confortable y buena respuesta del propietario a las consultas y requerimientos. Recomiendo totalmente la cabaña!',
        platform: 'airbnb',
        stayDate: '2024-12-10',
        stayDuration: '2 noches',
        guestCount: 6,
        hostResponse: null,
        photoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Filtrar reseñas si se especifican filtros
    let filteredReviews = [...mockReviews];
    
    if (platform && platform !== 'all') {
      filteredReviews = filteredReviews.filter(r => r.platform === platform);
    }
    
    if (rating && rating !== 'all') {
      const minRating = parseInt(rating);
      filteredReviews = filteredReviews.filter(r => r.rating >= minRating);
    }
    
    if (country && country !== 'all') {
      filteredReviews = filteredReviews.filter(r => r.country === country);
    }

    // Aplicar paginación
    const total = filteredReviews.length;
    const paginatedReviews = filteredReviews.slice(offset, offset + limit);
    
    const response = {
      reviews: paginatedReviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al obtener las reseñas',
      details: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// POST /api/reviews - Crear nueva reseña
router.post('/api/reviews', async (request) => {
  try {
    const reviewData = await request.json();
    
    // Validar datos requeridos
    if (!reviewData.guestName || !reviewData.country || !reviewData.rating || !reviewData.reviewText || !reviewData.platform) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Faltan campos requeridos',
        required: ['guestName', 'country', 'rating', 'reviewText', 'platform']
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Generar ID único
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Crear reseña
    const newReview = {
      id,
      guestName: reviewData.guestName,
      country: reviewData.country,
      flag: reviewData.flag || '🌍',
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
      platform: reviewData.platform,
      stayDate: reviewData.stayDate || null,
      stayDuration: reviewData.stayDuration || null,
      guestCount: reviewData.guestCount || 1,
      hostResponse: reviewData.hostResponse || null,
      photoUrl: reviewData.photoUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Nueva reseña creada:', newReview);

    return new Response(JSON.stringify({
      message: 'Reseña creada exitosamente',
      review: newReview
    }), {
      status: 201,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Error al crear reseña:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al crear la reseña',
      details: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// PUT /api/reviews/:id - Actualizar reseña
router.put('/api/reviews/:id', async (request) => {
  try {
    const { id } = request.params;
    const updateData = await request.json();
    
    // Por ahora, simular actualización
    const updatedReview = {
      id,
      guestName: updateData.guestName || 'Usuario',
      country: updateData.country || 'Chile',
      flag: updateData.flag || '🇨🇱',
      rating: updateData.rating || 5,
      reviewText: updateData.reviewText || 'Reseña actualizada',
      platform: updateData.platform || 'direct',
      stayDate: updateData.stayDate || null,
      stayDuration: updateData.stayDuration || null,
      guestCount: updateData.guestCount || 1,
      hostResponse: updateData.hostResponse || null,
      photoUrl: updateData.photoUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Reseña actualizada:', updatedReview);

    return new Response(JSON.stringify({
      message: 'Reseña actualizada exitosamente',
      review: updatedReview
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al actualizar la reseña',
      details: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// DELETE /api/reviews/:id - Eliminar reseña
router.delete('/api/reviews/:id', async (request) => {
  try {
    const { id } = request.params;
    
    console.log('Reseña eliminada:', id);

    return new Response(JSON.stringify({
      message: 'Reseña eliminada exitosamente'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al eliminar la reseña',
      details: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Ruta por defecto
router.all('*', () => {
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: 'Endpoint no encontrado',
    availableEndpoints: [
      '/health',
      '/api/reviews'
    ]
  }), {
    status: 404,
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// Manejar errores
router.catch((error) => {
  console.error('Error en la API:', error);
  
  return new Response(JSON.stringify({
    error: 'Internal Server Error',
    message: 'Error interno del servidor',
    timestamp: new Date().toISOString()
  }), {
    status: 500,
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
});

// Exportar para Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    try {
      // Manejar la request
      return await router.handle(request, env, ctx);
    } catch (error) {
      console.error('Error no manejado:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Error interno del servidor',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
}; 