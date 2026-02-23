// lib/utils/request-cache.ts

/**
 * Sistema de caché para requests HTTP
 * Evita múltiples peticiones simultáneas y rate limiting
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class RequestCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtener datos del caché o ejecutar la función
   * Si hay una petición pendiente, espera a que termine en lugar de hacer otra
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    // Verificar si hay una petición pendiente
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending;
    }

    // Verificar caché
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    // Ejecutar petición
    const promise = fetchFn()
      .then((data) => {
        // Solo guardar en caché si la respuesta es exitosa
        // Verificar si tiene estructura { success: true, data: ... }
        if (data && typeof data === 'object' && 'success' in data) {
          if (data.success === true && 'data' in data && (data as Record<string, unknown>).data) {
            // Guardar en caché solo si es exitoso
            this.cache.set(key, {
              data,
              timestamp: Date.now(),
              expiresAt: Date.now() + ttl,
            });
          }
        } else {
          // Si no tiene estructura de respuesta, guardar directamente
          this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + ttl,
          });
        }
        // Remover de peticiones pendientes
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        console.error(`❌ [CACHE] Error en petición ${key}`);
        // Remover de peticiones pendientes en caso de error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Guardar petición pendiente
    this.pendingRequests.set(key, promise);

    return promise;
  }

  /**
   * Invalidar caché para una clave específica
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpiar todo el caché
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Instancia singleton
export const requestCache = new RequestCache();

