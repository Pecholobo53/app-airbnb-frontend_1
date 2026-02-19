// components/property/HostSection.tsx
'use client';

import Image from 'next/image';
import { Shield, MessageCircle, Clock } from 'lucide-react';
import { Host } from '@/types/search';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HostSectionProps {
  host: Host;
}

/**
 * Sección del Anfitrión
 * Información del host con stats
 */
export default function HostSection({ host }: HostSectionProps) {
  // Validaciones robustas con valores por defecto
  const hostName = host?.name || 'Anfitrión';
  // Usar placeholder-property.jpg como fallback si no hay avatar
  const hostAvatar = host?.avatar || '/placeholder-property.jpg';
  const isSuperhost = host?.isSuperhost ?? false;
  const responseRate = host?.responseRate;
  const responseTime = host?.responseTime;
  
  // Manejar joinedDate de forma segura
  let joinedYear = 'N/A';
  try {
    if (host?.joinedDate) {
      const date = host.joinedDate instanceof Date 
        ? host.joinedDate 
        : new Date(host.joinedDate);
      if (!isNaN(date.getTime())) {
        joinedYear = format(date, 'yyyy');
      }
    }
  } catch {
  }

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Tu anfitrión: {hostName}
      </h2>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar y nombre */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image
              src={hostAvatar}
              alt={hostName}
              width={96}
              height={96}
              className="rounded-full"
              onError={(e) => {
                // Fallback a imagen placeholder si falla
                e.currentTarget.src = '/placeholder-property.jpg';
              }}
            />
            {isSuperhost && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                <Shield className="w-6 h-6 text-acento-200" />
              </div>
            )}
          </div>
        </div>

        {/* Información */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{hostName}</h3>
            {isSuperhost && (
              <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-full">
                ⭐ Superanfitrión
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm text-gray-700">
            {responseRate !== undefined && responseRate !== null && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Tasa de respuesta: {responseRate}%</span>
              </div>
            )}
            
            {responseTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Responde en: {responseTime}</span>
              </div>
            )}

            {joinedYear !== 'N/A' && (
              <div className="pt-2 text-gray-600">
                <p>Se unió en {joinedYear}</p>
              </div>
            )}
          </div>

          {/* Descripción Superhost */}
          {isSuperhost && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Los Superanfitriones son anfitriones con experiencia y valoraciones altas
                que se comprometen a proporcionar estancias excepcionales a los huéspedes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

