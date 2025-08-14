// Middleware de Rate Limiting para Cloudflare Workers
export const rateLimitMiddleware = async (request) => {
  // Obtener IP del cliente
  const clientIP = request.headers.get('CF-Connecting-IP') || 
                   request.headers.get('X-Forwarded-For') || 
                   'unknown';
  
  // Obtener timestamp actual
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minuto
  const maxRequests = 100; // Máximo 100 requests por minuto
  
  try {
    // Usar KV para almacenar límites de rate
    const rateLimitKey = `rate_limit:${clientIP}`;
    const rateLimitData = await request.env.CONFIG.get(rateLimitKey, 'json');
    
    let currentRequests = 0;
    let windowStart = now;
    
    if (rateLimitData) {
      // Si estamos en la misma ventana de tiempo
      if (now - rateLimitData.windowStart < windowMs) {
        currentRequests = rateLimitData.requests;
        windowStart = rateLimitData.windowStart;
      }
      // Si pasó la ventana, reiniciar contador
    }
    
    // Incrementar contador
    currentRequests++;
    
    // Verificar límite
    if (currentRequests > maxRequests) {
      return new Response(JSON.stringify({
        error: 'Too Many Requests',
        message: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((windowMs - (now - windowStart)) / 1000)
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((windowMs - (now - windowStart)) / 1000)
        }
      });
    }
    
    // Guardar nuevo estado en KV
    await request.env.CONFIG.put(rateLimitKey, JSON.stringify({
      requests: currentRequests,
      windowStart: windowStart
    }), {
      expirationTtl: 120 // Expirar en 2 minutos
    });
    
    // Agregar headers de rate limit a la response
    request.rateLimitInfo = {
      limit: maxRequests,
      remaining: maxRequests - currentRequests,
      reset: windowStart + windowMs
    };
    
    return null; // Continuar con el rate limiting aplicado
    
  } catch (error) {
    console.error('Error en rate limiting:', error);
    
    // En caso de error, continuar sin rate limiting
    // Es mejor permitir el acceso que bloquear completamente
    return null;
  }
};

// Función para agregar headers de rate limit a la response
export const addRateLimitHeaders = (response, rateLimitInfo) => {
  if (!rateLimitInfo) return response;
  
  const newHeaders = new Headers(response.headers);
  
  newHeaders.set('X-RateLimit-Limit', rateLimitInfo.limit);
  newHeaders.set('X-RateLimit-Remaining', rateLimitInfo.remaining);
  newHeaders.set('X-RateLimit-Reset', rateLimitInfo.reset);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}; 