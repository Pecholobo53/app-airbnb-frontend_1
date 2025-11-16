// components/favorites/FavoriteButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockFavoritesService } from '@/lib/favorites/mock-favorites-service';
import { toast } from 'sonner';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Botón de Favorito Reutilizable
 * 
 * Maneja el estado de favorito de una propiedad usando el servicio MOCK.
 * Muestra animación y feedback visual al usuario.
 */
export default function FavoriteButton({ 
  propertyId, 
  className = '',
  size = 'md'
}: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Verificar estado inicial
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsChecking(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const response = await MockFavoritesService.isFavorited(user.id, propertyId);
        if (response.success && response.data !== undefined) {
          setIsFavorite(response.data);
        }
      } catch (error) {
        console.error('Error verificando favorito:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFavorite();
  }, [isAuthenticated, user, propertyId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      toast.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const wasFavorite = isFavorite;

    try {
      if (wasFavorite) {
        // Eliminar favorito
        const response = await MockFavoritesService.removeFavorite(user.id, propertyId);
        if (response.success) {
          setIsFavorite(false);
          toast.success(SUCCESS_MESSAGES.FAVORITE_REMOVED);
        } else {
          toast.error(response.error?.message || 'Error al eliminar favorito');
          setIsFavorite(wasFavorite); // Revertir
        }
      } else {
        // Añadir favorito
        const response = await MockFavoritesService.addFavorite(user.id, propertyId);
        if (response.success) {
          setIsFavorite(true);
          toast.success(SUCCESS_MESSAGES.FAVORITE_ADDED);
        } else {
          toast.error(response.error?.message || 'Error al añadir favorito');
          setIsFavorite(wasFavorite); // Revertir
        }
      }
    } catch (error) {
      console.error('Error gestionando favorito:', error);
      toast.error('Error al gestionar favorito');
      setIsFavorite(wasFavorite); // Revertir
    } finally {
      setIsLoading(false);
    }
  };

  // Tamaños de icono
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Tamaños de padding
  const paddingSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  if (isChecking) {
    return (
      <button
        className={`${paddingSizes[size]} rounded-full bg-white/90 hover:bg-white transition-all ${className}`}
        disabled
      >
        <Heart className={`${iconSizes[size]} text-gray-400 animate-pulse`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${paddingSizes[size]} 
        rounded-full 
        bg-white/90 
        hover:bg-white 
        hover:scale-110 
        transition-all 
        z-10
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
    >
      <Heart
        className={`
          ${iconSizes[size]} 
          transition-all
          ${isFavorite 
            ? 'fill-[#FF385C] text-[#FF385C] scale-110' 
            : 'text-gray-700'
          }
          ${isLoading ? 'animate-pulse' : ''}
        `}
      />
    </button>
  );
}

