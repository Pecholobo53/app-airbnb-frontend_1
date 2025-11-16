// types/favorites.ts

import { Property } from './search';

/**
 * TIPOS DE FAVORITOS
 * 
 * Este archivo contiene todas las interfaces TypeScript
 * para el módulo de favoritos de propiedades.
 */

/**
 * Favorito - Relación entre usuario y propiedad
 */
export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  addedAt: Date;
}

/**
 * Propiedad Favorita - Propiedad con información adicional del favorito
 */
export interface FavoriteProperty extends Property {
  favoritedAt: Date;
  favoriteId: string;
}

