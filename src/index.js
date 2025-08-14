// API Backend para Cabaña Sol del Nevado - Cloudflare Workers
import { Router } from 'itty-router';
import { corsHeaders } from './middleware/cors.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { reviewsRoutes } from './routes/reviews.js';
import { photosRoutes } from './routes/photos.js';
import { statsRoutes } from './routes/stats.js';
import { configRoutes } from './routes/config.js';

// Crear router principal
const router = Router();

// Middleware global
router.all('*', corsHeaders);
router.all('*', rateLimitMiddleware);

// Health check
router.get('/health', () => {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: ENVIRONMENT,
    version: '1.0.0'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Rutas de la API
router.route('/api/reviews', reviewsRoutes);
router.route('/api/photos', photosRoutes);
router.route('/api/stats', statsRoutes);
router.route('/api/config', configRoutes);

// Ruta por defecto
router.all('*', () => {
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: 'Endpoint no encontrado',
    availableEndpoints: [
      '/health',
      '/api/reviews',
      '/api/photos',
      '/api/stats',
      '/api/config'
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
      // Agregar variables de entorno al contexto
      request.env = env;
      request.ctx = ctx;
      
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