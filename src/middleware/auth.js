// Middleware de Autenticación con Cloudflare Access
export const authMiddleware = async (request) => {
  // Verificar si es una ruta pública
  const publicRoutes = ['/health', '/api/stats/public'];
  const isPublicRoute = publicRoutes.some(route => request.url.includes(route));
  
  if (isPublicRoute) {
    return null; // Continuar sin autenticación
  }

  try {
    // Obtener headers de autenticación de Cloudflare Access
    const cfAccessJwtAssertion = request.headers.get('CF-Access-JWT-Assertion');
    const cfAccessAuthenticatedUserEmail = request.headers.get('CF-Access-Authenticated-User-Email');
    const cfAccessAuthenticatedUserEmailVerified = request.headers.get('CF-Access-Authenticated-User-Email-Verified');
    
    // Verificar que el usuario esté autenticado
    if (!cfAccessJwtAssertion || !cfAccessAuthenticatedUserEmail) {
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        message: 'Acceso no autorizado. Inicia sesión en Cloudflare Access.',
        code: 'AUTH_REQUIRED'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar que el email esté verificado
    if (cfAccessAuthenticatedUserEmailVerified !== 'true') {
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        message: 'Email no verificado. Verifica tu cuenta en Cloudflare Access.',
        code: 'EMAIL_NOT_VERIFIED'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Agregar información del usuario al request
    request.user = {
      email: cfAccessAuthenticatedUserEmail,
      emailVerified: cfAccessAuthenticatedUserEmailVerified === 'true',
      jwt: cfAccessJwtAssertion
    };

    // Verificar permisos de administrador (opcional)
    const adminEmails = [
      'contacto@cabanasoldelnevado.cl',
      'admin@cabanasoldelnevado.cl'
    ];
    
    request.user.isAdmin = adminEmails.includes(cfAccessAuthenticatedUserEmail.toLowerCase());
    
    return null; // Continuar con la autenticación exitosa
    
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    return new Response(JSON.stringify({
      error: 'Authentication Error',
      message: 'Error en el proceso de autenticación',
      code: 'AUTH_ERROR'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Función para verificar permisos de administrador
export const requireAdmin = (request) => {
  if (!request.user || !request.user.isAdmin) {
    return new Response(JSON.stringify({
      error: 'Forbidden',
      message: 'Acceso denegado. Se requieren permisos de administrador.',
      code: 'ADMIN_REQUIRED'
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return null;
};

// Función para verificar que el usuario sea propietario de la reseña
export const requireOwnership = (request, reviewId) => {
  // Los administradores pueden acceder a todo
  if (request.user && request.user.isAdmin) {
    return null;
  }
  
  // Aquí podrías implementar lógica adicional si es necesario
  // Por ahora, solo permitimos acceso a administradores
  return requireAdmin(request);
}; 