// app/favoritos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { FavoritesService } from '@/lib/favorites/favorites-service';
import { FavoriteProperty } from '@/types/favorites';
import FavoritesList from '@/components/favorites/FavoritesList';
import { ROUTES } from '@/lib/constants';
import { Heart } from 'lucide-react';

const ACCENT = '#ff385c';

export default function FavoritesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    if (isAuthenticated && user) {
      loadFavorites();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (response.error?.code === 'UNAUTHORIZED') {
          router.push(ROUTES.LOGIN);
        } else {
          setError(response.error?.message || 'Error al cargar favoritos');
        }
        setFavorites([]);
      }
    } catch {
      setError('Error al cargar favoritos. Por favor, intenta más tarde.');
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-2"
          style={{ borderColor: ACCENT }}
        />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="p-5 md:p-8 min-h-full">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4" style={{ color: ACCENT }} />
          <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
            Guardados
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#f8fafc] tracking-tight">Mis Favoritos</h1>
        <p className="text-[#64748b] mt-1 text-sm">
          {favorites.length > 0
            ? `${favorites.length} ${favorites.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}`
            : 'Tus propiedades favoritas aparecerán aquí'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={loadFavorites}
            className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Favorites List */}
      <FavoritesList favorites={favorites} isLoading={isLoading} />

    </div>
  );
}
