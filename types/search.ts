// types/search.ts

/**
 * TIPOS DE BÚSQUEDA Y PROPIEDADES
 * 
 * Este archivo contiene todas las interfaces TypeScript
 * para el módulo de búsqueda de alojamientos.
 */

/**
 * Host (Anfitrión) de una propiedad
 */
export interface Host {
  id: string;
  name: string;
  avatar: string;
  isSuperhost: boolean;
  joinedDate: Date;
  responseTime?: string;
  responseRate?: number;
}

/**
 * Ubicación de una propiedad
 */
export interface Location {
  city: string;
  country: string;
  region: string;
  address?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

/**
 * Precios de una propiedad
 */
export interface Pricing {
  basePrice: number;
  currency: 'EUR' | 'USD' | 'GBP';
  cleaningFee?: number;
  serviceFee?: number;
  discounts?: {
    weekly?: number;
    monthly?: number;
  };
}

/**
 * Capacidad de una propiedad
 */
export interface Capacity {
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
}

/**
 * Calificación y reviews de una propiedad
 */
export interface Rating {
  overall: number;
  reviewCount: number;
  breakdown?: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
  };
}

/**
 * Disponibilidad de una propiedad
 */
export interface Availability {
  minNights: number;
  maxNights: number;
  instantBook: boolean;
  checkInTime?: string;
  checkOutTime?: string;
}

/**
 * Tipo de propiedad
 */
export type PropertyType = 'entire_place' | 'private_room' | 'shared_room';

/**
 * Tipo de alojamiento
 */
export type RoomType = 'apartment' | 'house' | 'villa' | 'loft' | 'cabin' | 'hotel' | 'cottage' | 'castle';

/**
 * Amenidades disponibles
 */
export type Amenity = 
  | 'wifi'
  | 'kitchen'
  | 'pool'
  | 'ac'
  | 'parking'
  | 'gym'
  | 'beach_access'
  | 'mountain_view'
  | 'pet_friendly'
  | 'washer'
  | 'dryer'
  | 'balcony'
  | 'workspace'
  | 'fireplace'
  | 'tv'
  | 'heating'
  | 'hot_tub'
  | 'bbq'
  | 'garden'
  | 'terrace';

/**
 * Propiedad completa (modelo principal)
 */
export interface Property {
  id: string;
  title: string;
  description: string;
  host: Host;
  location: Location;
  images: string[];
  propertyType: PropertyType;
  roomType: RoomType;
  pricing: Pricing;
  capacity: Capacity;
  amenities: Amenity[];
  rating: Rating;
  availability: Availability;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Datos de huéspedes para búsqueda
 */
export interface GuestsData {
  adults: number;
  children: number;
  infants: number;
}

/**
 * Query de búsqueda (parámetros principales)
 */
export interface SearchQuery {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: GuestsData;
}

/**
 * Filtros de búsqueda avanzados
 */
export interface SearchFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  propertyTypes?: PropertyType[];
  amenities?: Amenity[];
  minRating?: number;
  bedrooms?: number;
  instantBook?: boolean;
}

/**
 * Opciones de ordenamiento
 */
export type SortOption = 'recommended' | 'price_asc' | 'price_desc' | 'rating_desc';

/**
 * Parámetros completos de búsqueda
 */
export interface SearchParams {
  query: SearchQuery;
  filters: SearchFilters;
  sortBy: SortOption;
  page: number;
  perPage: number;
}

/**
 * Resultados de búsqueda
 */
export interface SearchResults {
  properties: Property[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Sugerencia de ubicación (para autocompletado)
 */
export interface LocationSuggestion {
  id: string;
  city: string;
  country: string;
  region?: string;
  type: 'city' | 'region' | 'country';
  matchText: string; // Para resaltar en UI
}

/**
 * Estado de búsqueda (para context)
 */
export interface SearchState {
  query: SearchQuery;
  filters: SearchFilters;
  sortBy: SortOption;
  results: SearchResults | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Respuesta de servicios de búsqueda
 */
export interface SearchResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

