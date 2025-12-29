// lib/utils/geocoding.ts

/**
 * GEOCODING UTILITIES
 * 
 * Utilidades para convertir direcciones en coordenadas geográficas
 * usando el servicio gratuito de Nominatim (OpenStreetMap)
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName?: string;
}

/**
 * Realiza una búsqueda en Nominatim
 */
async function searchNominatim(query: string): Promise<any> {
  const encodedAddress = encodeURIComponent(query.trim());
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=3&addressdetails=1`;
  
  console.log('🔍 [GEOCODING] Buscando:', query);
  console.log('📡 [GEOCODING] URL:', url);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Airbnb-Property-App/1.0', // Requerido por Nominatim
      'Accept-Language': 'es,en', // Preferir resultados en español
    },
  });

  if (!response.ok) {
    console.error('❌ [GEOCODING] Error HTTP:', response.status, response.statusText);
    return null;
  }

  const data = await response.json();
  console.log('📥 [GEOCODING] Resultados encontrados:', data?.length || 0);
  
  return data;
}

/**
 * Convierte una dirección en coordenadas geográficas usando Nominatim
 * Intenta múltiples variaciones de la dirección si la primera no funciona
 * 
 * @param address - Dirección completa (ej: "Calle Gran Vía, Madrid, España")
 * @returns Coordenadas {lat, lng} o null si no se encuentra
 * 
 * @example
 * const coords = await geocodeAddress("Barcelona, España");
 * // { lat: 41.3851, lng: 2.1734 }
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!address || address.trim() === '') {
    console.warn('⚠️ [GEOCODING] Dirección vacía');
    return null;
  }

  try {
    // Intentar múltiples variaciones de la dirección
    const addressVariations = [
      address.trim(), // 1. Dirección completa
      address.trim().replace(/\s+/g, ' '), // 2. Sin espacios múltiples
    ];

    // Si la dirección tiene comas, intentar también sin la primera parte (dirección específica)
    if (address.includes(',')) {
      const parts = address.split(',').map(p => p.trim()).filter(p => p);
      if (parts.length > 2) {
        // Quitar la primera parte (dirección específica) y mantener el resto
        addressVariations.push(parts.slice(1).join(', '));
      }
      // Solo ciudad y país
      if (parts.length >= 2) {
        addressVariations.push(`${parts[parts.length - 2]}, ${parts[parts.length - 1]}`);
      }
    }

    console.log('🔄 [GEOCODING] Intentando', addressVariations.length, 'variaciones de la dirección');

    // Intentar cada variación
    for (let i = 0; i < addressVariations.length; i++) {
      const variation = addressVariations[i];
      console.log(`📋 [GEOCODING] Intento ${i + 1}/${addressVariations.length}: "${variation}"`);

      const data = await searchNominatim(variation);

      if (Array.isArray(data) && data.length > 0) {
        // Buscar el resultado más relevante
        let bestResult = data[0];
        
        // Si hay múltiples resultados, preferir los que tienen mejor importancia
        if (data.length > 1) {
          bestResult = data.reduce((best, current) => {
            const bestImportance = parseFloat(best.importance || '0');
            const currentImportance = parseFloat(current.importance || '0');
            return currentImportance > bestImportance ? current : best;
          });
        }

        const coordinates: GeocodeResult = {
          lat: parseFloat(bestResult.lat),
          lng: parseFloat(bestResult.lon),
          displayName: bestResult.display_name,
        };

        // Validar que las coordenadas sean válidas
        if (!isNaN(coordinates.lat) && !isNaN(coordinates.lng) && 
            coordinates.lat !== 0 && coordinates.lng !== 0) {
          console.log('✅ [GEOCODING] Coordenadas encontradas:', coordinates);
          console.log('📍 [GEOCODING] Ubicación:', coordinates.displayName);
          return coordinates;
        } else {
          console.warn('⚠️ [GEOCODING] Coordenadas inválidas en resultado:', bestResult);
        }
      }

      // Pequeño delay entre intentos para no sobrecargar Nominatim
      if (i < addressVariations.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.warn('⚠️ [GEOCODING] No se encontraron resultados para ninguna variación de:', address);
    return null;
  } catch (error) {
    console.error('❌ [GEOCODING] Error al obtener coordenadas:', error);
    if (error instanceof Error) {
      console.error('❌ [GEOCODING] Mensaje de error:', error.message);
    }
    return null;
  }
}

/**
 * Construye una dirección completa a partir de los campos del formulario
 * Genera múltiples variaciones para mejorar las posibilidades de encontrar coordenadas
 * 
 * @param city - Ciudad
 * @param country - País
 * @param address - Dirección específica (opcional)
 * @param region - Región/Estado (opcional)
 * @returns Dirección completa formateada (la más completa posible)
 */
export function buildAddress(
  city: string,
  country: string,
  address?: string,
  region?: string
): string {
  const parts: string[] = [];
  
  // Construir dirección en orden: dirección específica, ciudad, región, país
  if (address && address.trim()) {
    parts.push(address.trim());
  }
  if (city && city.trim()) {
    parts.push(city.trim());
  }
  if (region && region.trim()) {
    parts.push(region.trim());
  }
  if (country && country.trim()) {
    parts.push(country.trim());
  }

  const fullAddress = parts.join(', ');
  
  // Si no hay dirección específica pero hay ciudad y país, eso es suficiente
  if (!address && city && country) {
    return fullAddress;
  }

  return fullAddress;
}

/**
 * Valida si las coordenadas son válidas
 * 
 * @param lat - Latitud
 * @param lng - Longitud
 * @returns true si las coordenadas son válidas
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    (lat !== 0 || lng !== 0) // No permitir coordenadas en (0,0) que es el océano
  );
}

