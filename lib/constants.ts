// lib/constants.ts
// Configuración centralizada de la aplicación según reglas de .cursorrules

/**
 * Configuración general de la aplicación
 */
export const APP_CONFIG = {
  MAX_GUESTS: 16,
  MAX_CHILDREN: 10,
  MAX_INFANTS: 5,
  MIN_ADULTS: 1,
  MIN_NIGHTS: 1,
  MAX_NIGHTS: 365,
  DEFAULT_CURRENCY: 'EUR',
  IMAGE_FORMATS: ['jpg', 'png', 'webp'],
  ITEMS_PER_PAGE: 20,
} as const;

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRO: '/registro',
  BUSCAR: '/buscar',
  DASHBOARD: '/dashboard',
  PERFIL: '/perfil',
  FAVORITOS: '/favoritos',
  CONFIGURACION: '/configuracion',
  MIS_RESERVAS: '/mis-reservas',
} as const;

/**
 * Mensajes de error estandarizados
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Intenta de nuevo.',
  NOT_FOUND: 'No encontramos lo que buscas.',
  UNAUTHORIZED: 'Necesitas iniciar sesión.',
  LOGIN_REQUIRED: 'Debes iniciar sesión para guardar favoritos',
  DEFAULT: 'Algo salió mal. Intenta más tarde.',
  SEARCH_ERROR: 'Error en búsqueda',
} as const;

/**
 * Mensajes de éxito estandarizados
 */
export const SUCCESS_MESSAGES = {
  FAVORITE_ADDED: 'Añadido a favoritos',
  FAVORITE_REMOVED: 'Eliminado de favoritos',
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  PROFILE_UPDATED: 'Perfil actualizado correctamente',
} as const;

/**
 * Etiquetas y textos de UI
 */
export const UI_LABELS = {
  ADULTS: 'Adultos',
  CHILDREN: 'Niños',
  INFANTS: 'Bebés',
  GUESTS_SINGLE: 'huésped',
  GUESTS_PLURAL: 'huéspedes',
  NIGHTS_SINGLE: 'noche',
  NIGHTS_PLURAL: 'noches',
  BEDROOMS_SHORT: 'hab',
} as const;

