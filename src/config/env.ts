const apiMode = (import.meta.env.VITE_API_MODE || 'http').toLowerCase()

export const env = {
  /** URL base del backend, sin barra final. Ej: https://api.northland.example
   * Ojo: en CI una variable no definida llega como "" — usar ||, no ??. */
  apiUrl: (import.meta.env.VITE_API_URL || 'http://localhost:8010').replace(/\/+$/, ''),
  /** 'http' = API real · 'demo' = datos de demostración locales (nunca en producción) */
  apiMode: apiMode === 'demo' ? 'demo' : 'http',
  apiPrefix: '/api/v1',
} as const

export const isDemo = env.apiMode === 'demo'
