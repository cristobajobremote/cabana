// Rutas para configuración del sistema
import { Router } from 'itty-router';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';
import { addCorsHeaders, handleCors } from '../middleware/cors.js';
import { addRateLimitHeaders } from '../middleware/rateLimit.js';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.all('*', authMiddleware);

// Manejar preflight CORS
router.options('*', handleCors);

// GET /api/config - Obtener configuración del sistema
router.get('/', async (request) => {
  try {
    // Verificar permisos de administrador
    const adminCheck = requireAdmin(request);
    if (adminCheck) return adminCheck;
    
    // Obtener todas las configuraciones
    const configs = await request.env.DB.prepare(`
      SELECT key, value, description, updated_at
      FROM system_config
      ORDER BY key
    `).all();
    
    // Convertir a objeto para fácil acceso
    const configObject = {};
    configs.results.forEach(config => {
      configObject[config.key] = {
        value: config.value,
        description: config.description,
        updatedAt: config.updated_at
      };
    });
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({
        config: configObject,
        lastUpdated: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al obtener configuración',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// GET /api/config/:key - Obtener configuración específica
router.get('/:key', async (request) => {
  try {
    const { key } = request.params;
    
    const config = await request.env.DB.prepare(`
      SELECT key, value, description, updated_at
      FROM system_config
      WHERE key = ?
    `).bind(key).first();
    
    if (!config) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Configuración no encontrada'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({ config }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al obtener configuración específica:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al obtener configuración',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// PUT /api/config/:key - Actualizar configuración
router.put('/:key', async (request) => {
  try {
    // Verificar permisos de administrador
    const adminCheck = requireAdmin(request);
    if (adminCheck) return adminCheck;
    
    const { key } = request.params;
    const { value, description } = await request.json();
    
    if (value === undefined) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'El valor es requerido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validar tipos de configuración específicos
    if (key === 'maintenance_mode') {
      if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
        return new Response(JSON.stringify({
          error: 'Bad Request',
          message: 'maintenance_mode debe ser true o false'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (key === 'max_reviews_per_page') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 100) {
        return new Response(JSON.stringify({
          error: 'Bad Request',
          message: 'max_reviews_per_page debe ser un número entre 1 y 100'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (key === 'allow_guest_uploads' || key === 'auto_approve_reviews') {
      if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
        return new Response(JSON.stringify({
          error: 'Bad Request',
          message: `${key} debe ser true o false`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (key === 'notification_email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return new Response(JSON.stringify({
          error: 'Bad Request',
          message: 'notification_email debe ser un email válido'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    const now = new Date().toISOString();
    
    // Actualizar o insertar configuración
    await request.env.DB.prepare(`
      INSERT OR REPLACE INTO system_config (key, value, description, updated_at)
      VALUES (?, ?, ?, ?)
    `).bind(key, value.toString(), description || '', now).run();
    
    // Obtener la configuración actualizada
    const updatedConfig = await request.env.DB.prepare(`
      SELECT key, value, description, updated_at
      FROM system_config
      WHERE key = ?
    `).bind(key).first();
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({
        message: 'Configuración actualizada exitosamente',
        config: updatedConfig
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al actualizar configuración',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// DELETE /api/config/:key - Eliminar configuración
router.delete('/:key', async (request) => {
  try {
    // Verificar permisos de administrador
    const adminCheck = requireAdmin(request);
    if (adminCheck) return adminCheck;
    
    const { key } = request.params;
    
    // No permitir eliminar configuraciones críticas
    const criticalConfigs = ['maintenance_mode', 'max_reviews_per_page'];
    if (criticalConfigs.includes(key)) {
      return new Response(JSON.stringify({
        error: 'Forbidden',
        message: 'No se puede eliminar esta configuración crítica'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verificar que la configuración existe
    const existingConfig = await request.env.DB.prepare(`
      SELECT key FROM system_config WHERE key = ?
    `).bind(key).first();
    
    if (!existingConfig) {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Configuración no encontrada'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Eliminar configuración
    await request.env.DB.prepare(`
      DELETE FROM system_config WHERE key = ?
    `).bind(key).run();
    
    return addRateLimitHeaders(
      new Response(JSON.stringify({
        message: 'Configuración eliminada exitosamente'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }),
      request.rateLimitInfo
    );
    
  } catch (error) {
    console.error('Error al eliminar configuración:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Error al eliminar configuración',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// GET /api/config/maintenance/status - Verificar estado de mantenimiento
router.get('/maintenance/status', async (request) => {
  try {
    const maintenanceConfig = await request.env.DB.prepare(`
      SELECT value FROM system_config WHERE key = 'maintenance_mode'
    `).first();
    
    const isMaintenanceMode = maintenanceConfig && maintenanceConfig.value === 'true';
    
    return new Response(JSON.stringify({
      maintenanceMode: isMaintenanceMode,
      message: isMaintenanceMode ? 'Sistema en mantenimiento' : 'Sistema operativo',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error al verificar estado de mantenimiento:', error);
    
    // En caso de error, asumir que el sistema está operativo
    return new Response(JSON.stringify({
      maintenanceMode: false,
      message: 'Sistema operativo',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as configRoutes }; 