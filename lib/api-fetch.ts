/**
 * lib/api-fetch.ts
 *
 * Wrapper robusto sobre fetch() que distingue claramente:
 *
 *   result.network === true   → El servidor es INALCANZABLE (cable desenchufado,
 *                               servidor caído, CORS preflight fallido).
 *                               SOLO aquí debe mostrarse el banner de conexión.
 *
 *   result.ok === false       → El servidor respondió pero con un error HTTP
 *                               (401, 403, 404, 409, 422, 429, 500…).
 *                               Mostrar el mensaje del backend, NO el banner de red.
 *
 *   result.ok === true        → Éxito. result.data contiene el cuerpo parseado.
 *
 * Uso:
 *   const result = await apiFetch(`${API_URL}/api/auth/login`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email, password }),
 *   });
 *
 *   if (result.network) { showConnectionBanner(); return; }
 *   if (!result.ok)     { showFieldError(result.error); return; }
 *   const { user, accessToken } = result.data;
 */

export interface ApiFetchSuccess<T = unknown> {
  ok: true;
  network: false;
  status: number;
  data: T;
}

export interface ApiFetchHttpError {
  ok: false;
  network: false;
  status: number;
  error: string;
}

export interface ApiFetchNetworkError {
  ok: false;
  network: true;
  status: null;
  error: string;
}

export type ApiFetchResult<T = unknown> =
  | ApiFetchSuccess<T>
  | ApiFetchHttpError
  | ApiFetchNetworkError;

/**
 * Hace una petición HTTP y devuelve un resultado tipado.
 * NUNCA lanza excepciones: todos los errores se devuelven como objetos.
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<ApiFetchResult<T>> {
  let response: Response;

  // ── Intento de red ────────────────────────────────────────────────────────
  try {
    response = await fetch(url, options);
  } catch (err) {
    // TypeError o DOMException → servidor inalcanzable / CORS bloqueado
    const message =
      err instanceof Error
        ? err.message
        : 'No se pudo conectar al servidor';

    return {
      ok: false,
      network: true,   // ← ÚNICO caso donde el banner de red debe mostrarse
      status: null,
      error: message,
    };
  }

  // ── Parseo del cuerpo ─────────────────────────────────────────────────────
  let data: unknown = null;
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      // JSON malformado — tratado como error HTTP, no de red
      return {
        ok: false,
        network: false,
        status: response.status,
        error: `Respuesta del servidor no es JSON válido (HTTP ${response.status})`,
      };
    }
  }

  // ── Error HTTP (4xx / 5xx) ────────────────────────────────────────────────
  if (!response.ok) {
    const body = (data ?? {}) as Record<string, unknown>;

    const message =
      (body.message as string | undefined) ??
      ((body.error as Record<string, string> | undefined)?.message) ??
      (body.error as string | undefined) ??
      `Error ${response.status}`;

    return {
      ok: false,
      network: false,   // ← el servidor SÍ respondió; no es error de red
      status: response.status,
      error: message,
    };
  }

  // ── Éxito ─────────────────────────────────────────────────────────────────
  return {
    ok: true,
    network: false,
    status: response.status,
    data: data as T,
  };
}
