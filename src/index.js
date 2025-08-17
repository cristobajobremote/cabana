// API Backend para Cabaña Sol del Nevado - Cloudflare Workers
import { Router } from 'itty-router';

// Crear router principal
const router = Router();

// Health check
router.get('/health', () => {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Rutas básicas de reseñas (implementación directa)
router.get('/api/reviews', async (request) => {
  try {
    // Simular respuesta básica
    return new Response(JSON.stringify({
      reviews: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al obtener reseñas'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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
    headers: { 'Content-Type': 'application/json' }
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
    headers: { 'Content-Type': 'application/json' }
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
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}; 