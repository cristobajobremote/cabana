// Rutas para estadísticas del sistema
import { Router } from 'itty-router';
import { authMiddleware } from '../middleware/auth.js';
import { addCorsHeaders, handleCors } from '../middleware/cors.js';
import { addRateLimitHeaders } from '../middleware/rateLimit.js';

const router = Router();

// Manejar preflight CORS
router.options('*', handleCors);

// GET /api/stats/public - Estadísticas públicas (sin autenticación)
router.get('/public', async (request) => {
  try {
    // Obtener estadísticas básicas de reseñas
    const stats = await request.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_reviews,
        ROUND(AVG(rating), 1) as average_rating,
        COUNT(CASE WHEN platform = 'booking' THEN 1 END) as booking_reviews,
        COUNT(CASE WHEN platform = 'airbnb' THEN 1 END) as airbnb_reviews,
        COUNT(CASE WHEN platform = 'direct' THEN 1 END) as direct_reviews,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_reviews,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as four_plus_reviews,
        COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as reviews_with_photos
      FROM reviews 
      WHERE is_active = 1
    `).first();
    
    // Obtener países más frecuentes
    const countries = await request.env.DB.prepare(`
      SELECT country, flag, COUNT(*) as count
      FROM reviews 
      WHERE is_active = 1 
      GROUP BY country, flag 
      ORDER BY count DESC 
      LIMIT 10
    `).all();
    
    // Obtener reseñas recientes destacadas
    const recentReviews = await request.env.DB.prepare(`
      SELECT id, guest_name, country, flag, rating, review_text, platform, created_at
      FROM reviews 
      WHERE is_active = 1 AND rating >= 4
      ORDER BY created_at DESC 
      LIMIT 5
    `).all();
    
    const response = {
      stats: {
        totalReviews: stats.total_reviews,
        averageRating: stats.average_rating,
        platformBreakdown: {
          booking: stats.booking_reviews,
          airbnb: stats.airbnb_reviews,
          direct: stats.direct_reviews
        },
        ratingBreakdown: {
          fiveStar: stats.five_star_reviews,
          fourPlus: stats.four_plus_reviews
        },
        photosCount: stats.reviews_with_photos
      },
      topCountries: countries.results,
      recentHighlights: recentReviews.results,
      lastUpdated: new Date().toISOString()
    };
    
    return addRateLimitHeaders(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al obtener estadísticas públicas:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al obtener estadísticas',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// GET /api/stats - Estadísticas completas (requiere autenticación)
router.get('/', async (request) => {
  try {
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (authResult) return authResult;
    
    // Obtener estadísticas detalladas
    const detailedStats = await request.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_reviews,
        ROUND(AVG(rating), 1) as average_rating,
        COUNT(CASE WHEN platform = 'booking' THEN 1 END) as booking_reviews,
        COUNT(CASE WHEN platform = 'airbnb' THEN 1 END) as airbnb_reviews,
        COUNT(CASE WHEN platform = 'direct' THEN 1 END) as direct_reviews,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_reviews,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_reviews,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_reviews,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_reviews,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_reviews,
        COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as reviews_with_photos,
        COUNT(CASE WHEN host_response IS NOT NULL THEN 1 END) as reviews_with_responses,
        MIN(created_at) as oldest_review,
        MAX(created_at) as newest_review
      FROM reviews 
      WHERE is_active = 1
    `).first();
    
    // Obtener estadísticas por mes (últimos 12 meses)
    const monthlyStats = await request.env.DB.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count,
        ROUND(AVG(rating), 1) as avg_rating
      FROM reviews 
      WHERE is_active = 1 
        AND created_at >= datetime('now', '-12 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
    `).all();
    
    // Obtener estadísticas por país
    const countryStats = await request.env.DB.prepare(`
      SELECT 
        country, 
        flag, 
        COUNT(*) as count,
        ROUND(AVG(rating), 1) as avg_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count
      FROM reviews 
      WHERE is_active = 1 
      GROUP BY country, flag 
      ORDER BY count DESC
    `).all();
    
    // Obtener estadísticas de plataformas
    const platformStats = await request.env.DB.prepare(`
      SELECT 
        platform,
        COUNT(*) as count,
        ROUND(AVG(rating), 1) as avg_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
        COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as photos_count
      FROM reviews 
      WHERE is_active = 1 
      GROUP BY platform
      ORDER BY count DESC
    `).all();
    
    // Obtener reseñas más recientes
    const recentReviews = await request.env.DB.prepare(`
      SELECT 
        id, guest_name, country, flag, rating, review_text, platform, 
        created_at, photo_url
      FROM reviews 
      WHERE is_active = 1
      ORDER BY created_at DESC 
      LIMIT 10
    `).all();
    
    const response = {
      overview: {
        totalReviews: detailedStats.total_reviews,
        averageRating: detailedStats.average_rating,
        totalPhotos: detailedStats.reviews_with_photos,
        totalResponses: detailedStats.reviews_with_responses,
        dateRange: {
          oldest: detailedStats.oldest_review,
          newest: detailedStats.newest_review
        }
      },
      ratingDistribution: {
        fiveStar: detailedStats.five_star_reviews,
        fourStar: detailedStats.four_star_reviews,
        threeStar: detailedStats.three_star_reviews,
        twoStar: detailedStats.two_star_reviews,
        oneStar: detailedStats.one_star_reviews
      },
      platformBreakdown: platformStats.results,
      countryBreakdown: countryStats.results,
      monthlyTrends: monthlyStats.results,
      recentActivity: recentReviews.results,
      generatedAt: new Date().toISOString()
    };
    
    return addRateLimitHeaders(
      new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al obtener estadísticas detalladas:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al obtener estadísticas detalladas',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// GET /api/stats/export - Exportar estadísticas en CSV
router.get('/export', async (request) => {
  try {
    // Aplicar middleware de autenticación
    const authResult = await authMiddleware(request);
    if (authResult) return authResult;
    
    // Obtener todas las reseñas para exportar
    const reviews = await request.env.DB.prepare(`
      SELECT 
        guest_name, country, flag, rating, review_text, platform,
        stay_date, stay_duration, guest_count, host_response,
        photo_url, created_at
      FROM reviews 
      WHERE is_active = 1
      ORDER BY created_at DESC
    `).all();
    
    // Generar CSV
    const csvHeaders = [
      'Nombre Huésped',
      'País',
      'Bandera',
      'Calificación',
      'Texto Reseña',
      'Plataforma',
      'Fecha Estadía',
      'Duración',
      'Número Huéspedes',
      'Respuesta Anfitrión',
      'URL Foto',
      'Fecha Creación'
    ];
    
    let csvContent = csvHeaders.join(',') + '\n';
    
    reviews.results.forEach(review => {
      const row = [
        `"${review.guest_name}"`,
        `"${review.country}"`,
        `"${review.flag}"`,
        review.rating,
        `"${review.review_text.replace(/"/g, '""')}"`,
        `"${review.platform}"`,
        `"${review.stay_date || ''}"`,
        `"${review.stay_duration || ''}"`,
        review.guest_count || '',
        `"${(review.host_response || '').replace(/"/g, '""')}"`,
        `"${review.photo_url || ''}"`,
        `"${review.created_at}"`
      ];
      csvContent += row.join(',') + '\n';
    });
    
    const filename = `estadisticas-resenas-${new Date().toISOString().split('T')[0]}.csv`;
    
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
    
  } catch (error) {
    console.error('Error al exportar estadísticas:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al exportar estadísticas',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as statsRoutes }; 