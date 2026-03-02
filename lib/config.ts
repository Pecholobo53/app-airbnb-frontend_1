/**
 * lib/config.ts
 *
 * Configuración centralizada del frontend.
 * Fuente única de verdad para URLs, entorno y flags de feature.
 *
 * REGLA DE ACCESO A VARIABLES:
 *   - Variables NEXT_PUBLIC_* → accesibles en browser Y servidor.
 *   - Variables sin prefijo   → solo servidor (SSR / API Routes).
 *
 * Todos los módulos nuevos deben importar desde aquí en lugar de
 * acceder a process.env directamente.
 */

// ---------------------------------------------------------------------------
// Entorno
// ---------------------------------------------------------------------------

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// ---------------------------------------------------------------------------
// Backend API
// ---------------------------------------------------------------------------

/**
 * URL base del backend REST (sin trailing slash, sin /api).
 *
 * · Desarrollo  → ''   → fetch('/api/…') pasa por proxy Next.js → backend local
 * · Producción  → 'https://api.voyageraumaroc.net'
 *
 * Si NEXT_PUBLIC_API_URL viene con trailing /api lo eliminamos para
 * que los servicios puedan construir  `${API_BASE_URL}/api/bookings`
 * sin duplicar el segmento.
 */
export const API_BASE_URL: string = IS_PRODUCTION
  ? (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/?$/, '').replace(/\/$/, '')
  : '';

/**
 * Origen completo del backend (útil para logs y health checks).
 * En dev apunta a localhost según NEXT_PUBLIC_API_URL o fallback estándar.
 */
export const API_ORIGIN: string = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ?? '';

// ---------------------------------------------------------------------------
// Auth / Sesión
// ---------------------------------------------------------------------------

/** Clave bajo la que AuthContext guarda la sesión en sessionStorage */
export const SESSION_KEY = 'airbnb_session' as const;

/**
 * Lee el JWT de la sesión activa (browser-only).
 *
 * Orden de búsqueda:
 *   1. sessionStorage[SESSION_KEY].accessToken | .token
 *   2. localStorage['token']
 *   3. localStorage['authToken']
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const session = JSON.parse(raw) as Record<string, unknown>;
      const t = (session.accessToken ?? session.token) as string | undefined;
      if (t) return t;
    }
  } catch {
    // sessionStorage puede lanzar en contextos con storage restringido
  }

  return localStorage.getItem('token') ?? localStorage.getItem('authToken');
}

/**
 * Headers HTTP listos para usar en fetch().
 * Inyecta Authorization automáticamente si hay sesión activa.
 */
export function buildHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ---------------------------------------------------------------------------
// Servicios externos (browser-safe)
// ---------------------------------------------------------------------------

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

// ---------------------------------------------------------------------------
// Validación de entorno en build-time
// ---------------------------------------------------------------------------

/**
 * Lista de variables requeridas en producción.
 * Llamar en next.config.js o en un Server Component raíz para
 * detectar configs rotas antes de que lleguen a los usuarios.
 */
export function validateEnv(): void {
  if (!IS_PRODUCTION) return;

  const required: string[] = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
  ];

  const missing = required.filter(
    (key) => !process.env[key as keyof typeof process.env]
  );

  if (missing.length > 0) {
    throw new Error(
      `[config] Variables de entorno requeridas no encontradas en producción:\n` +
        missing.map((k) => `  · ${k}`).join('\n')
    );
  }
}

// ---------------------------------------------------------------------------
// Debug helper (solo development)
// ---------------------------------------------------------------------------

/** Imprime configuración activa en consola (solo en dev). */
export function logConfig(): void {
  if (IS_PRODUCTION) return;
  console.group('[config] Configuración activa');
  console.log('  API_BASE_URL :', API_BASE_URL || '(proxy Next.js)');
  console.log('  API_ORIGIN   :', API_ORIGIN);
  console.log('  NODE_ENV     :', process.env.NODE_ENV);
  console.groupEnd();
}
