// Rutas para gestión de fotos de huéspedes
import { Router } from 'itty-router';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import { addCorsHeaders, handleCors } from '../middleware/cors.js';
import { addRateLimitHeaders } from '../middleware/rateLimit.js';
import { generateId, validateImageType, validateImageSize } from '../utils/helpers.js';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.all('*', authMiddleware);

// Manejar preflight CORS
router.options('*', handleCors);

// POST /api/photos - Subir foto de huésped
router.post('/', async (request) => {
  try {
    // Verificar permisos de administrador
    const adminCheck = requireAdmin(request);
    if (adminCheck) return adminCheck;
    
    const formData = await request.formData();
    const file = formData.get('photo');
    const reviewId = formData.get('reviewId');
    
    if (!file) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'No se proporcionó archivo de foto'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validar tipo de archivo
    if (!validateImageType(file.type)) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Tipo de archivo no permitido. Solo se permiten JPG, PNG, WebP y GIF'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validar tamaño
    if (!validateImageSize(file.size)) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Archivo demasiado grande. Máximo 5MB'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generar nombre único para el archivo
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileName = `${generateId()}.${fileExtension}`;
    
    // Subir a R2
    await request.env.IMAGES_BUCKET.put(fileName, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000' // 1 año
      }
    });
    
    // Generar URL pública
    const photoUrl = `https://${request.env.IMAGES_BUCKET}.r2.cloudflarestorage.com/${fileName}`;
    
    // Guardar metadatos en la base de datos
    const photoId = generateId();
    const now = new Date().toISOString();
    
    await request.env.DB.prepare(`
      INSERT INTO guest_photos (
        id, review_id, original_filename, r2_key, url, mime_type, size_bytes, uploaded_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      photoId,
      reviewId || null,
      file.name,
      fileName,
      photoUrl,
      file.type,
      file.size,
      now
    ).run();
    
    // Actualizar reseña con la foto si se proporcionó reviewId
    if (reviewId) {
      await request.env.DB.prepare(`
        UPDATE reviews SET photo_url = ?, photo_key = ?, updated_at = ? WHERE id = ?
      `).bind(photoUrl, fileName, now, reviewId).run();
    }
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({
        message: 'Foto subida exitosamente',
        photo: {
          id: photoId,
          url: photoUrl,
          filename: file.name,
          size: file.size,
          type: file.type
        }
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al subir foto:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al subir la foto',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// GET /api/photos/:id - Obtener foto específica
router.get('/:id', async (request) => {
  try {
    const { id } = request.params;
    
    const photo = await request.env.DB.prepare(`
      SELECT * FROM guest_photos WHERE id = ?
    `).bind(id).first();
    
    if (!photo) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Foto no encontrada'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({ photo }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al obtener foto:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al obtener la foto',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// DELETE /api/photos/:id - Eliminar foto
router.delete('/:id', async (request) => {
  try {
    const { id } = request.params;
    
    // Verificar permisos de administrador
    const adminCheck = requireAdmin(request);
    if (adminCheck) return adminCheck;
    
    // Obtener información de la foto
    const photo = await request.env.DB.prepare(`
      SELECT * FROM guest_photos WHERE id = ?
    `).bind(id).first();
    
    if (!photo) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Foto no encontrada'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Eliminar de R2
    await request.env.IMAGES_BUCKET.delete(photo.r2_key);
    
    // Eliminar de la base de datos
    await request.env.DB.prepare(`
      DELETE FROM guest_photos WHERE id = ?
    `).bind(id).run();
    
    // Limpiar referencia en la reseña si existe
    if (photo.review_id) {
      await request.env.DB.prepare(`
        UPDATE reviews SET photo_url = NULL, photo_key = NULL, updated_at = ? WHERE id = ?
      `).bind(new Date().toISOString(), photo.review_id).run();
    }
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({
        message: 'Foto eliminada exitosamente'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al eliminar foto:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al eliminar la foto',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as photosRoutes }; 