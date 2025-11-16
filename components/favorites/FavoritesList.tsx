// components/favorites/FavoritesList.tsx
'use client';

import { FavoriteProperty } from '@/types/favorites';
import PropertyCard from '@/components/search/PropertyCard';

interface FavoritesListProps {
  favorites: FavoriteProperty[];
  isLoading?: boolean;
}

/**
 * Lista de Propiedades Favoritas
 * 
 * Muestra un grid de propiedades favoritas usando PropertyCard.
 * Maneja estados de loading y vacío.
 */
export default function FavoritesList({ favorites, isLoading }: FavoritesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes favoritos aún
          </h3>
          <p className="text-gray-600 mb-6">
            Cuando encuentres propiedades que te gusten, guárdalas aquí para consultarlas después.
          </p>
          <a
            href="/buscar"
            className="inline-block px-6 py-3 bg-[#FF385C] text-white font-semibold rounded-lg hover:bg-[#E31C5F] transition-colors"
          >
            Explorar propiedades
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
