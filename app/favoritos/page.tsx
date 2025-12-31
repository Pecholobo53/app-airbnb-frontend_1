// app/favoritos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { FavoritesService } from '@/lib/favorites/favorites-service';
import { FavoriteProperty } from '@/types/favorites';
import FavoritesList from '@/components/favorites/FavoritesList';
import { ROUTES } from '@/lib/constants';

/**
 * Página de Favoritos
 * 
 * Muestra todas las propiedades que el usuario ha guardado como favoritas.
 * Requiere autenticación.
 */
export default function FavoritesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirigir a login si no está autenticado
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Cargar favoritos si está autenticado
    if (isAuthenticated && user) {
      loadFavorites();
    }
  }, [isAuthenticated, user, authLoading, router]);

  const loadFavorites = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await FavoritesService.getFavoriteProperties();
      
      if (response.success && response.data) {
        setFavorites(response.data);
      } else {
        // Manejar errores específicos
        if (response.error?.code === 'UNAUTHORIZED') {
          setError('Tu sesión expiró. Por favor, inicia sesión de nuevo.');
          router.push(ROUTES.LOGIN);
        } else {
          setError(response.error?.message || 'Error al cargar favoritos');
        }
        setFavorites([]);
      }
    } catch (err) {
      console.error('Error cargando favoritos:', err);
      setError('Error al cargar favoritos. Por favor, intenta más tarde.');
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se redirige)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Favoritos
          </h1>
          <p className="text-gray-600">
            {favorites.length > 0 
              ? `${favorites.length} ${favorites.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}`
              : 'Tus propiedades favoritas aparecerán aquí'
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadFavorites}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Favorites List */}
        <FavoritesList favorites={favorites} isLoading={isLoading} />
      </div>
    </div>
  );
}

