// components/auth/UserAvatar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/auth';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  previewSrc?: string | null;
}

export default function UserAvatar({ 
  user, 
  size = 'md', 
  className = '',
  previewSrc = null
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg',
  };

  const getInitials = (name: string | undefined | null): string => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    const trimmed = name.trim();
    if (!trimmed) {
      return '??';
    }
    const parts = trimmed.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return trimmed.substring(0, 2).toUpperCase();
  };

  // Usar preview si existe, sino el avatar del usuario
  const avatarSrc = previewSrc || user?.avatar;
  const userName = user?.name || 'Usuario';
  
  // Resetear error cuando cambia el avatar
  useEffect(() => {
    if (avatarSrc) {
      setImageError(false);
      setAvatarVersion(prev => prev + 1);
    }
  }, [avatarSrc]);

  // Agregar timestamp para evitar caché (solo para URLs, no para Base64)
  const getAvatarSrc = () => {
    if (!avatarSrc) return null;
    
    // Si es Base64, devolverlo tal cual
    if (avatarSrc.startsWith('data:image')) {
      return avatarSrc;
    }
    
    // Si es URL, agregar timestamp para evitar caché
    const separator = avatarSrc.includes('?') ? '&' : '?';
    return `${avatarSrc}${separator}v=${avatarVersion}&t=${Date.now()}`;
  };

  const finalAvatarSrc = getAvatarSrc();

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {finalAvatarSrc && !imageError && (
        <AvatarImage 
          key={`avatar-${avatarVersion}-${user?.id}`}
          src={finalAvatarSrc} 
          alt={userName}
          className="object-cover"
          onError={(e) => {
            console.warn('⚠️ [USER AVATAR] Error cargando imagen. Usando fallback.');
            setImageError(true);
          }}
          onLoad={() => {
            setImageError(false);
          }}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-[#FF385C] to-[#E31C5F] text-white font-semibold">
        {getInitials(user?.name)}
      </AvatarFallback>
    </Avatar>
  );
}
