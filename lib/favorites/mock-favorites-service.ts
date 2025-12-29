// lib/favorites/mock-favorites-service.ts

import { Favorite, FavoriteProperty } from '@/types/favorites';
import { Property } from '@/types/search';
import {
  MOCK_FAVORITES,
  getFavoritesByUserId,
  isPropertyFavorited,
  getFavorite,
  addFavorite as addFavoriteDB,
  removeFavorite as removeFavoriteDB,
} from './mock-favorites-db';
// import { MOCK_PROPERTIES } from '@/lib/search/mock-properties-db'; // ELIMINADO - Usar PropertyService en su lugar
import { PropertyService } from '@/lib/properties/property-service';
import { findUserById } from '@/lib/auth/mock-users-db-stub';

/**
 * MOCK FAVORITES SERVICE
 * 
 * Contexto:
 * Simula un servicio backend completo para gestionar favoritos de propiedades.
 * En producción, esto haría llamadas HTTP reales a una API REST.
 * Todas las operaciones incluyen delay de red simulado para realismo.
 * 
 * Funcionalidades:
 * 
 * - getFavorites(userId): Obtener todos los favoritos del usuario
 *   - Retorna array de Favorite con IDs de propiedades
 *   - Ordenado por fecha de añadido (más recientes primero)
 * 
 * - getFavoriteProperties(userId): Obtener propiedades favoritas completas
 *   - Retorna array de FavoriteProperty (Property + info de favorito)
 *   - Incluye datos completos de cada propiedad
 *   - Ordenado por fecha de añadido
 * 
 * - addFavorite(userId, propertyId): Añadir propiedad a favoritos
 *   - Verifica que el usuario existe
 *   - Verifica que la propiedad existe
 *   - Verifica que no está ya en favoritos
 *   - Crea el favorito con fecha actual
 * 
 * - removeFavorite(userId, propertyId): Eliminar favorito
 *   - Verifica que el favorito existe
 *   - Elimina de la base de datos
 * 
 * - isFavorited(userId, propertyId): Verificar si está en favoritos
 *   - Retorna true/false
 *   - Útil para mostrar estado en UI
 * 
 * Respuestas:
 * - success: true/false
 * - data: Datos solicitados (favoritos, propiedades, etc.)
 * - error: Código y mensaje de error si falla
 * 
 * Delay de Red:
 * - Simula delay aleatorio entre 200-400ms para realismo
 * 
 * Dependencias:
 * - mock-favorites-db: Base de datos de favoritos
 * - mock-properties-db: Base de datos de propiedades
 * - mock-users-db: Base de datos de usuarios
 */

const simulateNetworkDelay = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 200));

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export class MockFavoritesService {
  
  /**
   * OBTENER FAVORITOS DE UN USUARIO
   */
  static async getFavorites(userId: string): Promise<ServiceResponse<Favorite[]>> {
    await simulateNetworkDelay();
    console.log('❤️ [FAVORITES] Obteniendo favoritos para usuario:', userId);

    try {
      // Verificar que el usuario existe
      const user = findUserById(userId);
      if (!user) {
        console.log('❌ [FAVORITES] Usuario no encontrado:', userId);
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado',
          },
        };
      }

      const favorites = getFavoritesByUserId(userId);
      console.log(`✅ [FAVORITES] Encontrados ${favorites.length} favoritos`);

      return {
        success: true,
        data: favorites.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()),
      };
    } catch (error) {
      console.error('❌ [FAVORITES] Error:', error);
      return {
        success: false,
        error: {
          code: 'GET_FAVORITES_ERROR',
          message: 'Error al obtener favoritos',
        },
      };
    }
  }

  /**
   * OBTENER PROPIEDADES FAVORITAS COMPLETAS
   */
  static async getFavoriteProperties(userId: string): Promise<ServiceResponse<FavoriteProperty[]>> {
    await simulateNetworkDelay();
    console.log('❤️ [FAVORITES] Obteniendo propiedades favoritas para usuario:', userId);

    try {
      // Verificar que el usuario existe
      const user = findUserById(userId);
      if (!user) {
        console.log('❌ [FAVORITES] Usuario no encontrado:', userId);
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado',
          },
        };
      }

      const favorites = getFavoritesByUserId(userId);
      const favoriteProperties: FavoriteProperty[] = [];

      for (const favorite of favorites) {
        // const property = MOCK_PROPERTIES.find(p => p.id === favorite.propertyId); // ELIMINADO - Usar PropertyService.getPropertyById() en su lugar
        const propertyResponse = await PropertyService.getPropertyById(favorite.propertyId);
        const property = propertyResponse.success && propertyResponse.data ? propertyResponse.data : null;
        if (property) {
          favoriteProperties.push({
            ...property,
            favoritedAt: favorite.addedAt,
            favoriteId: favorite.id,
          });
        }
      }

      // Ordenar por fecha de añadido (más recientes primero)
      favoriteProperties.sort((a, b) => b.favoritedAt.getTime() - a.favoritedAt.getTime());

      console.log(`✅ [FAVORITES] Encontradas ${favoriteProperties.length} propiedades favoritas`);

      return {
        success: true,
        data: favoriteProperties,
      };
    } catch (error) {
      console.error('❌ [FAVORITES] Error:', error);
      return {
        success: false,
        error: {
          code: 'GET_FAVORITE_PROPERTIES_ERROR',
          message: 'Error al obtener propiedades favoritas',
        },
      };
    }
  }

  /**
   * AÑADIR PROPIEDAD A FAVORITOS
   */
  static async addFavorite(userId: string, propertyId: string): Promise<ServiceResponse<Favorite>> {
    await simulateNetworkDelay();
    console.log('❤️ [FAVORITES] Añadiendo favorito:', { userId, propertyId });

    try {
      // Verificar que el usuario existe
      const user = findUserById(userId);
      if (!user) {
        console.log('❌ [FAVORITES] Usuario no encontrado:', userId);
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado',
          },
        };
      }

      // Verificar que la propiedad existe
      // const property = MOCK_PROPERTIES.find(p => p.id === propertyId); // ELIMINADO - Usar PropertyService.getPropertyById() en su lugar
      const propertyResponse = await PropertyService.getPropertyById(propertyId);
      const property = propertyResponse.success && propertyResponse.data ? propertyResponse.data : null;
      if (!property) {
        console.log('❌ [FAVORITES] Propiedad no encontrada:', propertyId);
        return {
          success: false,
          error: {
            code: 'PROPERTY_NOT_FOUND',
            message: 'Propiedad no encontrada',
          },
        };
      }

      // Verificar que no está ya en favoritos
      if (isPropertyFavorited(userId, propertyId)) {
        console.log('⚠️ [FAVORITES] Ya está en favoritos:', { userId, propertyId });
        return {
          success: false,
          error: {
            code: 'ALREADY_FAVORITED',
            message: 'La propiedad ya está en favoritos',
          },
        };
      }

      // Añadir favorito
      const favorite = addFavoriteDB(userId, propertyId);
      console.log('✅ [FAVORITES] Favorito añadido:', favorite.id);

      return {
        success: true,
        data: favorite,
      };
    } catch (error: any) {
      console.error('❌ [FAVORITES] Error:', error);
      return {
        success: false,
        error: {
          code: 'ADD_FAVORITE_ERROR',
          message: error.message || 'Error al añadir favorito',
        },
      };
    }
  }

  /**
   * ELIMINAR FAVORITO
   */
  static async removeFavorite(userId: string, propertyId: string): Promise<ServiceResponse<boolean>> {
    await simulateNetworkDelay();
    console.log('❤️ [FAVORITES] Eliminando favorito:', { userId, propertyId });

    try {
      // Verificar que el usuario existe
      const user = findUserById(userId);
      if (!user) {
        console.log('❌ [FAVORITES] Usuario no encontrado:', userId);
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado',
          },
        };
      }

      // Verificar que el favorito existe
      const favorite = getFavorite(userId, propertyId);
      if (!favorite) {
        console.log('⚠️ [FAVORITES] Favorito no encontrado:', { userId, propertyId });
        return {
          success: false,
          error: {
            code: 'FAVORITE_NOT_FOUND',
            message: 'La propiedad no está en favoritos',
          },
        };
      }

      // Eliminar favorito
      const removed = removeFavoriteDB(userId, propertyId);
      if (removed) {
        console.log('✅ [FAVORITES] Favorito eliminado:', favorite.id);
        return {
          success: true,
          data: true,
        };
      } else {
        return {
          success: false,
          error: {
            code: 'REMOVE_FAVORITE_ERROR',
            message: 'Error al eliminar favorito',
          },
        };
      }
    } catch (error) {
      console.error('❌ [FAVORITES] Error:', error);
      return {
        success: false,
        error: {
          code: 'REMOVE_FAVORITE_ERROR',
          message: 'Error al eliminar favorito',
        },
      };
    }
  }

  /**
   * VERIFICAR SI UNA PROPIEDAD ESTÁ EN FAVORITOS
   */
  static async isFavorited(userId: string, propertyId: string): Promise<ServiceResponse<boolean>> {
    await simulateNetworkDelay();
    
    try {
      const favorited = isPropertyFavorited(userId, propertyId);
      return {
        success: true,
        data: favorited,
      };
    } catch (error) {
      console.error('❌ [FAVORITES] Error:', error);
      return {
        success: false,
        error: {
          code: 'CHECK_FAVORITE_ERROR',
          message: 'Error al verificar favorito',
        },
      };
    }
  }
}

