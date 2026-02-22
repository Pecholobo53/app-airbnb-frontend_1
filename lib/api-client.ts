/**
 * lib/api-client.ts
 *
 * Fuente única de verdad para la configuración HTTP del frontend.
 *
 * REGLA DE URL BASE:
 *   - Desarrollo  → ''   (URL relativa → proxy Next.js → backend, evita CORS)
 *   - Producción  → NEXT_PUBLIC_API_URL  (petición directa al backend externo)
 *
 * Todos los servicios en /lib/services/ deben importar desde aquí en lugar de
 * redefinir API_BASE_URL y getAuthToken localmente.
 */

// ---------------------------------------------------------------------------
// API_BASE_URL
// ---------------------------------------------------------------------------

/**
 * Prefijo que se antepone a cada endpoint.
 *
 * · Dev:  '' → fetch('/api/bookings') → Next.js proxy → backend
 * · Prod: 'https://api.voyageaumaroc.com' → fetch directo al backend
 *
 * Si NEXT_PUBLIC_API_URL termina en '/api', se elimina el sufijo para que los
 * servicios puedan construir rutas del tipo `${API_BASE_URL}/api/bookings`
 * sin duplicar el segmento.
 */
export const API_BASE_URL: string =
  process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/?$/, '')
    : '';

// ---------------------------------------------------------------------------
// Token
// ---------------------------------------------------------------------------

/**
 * Lee el JWT de autenticación desde el almacenamiento del navegador.
 *
 * Orden de búsqueda (primer resultado no-nulo):
 *   1. sessionStorage['airbnb_session']  → .accessToken  o  .token
 *   2. localStorage['token']
 *   3. localStorage['authToken']
 *
 * Devuelve null en SSR (window no definido).
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem('airbnb_session');
    if (raw) {
      const session = JSON.parse(raw) as Record<string, unknown>;
      const t = (session.accessToken ?? session.token) as string | undefined;
      if (t) return t;
    }
  } catch {
    // sessionStorage puede fallar en contextos con cookies bloqueadas
  }

  return localStorage.getItem('token') ?? localStorage.getItem('authToken');
}

// ---------------------------------------------------------------------------
// Headers
// ---------------------------------------------------------------------------

/**
 * Construye los headers HTTP comunes para cualquier petición a la API.
 *
 * Incluye automáticamente `Authorization: Bearer <token>` si hay sesión activa.
 * Se pueden añadir o sobreescribir headers extra mediante el parámetro `extra`.
 */
export function buildHeaders(
  extra: Record<string, string> = {}
): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// Respuesta genérica
// ---------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ---------------------------------------------------------------------------
// Manejo de errores de red
// ---------------------------------------------------------------------------

/**
 * Convierte un error de `fetch` en un `ApiResponse` con mensaje amigable.
 * Distingue errores de red, timeouts y errores de parseo JSON.
 */
export function handleNetworkError<T>(
  error: unknown,
  endpoint: string
): ApiResponse<T> {
  const origin = API_BASE_URL || '(proxy Next.js)';

  if (error instanceof DOMException && error.name === 'AbortError') {
    return {
      success: false,
      error: {
        code: 'TIMEOUT_ERROR',
        message: `El servidor no respondió a tiempo (${origin}). Comprueba que el backend esté activo.`,
      },
    };
  }

  if (error instanceof TypeError) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes('failed to fetch') ||
      msg.includes('networkerror') ||
      msg.includes('network request failed')
    ) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `No se pudo conectar al backend (${origin}). Verifica tu conexión y que el servidor esté activo.`,
        },
      };
    }
  }

  return {
    success: false,
    error: {
      code: 'NETWORK_ERROR',
      message:
        error instanceof Error
          ? error.message
          : `Error desconocido en ${endpoint}`,
    },
  };
}

// ---------------------------------------------------------------------------
// HTTP status → ApiResponse
// ---------------------------------------------------------------------------

const STATUS_MESSAGES: Record<number, [string, string]> = {
  401: ['UNAUTHORIZED',       'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'],
  403: ['FORBIDDEN',          'No tienes permisos para realizar esta acción.'],
  404: ['NOT_FOUND',          'El recurso solicitado no existe.'],
  409: ['CONFLICT',           'Conflicto: el recurso ya existe o las fechas están ocupadas.'],
  422: ['VALIDATION_ERROR',   'Los datos enviados no son válidos.'],
  429: ['RATE_LIMIT',         'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.'],
  500: ['SERVER_ERROR',       'Error interno del servidor. Por favor, inténtalo más tarde.'],
  502: ['BAD_GATEWAY',        'El servidor no está disponible en este momento.'],
  503: ['SERVICE_UNAVAILABLE','El servicio está temporalmente fuera de línea.'],
};

/**
 * Transforma una respuesta HTTP no-ok en un `ApiResponse` con código y
 * mensaje estandarizados, priorizando el mensaje del cuerpo JSON del backend.
 */
export function httpErrorToResponse<T>(
  status: number,
  body: Record<string, unknown>
): ApiResponse<T> {
  const [defaultCode, defaultMessage] = STATUS_MESSAGES[status] ?? [
    `HTTP_${status}`,
    `Error ${status}`,
  ];

  const code = (body.code as string) ?? defaultCode;
  const message =
    (body.message as string) ??
    (body.error as Record<string, string> | undefined)?.message ??
    defaultMessage;

  return { success: false, error: { code, message } };
}
