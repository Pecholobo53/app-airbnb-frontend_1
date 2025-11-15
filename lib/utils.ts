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
