// Rutas para gestión de reseñas - CRUD completo
import { Router } from 'itty-router';
import { authMiddleware, requireAdmin, requireOwnership } from '../middleware/auth.js';
import { addCorsHeaders, handleCors } from '../middleware/cors.js';
import { addRateLimitHeaders } from '../middleware/rateLimit.js';
import { generateId, validateReviewData } from '../utils/validation.js';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.all('*', authMiddleware);

// Manejar preflight CORS
router.options('*', handleCors);

// GET /api/reviews - Listar reseñas con paginación y filtros
router.get('/', async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const platform = searchParams.get('platform');
    const rating = searchParams.get('rating');
    const country = searchParams.get('country');
    const offset = (page - 1) * limit;
    
    // Construir query SQL
    let whereClause = 'WHERE is_active = 1';
    const params = [];
    
    if (platform && platform !== 'all') {
      whereClause += ' AND platform = ?';
      params.push(platform);
    }
    
    if (rating && rating !== 'all') {
      const minRating = parseInt(rating);
      whereClause += ' AND rating >= ?';
      params.push(minRating);
    }
    
    if (country && country !== 'all') {
      whereClause += ' AND country = ?';
      params.push(country);
    }
    
    // Query para contar total
    const countQuery = `SELECT COUNT(*) as total FROM reviews ${whereClause}`;
    const countResult = await request.env.DB.prepare(countQuery).bind(...params).first();
    const total = countResult.total;
    
    // Query para obtener reseñas
    const reviewsQuery = `
      SELECT * FROM reviews 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const reviews = await request.env.DB.prepare(reviewsQuery)
      .bind(...params, limit, offset)
      .all();
    
    // Calcular paginación
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    const response = {
      reviews: reviews.results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    };
    
    return addRateLimitHeaders(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    
    return new Response(JSON.stringify({
      error: 'Database Error',
      message: 'Error al obtener las reseñas',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// GET /api/reviews/:id - Obtener reseña específica
router.get('/:id', async (request) => {
  try {
    const { id } = request.params;
    
    const review = await request.env.DB.prepare(`
      SELECT r.*, gp.original_filename, gp.url as photo_url, gp.mime_type, gp.size_bytes
      FROM reviews r
      LEFT JOIN guest_photos gp ON r.id = gp.review_id
      WHERE r.id = ? AND r.is_active = 1
    `).bind(id).first();
    
    if (!review) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Reseña no encontrada'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({ review }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al obtener reseña:', error);
    
    return new Response(JSON.stringify({
      error: 'Database Error',
      message: 'Error al obtener la reseña',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// POST /api/reviews - Crear nueva reseña
router.post('/', async (request) => {
  try {
    // Verificar permisos de administrador
    const adminCheck = requireAdmin(request);
    if (adminCheck) return adminCheck;
    
    const reviewData = await request.json();
    
    // Validar datos de la reseña
    const validation = validateReviewData(reviewData);
    if (!validation.isValid) {
      return new Response(JSON.stringify({
        error: 'Validation Error',
        message: 'Datos de reseña inválidos',
        details: validation.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const id = generateId();
    const now = new Date().toISOString();
    
    // Insertar reseña en la base de datos
    const insertQuery = `
      INSERT INTO reviews (
        id, guest_name, country, flag, rating, review_text, platform,
        stay_date, stay_duration, guest_count, host_response,
        photo_url, photo_key, created_at, updated_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;
    
    await request.env.DB.prepare(insertQuery).bind(
      id,
      reviewData.guestName,
      reviewData.country,
      reviewData.flag || getCountryFlag(reviewData.country),
      reviewData.rating,
      reviewData.reviewText,
      reviewData.platform,
      reviewData.stayDate || null,
      reviewData.stayDuration || null,
      reviewData.guestCount || 1,
      reviewData.hostResponse || null,
      reviewData.photoUrl || null,
      reviewData.photoKey || null,
      now,
      now
    ).run();
    
    // Obtener la reseña creada
    const createdReview = await request.env.DB.prepare(`
      SELECT * FROM reviews WHERE id = ?
    `).bind(id).first();
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({
        message: 'Reseña creada exitosamente',
        review: createdReview
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al crear reseña:', error);
    
    return new Response(JSON.stringify({
      error: 'Database Error',
      message: 'Error al crear la reseña',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// PUT /api/reviews/:id - Actualizar reseña existente
router.put('/:id', async (request) => {
  try {
    const { id } = request.params;
    const reviewData = await request.json();
    
    // Verificar que la reseña existe
    const existingReview = await request.env.DB.prepare(`
      SELECT * FROM reviews WHERE id = ? AND is_active = 1
    `).bind(id).first();
    
    if (!existingReview) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Reseña no encontrada'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verificar permisos
    const ownershipCheck = requireOwnership(request, id);
    if (ownershipCheck) return ownershipCheck;
    
    // Validar datos de la reseña
    const validation = validateReviewData(reviewData, true);
    if (!validation.isValid) {
      return new Response(JSON.stringify({
        error: 'Validation Error',
        message: 'Datos de reseña inválidos',
        details: validation.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const now = new Date().toISOString();
    
    // Actualizar reseña
    const updateQuery = `
      UPDATE reviews SET
        guest_name = ?, country = ?, flag = ?, rating = ?, review_text = ?,
        platform = ?, stay_date = ?, stay_duration = ?, guest_count = ?,
        host_response = ?, photo_url = ?, photo_key = ?, updated_at = ?
      WHERE id = ?
    `;
    
    await request.env.DB.prepare(updateQuery).bind(
      reviewData.guestName || existingReview.guest_name,
      reviewData.country || existingReview.country,
      reviewData.flag || existingReview.flag,
      reviewData.rating || existingReview.rating,
      reviewData.reviewText || existingReview.review_text,
      reviewData.platform || existingReview.platform,
      reviewData.stayDate || existingReview.stay_date,
      reviewData.stayDuration || existingReview.stay_duration,
      reviewData.guestCount || existingReview.guest_count,
      reviewData.hostResponse || existingReview.host_response,
      reviewData.photoUrl || existingReview.photo_url,
      reviewData.photoKey || existingReview.photo_key,
      now,
      id
    ).run();
    
    // Obtener la reseña actualizada
    const updatedReview = await request.env.DB.prepare(`
      SELECT * FROM reviews WHERE id = ?
    `).bind(id).first();
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({
        message: 'Reseña actualizada exitosamente',
        review: updatedReview
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    
    return new Response(JSON.stringify({
      error: 'Database Error',
      message: 'Error al actualizar la reseña',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// DELETE /api/reviews/:id - Eliminar reseña (soft delete)
router.delete('/:id', async (request) => {
  try {
    const { id } = request.params;
    
    // Verificar que la reseña existe
    const existingReview = await request.env.DB.prepare(`
      SELECT * FROM reviews WHERE id = ? AND is_active = 1
    `).bind(id).first();
    
    if (!existingReview) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Reseña no encontrada'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verificar permisos
    const ownershipCheck = requireOwnership(request, id);
    if (ownershipCheck) return ownershipCheck;
    
    // Soft delete - marcar como inactiva
    await request.env.DB.prepare(`
      UPDATE reviews SET is_active = 0, updated_at = ? WHERE id = ?
    `).bind(new Date().toISOString(), id).run();
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({
        message: 'Reseña eliminada exitosamente'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    
    return new Response(JSON.stringify({
      error: 'Database Error',
      message: 'Error al eliminar la reseña',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Función auxiliar para obtener bandera del país
function getCountryFlag(country) {
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

export { router as reviewsRoutes }; 