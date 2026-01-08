import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Combina clases de Tailwind de forma inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formateo de precios consistente
 * @param price - Precio a formatear
 * @param currency - Moneda (por defecto EUR)
 * @returns Precio formateado con símbolo de moneda
 */
export function formatPrice(price: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Manejo seguro de fechas con fallbacks
 * @param date - Fecha a formatear (string, Date o null)
 * @returns Fecha formateada o mensaje de error
 */
export function formatDate(date: string | Date | null): string {
  if (!date) return 'Fecha no disponible';
  try {
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * Formateo de fecha corta (día y mes)
 * @param date - Fecha a formatear
 * @returns Fecha formateada corta (ej: "15 Nov")
 */
export function formatDateShort(date: string | Date | null): string {
  if (!date) return '';
  try {
    return format(new Date(date), 'dd MMM', { locale: es });
  } catch {
    return '';
  }
}

/**
 * Debounce reutilizable para optimizar búsquedas y eventos
 * @param func - Función a ejecutar con debounce
 * @param wait - Tiempo de espera en milisegundos
 * @returns Función con debounce aplicado
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

/**
 * Truncar texto con puntos suspensivos
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado si es necesario
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Pluralizar palabras basado en cantidad
 * @param count - Cantidad
 * @param singular - Forma singular
 * @param plural - Forma plural
 * @returns Palabra en singular o plural según la cantidad
 */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/**
 * Convierte el nombre de un país a su código ISO 3166-1 alpha-2 (2 caracteres)
 * @param countryName - Nombre del país en español o inglés
 * @returns Código ISO de 2 caracteres (ej: "ES", "US", "FR")
 */
/**
 * Normaliza texto para asegurar que los caracteres especiales se muestren correctamente
 * @param text - Texto a normalizar
 * @returns Texto normalizado con encoding UTF-8 correcto
 */
export function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  
  // Reemplazos comunes para caracteres mal codificados
  const replacements: Record<string, string> = {
    'Espaa': 'España',  // Sin la ñ (viene del backend)
    'Espa a': 'España',  // Con carácter de reemplazo
    'Espana': 'España',
    'EspaÃ±a': 'España',
    'EspaÃƒÂ±a': 'España',
    'MÃ©xico': 'México',
    'México': 'México',
    'PerÃº': 'Perú',
    'Peru': 'Perú',
  };
  
  let normalized = text;
  
  // Aplicar reemplazos
  for (const [wrong, correct] of Object.entries(replacements)) {
    normalized = normalized.replace(new RegExp(wrong, 'g'), correct);
  }
  
  // Si hay caracteres de reemplazo Unicode (), intentar reparar
  if (normalized.includes('\ufffd') || normalized.includes('')) {
    try {
      // Intentar decodificar como UTF-8
      const bytes = new Uint8Array(
        normalized.split('').map(char => char.charCodeAt(0))
      );
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const decoded = decoder.decode(bytes);
      if (decoded && !decoded.includes('\ufffd')) {
        normalized = decoded;
      }
    } catch (error) {
      // Si falla, mantener el texto con reemplazos aplicados
    }
  }
  
  return normalized;
}

export function getCountryCode(countryName: string): string {
  const countryMap: Record<string, string> = {
    // Países en español
    'España': 'ES',
    'Francia': 'FR',
    'Italia': 'IT',
    'Portugal': 'PT',
    'Alemania': 'DE',
    'Reino Unido': 'GB',
    'Estados Unidos': 'US',
    'México': 'MX',
    'Argentina': 'AR',
    'Colombia': 'CO',
    'Chile': 'CL',
    'Perú': 'PE',
    'Venezuela': 'VE',
    'Ecuador': 'EC',
    'Uruguay': 'UY',
    'Paraguay': 'PY',
    'Bolivia': 'BO',
    'Brasil': 'BR',
    'Cuba': 'CU',
    'República Dominicana': 'DO',
    'Panamá': 'PA',
    'Costa Rica': 'CR',
    'Guatemala': 'GT',
    'Honduras': 'HN',
    'El Salvador': 'SV',
    'Nicaragua': 'NI',
    'Canadá': 'CA',
    // Países en inglés (fallback)
    'Spain': 'ES',
    'France': 'FR',
    'Italy': 'IT',
    'Portugal': 'PT',
    'Germany': 'DE',
    'United Kingdom': 'GB',
    'United States': 'US',
    'Mexico': 'MX',
    'Argentina': 'AR',
    'Colombia': 'CO',
    'Chile': 'CL',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Ecuador': 'EC',
    'Uruguay': 'UY',
    'Paraguay': 'PY',
    'Bolivia': 'BO',
    'Brazil': 'BR',
    'Cuba': 'CU',
    'Dominican Republic': 'DO',
    'Panama': 'PA',
    'Costa Rica': 'CR',
    'Guatemala': 'GT',
    'Honduras': 'HN',
    'El Salvador': 'SV',
    'Nicaragua': 'NI',
    'Canada': 'CA',
  };

  // Si ya es un código de 2 caracteres, retornarlo directamente
  if (countryName && countryName.length === 2 && /^[A-Z]{2}$/i.test(countryName)) {
    return countryName.toUpperCase();
  }

  // Buscar en el mapa
  const code = countryMap[countryName];
  if (code) {
    return code;
  }

  // Si no se encuentra, retornar 'ES' como fallback (España es el país por defecto)
  console.warn(`⚠️ País no encontrado en el mapa: "${countryName}". Usando "ES" como fallback.`);
  return 'ES';
}