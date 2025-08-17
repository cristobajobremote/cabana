// Configuración de ambientes para Cabaña Sol del Nevado
export const environments = {
  local: {
    name: 'Local',
    apiUrl: 'http://localhost:8787',
    database: 'local',
    storage: 'local',
    color: '#17a2b8',
    icon: '🏠',
    description: 'Entorno de desarrollo local'
  },
  staging: {
    name: 'Staging',
    apiUrl: 'https://cabanasoldelnevado-reviews-staging.solnevadolastrancas.workers.dev',
    database: 'cabanasoldelnevado-reviews-staging',
    storage: 'cabanasoldelnevado-images-stg',
    color: '#ff6b35',
    icon: '🧪',
    description: 'Entorno de pruebas'
  },
  production: {
    name: 'Production',
    apiUrl: 'https://cabanasoldelnevado-reviews-prod.solnevadolastrancas.workers.dev',
    database: 'cabanasoldelnevado-reviews',
    storage: 'cabanasoldelnevado-images',
    color: '#28a745',
    icon: '🚀',
    description: 'Entorno de producción'
  }
};

// Detectar ambiente automáticamente
export function detectEnvironment() {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (port === '8787') return 'local';
    return 'local';
  }
  
  if (hostname.includes('staging')) return 'staging';
  if (hostname.includes('prod')) return 'production';
  
  // Por defecto, staging
  return 'staging';
}

// Obtener configuración del ambiente actual
export function getCurrentEnvironment() {
  const env = detectEnvironment();
  return environments[env];
}

// Obtener configuración por nombre
export function getEnvironmentByName(name) {
  return environments[name];
}

// Listar todos los ambientes disponibles
export function listEnvironments() {
  return Object.keys(environments);
}

// Validar si un ambiente es válido
export function isValidEnvironment(name) {
  return environments.hasOwnProperty(name);
} 