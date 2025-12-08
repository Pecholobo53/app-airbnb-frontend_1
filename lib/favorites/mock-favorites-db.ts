// lib/favorites/mock-favorites-db.ts

import { Favorite } from '@/types/favorites';
import { MOCK_USERS } from '@/lib/auth/mock-users-db-stub';

/**
 * BASE DE DATOS MOCK DE FAVORITOS
 * 
 * Contexto:
 * Simula una base de datos en memoria con favoritos de propiedades.
 * En producción, esto sería una base de datos real con tablas relacionadas
 * para favorites, propiedades, usuarios, etc.
 * 
 * Contenido:
 * - Favoritos vinculados con usuarios existentes (MOCK_USERS)
 * - Favoritos vinculados con propiedades existentes (MOCK_PROPERTIES)
 * - Datos realistas con fechas de cuando se añadieron
 * 
 * Usuario Demo (demo@airbnb.com - user-001):
 * - Tiene 5 propiedades favoritas
 * - Variedad de tipos: villas, apartamentos, casas
 * 
 * Usuario María (maria@gmail.com - user-002):
 * - Tiene 4 propiedades favoritas
 * - Enfocadas en apartamentos y casas
 * 
 * Usuario Ana (ana@facebook.com - user-004):
 * - Tiene 2 propiedades favoritas
 * - Preferencia por villas
 * 
 * Estructura de Favorite:
 * - id: Identificador único (fav-001, fav-002, etc.)
 * - userId: ID del usuario (vinculado a MOCK_USERS)
 * - propertyId: ID de la propiedad (vinculado a MOCK_PROPERTIES)
 * - addedAt: Fecha en que se añadió a favoritos
 * 
 * Utilidades:
 * - getFavoritesByUserId(userId): Obtener todos los favoritos de un usuario
 * - isPropertyFavorited(userId, propertyId): Verificar si una propiedad está en favoritos
 * - addFavorite(userId, propertyId): Añadir favorito (para testing)
 * - removeFavorite(userId, propertyId): Eliminar favorito (para testing)
 * 
 * Notas:
 * - Los favoritos se vinculan con propiedades reales del mock-properties-db
 * - Las fechas están distribuidas en el pasado reciente
 * - En producción, esto sería una tabla en base de datos con índices en userId y propertyId
 */

/**
 * FAVORITOS MOCK
 */
export const MOCK_FAVORITES: Favorite[] = [
  // Favoritos del usuario demo (user-001)
  {
    id: 'fav-001',
    userId: 'user-001',
    propertyId: 'prop-001',
    addedAt: new Date('2024-10-15T10:30:00'),
  },
  {
    id: 'fav-002',
    userId: 'user-001',
    propertyId: 'prop-003',
    addedAt: new Date('2024-10-20T14:20:00'),
  },
  {
    id: 'fav-003',
    userId: 'user-001',
    propertyId: 'prop-007',
    addedAt: new Date('2024-11-01T09:15:00'),
  },
  {
    id: 'fav-004',
    userId: 'user-001',
    propertyId: 'prop-012',
    addedAt: new Date('2024-11-05T16:45:00'),
  },
  {
    id: 'fav-005',
    userId: 'user-001',
    propertyId: 'prop-015',
    addedAt: new Date('2024-11-10T11:30:00'),
  },
  
  // Favoritos de María (user-002)
  {
    id: 'fav-006',
    userId: 'user-002',
    propertyId: 'prop-002',
    addedAt: new Date('2024-09-20T12:00:00'),
  },
  {
    id: 'fav-007',
    userId: 'user-002',
    propertyId: 'prop-004',
    addedAt: new Date('2024-09-25T15:30:00'),
  },
  {
    id: 'fav-008',
    userId: 'user-002',
    propertyId: 'prop-005',
    addedAt: new Date('2024-10-01T10:00:00'),
  },
  {
    id: 'fav-009',
    userId: 'user-002',
    propertyId: 'prop-008',
    addedAt: new Date('2024-10-10T13:20:00'),
  },
  
  // Favoritos de Ana (user-004)
  {
    id: 'fav-010',
    userId: 'user-004',
    propertyId: 'prop-001',
    addedAt: new Date('2024-10-18T14:00:00'),
  },
  {
    id: 'fav-011',
    userId: 'user-004',
    propertyId: 'prop-006',
    addedAt: new Date('2024-10-22T09:30:00'),
  },
];

/**
 * Utilidades
 */

/**
 * Obtener todos los favoritos de un usuario
 */
export function getFavoritesByUserId(userId: string): Favorite[] {
  return MOCK_FAVORITES.filter(fav => fav.userId === userId);
}

/**
 * Verificar si una propiedad está en favoritos de un usuario
 */
export function isPropertyFavorited(userId: string, propertyId: string): boolean {
  return MOCK_FAVORITES.some(
    fav => fav.userId === userId && fav.propertyId === propertyId
  );
}

/**
 * Obtener el favorito específico de un usuario y propiedad
 */
export function getFavorite(userId: string, propertyId: string): Favorite | undefined {
  return MOCK_FAVORITES.find(
    fav => fav.userId === userId && fav.propertyId === propertyId
  );
}

/**
 * Añadir favorito (para testing o uso interno)
 */
export function addFavorite(userId: string, propertyId: string): Favorite {
  // Verificar que el usuario existe
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) {
    throw new Error(`Usuario con ID ${userId} no encontrado`);
  }
  
  // Verificar que no existe ya
  if (isPropertyFavorited(userId, propertyId)) {
    throw new Error('La propiedad ya está en favoritos');
  }
  
  const favorite: Favorite = {
    id: `fav-${String(MOCK_FAVORITES.length + 1).padStart(3, '0')}`,
    userId,
    propertyId,
    addedAt: new Date(),
  };
  
  MOCK_FAVORITES.push(favorite);
  return favorite;
}

/**
 * Eliminar favorito (para testing o uso interno)
 */
export function removeFavorite(userId: string, propertyId: string): boolean {
  const index = MOCK_FAVORITES.findIndex(
    fav => fav.userId === userId && fav.propertyId === propertyId
  );
  
  if (index === -1) {
    return false;
  }
  
  MOCK_FAVORITES.splice(index, 1);
  return true;
}

if (typeof window !== 'undefined') {
  console.log('🗄️ MOCK Favorites Database inicializada');
  console.log(`📊 Favoritos registrados: ${MOCK_FAVORITES.length}`);
  console.log(`👥 Usuarios con favoritos: ${new Set(MOCK_FAVORITES.map(f => f.userId)).size}`);
}

