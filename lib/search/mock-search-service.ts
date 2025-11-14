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

    try {
      // 1. Filtrar por ubicación
      let results = this.filterByLocation(MOCK_PROPERTIES, query.location);

      // 2. Filtrar por fechas (mock - en realidad verificaríamos disponibilidad)
      if (query.checkIn && query.checkOut) {
        results = this.filterByDates(results, query.checkIn, query.checkOut);
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
    if (!location) return properties;

    const searchTerm = location.toLowerCase().trim();
    
    return properties.filter(p => 
      p.location.city.toLowerCase().includes(searchTerm) ||
      p.location.country.toLowerCase().includes(searchTerm) ||
      p.location.region.toLowerCase().includes(searchTerm)
    );
  }

  private static filterByDates(properties: Property[], checkIn: Date, checkOut: Date): Property[] {
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return properties.filter(p => 
      nights >= p.availability.minNights &&
      nights <= p.availability.maxNights
    );
  }

  private static filterByGuests(properties: Property[], totalGuests: number): Property[] {
    return properties.filter(p => p.capacity.guests >= totalGuests);
  }

  private static applyFilters(properties: Property[], filters: SearchFilters): Property[] {
    let results = [...properties];

    // Filtro de precio
    if (filters.priceRange) {
      results = results.filter(p => 
        p.pricing.basePrice >= filters.priceRange!.min &&
        p.pricing.basePrice <= filters.priceRange!.max
      );
    }

    // Filtro de tipo de propiedad
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
}

// Export default para uso simple
export default MockSearchService;

