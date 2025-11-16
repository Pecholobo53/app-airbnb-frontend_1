// lib/search/mock-search-service.ts

import { 
  Property, 
  SearchParams, 
  SearchResults, 
  SearchResponse,
  LocationSuggestion,
  SearchQuery,
  SearchFilters,
  SortOption
} from '@/types/search';
import { MOCK_PROPERTIES } from './mock-properties-db';
import { searchLocations as searchLocationsDB } from './mock-locations-db';

/**
 * MOCK SEARCH SERVICE
 * 
 * Simula un servicio backend de búsqueda de propiedades.
 * Incluye filtrado, ordenamiento y paginación.
 */

const simulateNetworkDelay = (): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 300));

export class MockSearchService {
  
  /**
   * BUSCAR PROPIEDADES
   * Aplica query, filtros, ordenamiento y paginación
   */
  static async searchProperties(params: Partial<SearchParams>): Promise<SearchResponse<SearchResults>> {
    await simulateNetworkDelay();
    
    const {
      query = {},
      filters = {},
      sortBy = 'recommended',
      page = 1,
      perPage = 20
    } = params;

    console.log('🔍 [SEARCH] Buscando propiedades:', { query, filters, sortBy, page });
    console.log('📦 [SEARCH] Total propiedades disponibles:', MOCK_PROPERTIES.length);

    try {
      // 1. Filtrar por ubicación
      let results = this.filterByLocation(MOCK_PROPERTIES, query.location);
      console.log('📍 [SEARCH] Después de filtrar por ubicación:', results.length);

      // 2. Filtrar por fechas (mock - en realidad verificaríamos disponibilidad)
      // Si no hay resultados después de fechas, intentar sin filtro de fechas para mostrar opciones
      if (query.checkIn && query.checkOut) {
        const beforeDates = results.length;
        const dateFiltered = this.filterByDates(results, query.checkIn, query.checkOut);
        
        // Si no hay resultados con fechas pero sí había resultados antes, mantenerlos
        // (en producción esto mostraría un mensaje de que no hay disponibilidad exacta)
        if (dateFiltered.length === 0 && beforeDates > 0) {
          console.log('⚠️ [SEARCH] No hay propiedades disponibles para esas fechas, pero mostrando todas las de la ubicación');
          // No aplicar filtro de fechas - mostrar todas las propiedades de la ubicación
        } else {
          results = dateFiltered;
        }
      }

      // 3. Filtrar por huéspedes
      if (query.guests) {
        results = this.filterByGuests(results, query.guests.adults + query.guests.children);
      }

      // 4. Aplicar filtros avanzados
      results = this.applyFilters(results, filters);

      // 5. Ordenar resultados
      results = this.sortProperties(results, sortBy);

      // 6. Paginación
      const total = results.length;
      const totalPages = Math.ceil(total / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedResults = results.slice(startIndex, endIndex);

      const searchResults: SearchResults = {
        properties: paginatedResults,
        total,
        page,
        perPage,
        totalPages,
        hasMore: page < totalPages
      };

      console.log('✅ [SEARCH] Encontradas:', total, 'propiedades');
      
      return {
        success: true,
        data: searchResults
      };
    } catch (error) {
      console.error('❌ [SEARCH] Error:', error);
      return {
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: 'Error al buscar propiedades'
        }
      };
    }
  }

  /**
   * BUSCAR UBICACIONES (autocompletado)
   */
  static async searchLocations(query: string): Promise<SearchResponse<LocationSuggestion[]>> {
    await new Promise(resolve => setTimeout(resolve, 200)); // Delay más corto
    
    console.log('📍 [LOCATIONS] Buscando:', query);
    
    const suggestions = searchLocationsDB(query);
    
    return {
      success: true,
      data: suggestions
    };
  }

  /**
   * OBTENER PROPIEDAD POR ID
   */
  static async getPropertyById(id: string): Promise<SearchResponse<Property>> {
    await simulateNetworkDelay();
    
    const property = MOCK_PROPERTIES.find(p => p.id === id);
    
    if (!property) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Propiedad no encontrada'
        }
      };
    }

    return {
      success: true,
      data: property
    };
  }

  // ========== MÉTODOS PRIVADOS DE FILTRADO ==========

  private static filterByLocation(properties: Property[], location?: string): Property[] {
    if (!location) {
      console.log('⚠️ [FILTER] Sin ubicación, retornando todas las propiedades');
      return properties;
    }

    // Extraer solo la ciudad si viene en formato "Ciudad, País"
    const locationParts = location.toLowerCase().trim().split(',').map(p => p.trim());
    const citySearch = locationParts[0]; // Primera parte es la ciudad
    const countrySearch = locationParts.length > 1 ? locationParts[1] : null;
    
    console.log('🔎 [FILTER] Buscando ubicación:', { original: location, city: citySearch, country: countrySearch });
    
    // Búsqueda más flexible: ciudad, país, región, o coincidencias parciales
    const filtered = properties.filter(p => {
      const cityMatch = p.location.city.toLowerCase().includes(citySearch);
      const countryMatch = countrySearch 
        ? p.location.country.toLowerCase().includes(countrySearch)
        : p.location.country.toLowerCase().includes(citySearch);
      const regionMatch = p.location.region?.toLowerCase().includes(citySearch);
      const addressMatch = p.location.address?.toLowerCase().includes(citySearch);
      
      // Si hay país especificado, debe coincidir ciudad Y país
      if (countrySearch) {
        return cityMatch && p.location.country.toLowerCase().includes(countrySearch);
      }
      
      return cityMatch || countryMatch || regionMatch || addressMatch;
    });
    
    console.log('✅ [FILTER] Propiedades filtradas por ubicación:', filtered.length, 'de', properties.length);
    if (filtered.length > 0) {
      console.log('📍 [FILTER] Ciudades encontradas:', [...new Set(filtered.map(p => p.location.city))]);
    } else {
      console.log('⚠️ [FILTER] No se encontraron propiedades. Ciudades disponibles:', [...new Set(properties.map(p => p.location.city))]);
    }
    return filtered;
  }

  private static filterByDates(properties: Property[], checkIn: Date, checkOut: Date): Property[] {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    console.log('📅 [FILTER] Filtrando por fechas:', { checkIn, checkOut, nights });
    
    const beforeDates = properties.length;
    const filtered = properties.filter(p => {
      const meetsMinNights = nights >= p.availability.minNights;
      const meetsMaxNights = nights <= p.availability.maxNights;
      return meetsMinNights && meetsMaxNights;
    });
    
    console.log(`📅 [FILTER] Fechas (${nights} noches): ${beforeDates} → ${filtered.length}`);
    if (filtered.length === 0 && beforeDates > 0) {
      console.log('⚠️ [FILTER] No hay propiedades que cumplan el mínimo de noches:', nights);
      console.log('📋 [FILTER] Mínimos requeridos:', [...new Set(properties.map(p => p.availability.minNights))]);
    }
    
    return filtered;
  }

  private static filterByGuests(properties: Property[], totalGuests: number): Property[] {
    return properties.filter(p => p.capacity.guests >= totalGuests);
  }

  private static applyFilters(properties: Property[], filters: SearchFilters): Property[] {
    let results = [...properties];
    const initialCount = results.length;

    // Filtro de precio
    if (filters.priceRange) {
      const beforePrice = results.length;
      results = results.filter(p => 
        p.pricing.basePrice >= filters.priceRange!.min &&
        p.pricing.basePrice <= filters.priceRange!.max
      );
      console.log(`💰 [FILTER] Precio ${filters.priceRange.min}-${filters.priceRange.max}: ${beforePrice} → ${results.length}`);
    }

    // Filtro por roomType (para filtros rápidos: house, apartment, villa, cabin, loft)
    if (filters.roomType) {
      const beforeRoomType = results.length;
      const roomTypes = Array.isArray(filters.roomType) ? filters.roomType : [filters.roomType];
      results = results.filter(p => roomTypes.includes(p.roomType));
      console.log(`🏠 [FILTER] Filtrando por roomType: ${roomTypes.join(', ')} → ${beforeRoomType} → ${results.length} resultados`);
      if (results.length === 0 && beforeRoomType > 0) {
        console.log('⚠️ [FILTER] No se encontraron propiedades con roomType:', roomTypes);
        console.log('📋 [FILTER] RoomTypes disponibles:', [...new Set(properties.map(p => p.roomType))]);
      }
    }

    // Filtro de tipo de propiedad (entire_place, private_room, shared_room)
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      results = results.filter(p => 
        filters.propertyTypes!.includes(p.propertyType)
      );
    }

    // Filtro de amenidades
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter(p => 
        filters.amenities!.every(amenity => p.amenities.includes(amenity))
      );
      console.log(`✨ [FILTER] Filtrando por amenidades: ${filters.amenities.join(', ')} → ${results.length} resultados`);
    }

    // Filtro de calificación
    if (filters.minRating) {
      results = results.filter(p => p.rating.overall >= filters.minRating!);
    }

    // Filtro de habitaciones
    if (filters.bedrooms) {
      results = results.filter(p => p.capacity.bedrooms >= filters.bedrooms!);
    }

    // Filtro de instant book
    if (filters.instantBook) {
      results = results.filter(p => p.availability.instantBook === true);
    }

    return results;
  }

  private static sortProperties(properties: Property[], sortBy: SortOption): Property[] {
    const sorted = [...properties];

    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
      
      case 'price_desc':
        return sorted.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);
      
      case 'rating_desc':
        return sorted.sort((a, b) => b.rating.overall - a.rating.overall);
      
      case 'recommended':
      default:
        // Ordenar por: featured > rating > reviewCount
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.rating.overall !== b.rating.overall) {
            return b.rating.overall - a.rating.overall;
          }
          return b.rating.reviewCount - a.rating.reviewCount;
        });
    }
  }

  /**
   * OBTENER PROPIEDADES DESTACADAS
   */
  static async getFeaturedProperties(limit: number = 6): Promise<SearchResponse<Property[]>> {
    await simulateNetworkDelay();
    
    const featured = MOCK_PROPERTIES
      .filter(p => p.featured)
      .slice(0, limit);

    return {
      success: true,
      data: featured
    };
  }

  /**
   * OBTENER REVIEWS DE UNA PROPIEDAD
   */
  static async getPropertyReviews(propertyId: string): Promise<SearchResponse<import('@/types/search').Review[]>> {
    await simulateNetworkDelay();
    
    const { getReviewsByPropertyId } = await import('./mock-reviews-db');
    const reviews = getReviewsByPropertyId(propertyId);

    return {
      success: true,
      data: reviews
    };
  }

  /**
   * OBTENER ESTADÍSTICAS DE REVIEWS
   */
  static async getReviewStats(propertyId: string): Promise<SearchResponse<any>> {
    await simulateNetworkDelay();
    
    const { getReviewStats } = await import('./mock-reviews-db');
    const stats = getReviewStats(propertyId);

    if (!stats) {
      return {
        success: false,
        error: {
          code: 'NO_REVIEWS',
          message: 'No hay reviews para esta propiedad'
        }
      };
    }

    return {
      success: true,
      data: stats
    };
  }
}

// Export default para uso simple
export default MockSearchService;

