// lib/utils/availability-cache.ts

/**
 * Sistema de caché para resultados de disponibilidad
 * Evita llamadas repetidas a la API para la misma propiedad y rango de fechas
 */

interface CachedAvailability {
  propertyId: string;
  blockedDates: string[];
  availableDates: string[];
  minNights: number;
  maxNights: number;
  instantBook: boolean;
  timestamp: number;
}

// Caché en memoria (se limpia al recargar la página)
const cache = new Map<string, CachedAvailability>();

// Tiempo de expiración del caché: 5 minutos
const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

/**
 * Genera una clave única para el caché basada en propertyId
 */
function getCacheKey(propertyId: string): string {
  return `availability_${propertyId}`;
}

/**
 * Obtiene datos de disponibilidad del caché si están disponibles y no han expirado
 */
export function getCachedAvailability(propertyId: string): CachedAvailability | null {
  const key = getCacheKey(propertyId);
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  // Verificar si el caché ha expirado
  const now = Date.now();
  if (now - cached.timestamp > CACHE_EXPIRATION_MS) {
    cache.delete(key);
    return null;
  }

  return cached;
}

/**
 * Guarda datos de disponibilidad en el caché
 */
export function setCachedAvailability(
  propertyId: string,
  data: Omit<CachedAvailability, 'propertyId' | 'timestamp'>
): void {
  const key = getCacheKey(propertyId);
  cache.set(key, {
    propertyId,
    ...data,
    timestamp: Date.now(),
  });
}

/**
 * Limpia el caché para una propiedad específica
 */
export function clearCachedAvailability(propertyId: string): void {
  const key = getCacheKey(propertyId);
  cache.delete(key);
}

/**
 * Limpia todo el caché
 */
export function clearAllCache(): void {
  cache.clear();
}

/**
 * Obtiene solo las fechas bloqueadas del caché
 */
export function getCachedBlockedDates(propertyId: string): string[] {
  const cached = getCachedAvailability(propertyId);
  return cached?.blockedDates || [];
}

