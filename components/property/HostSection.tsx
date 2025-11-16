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
  const joinedYear = format(host.joinedDate, 'yyyy');

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        Tu anfitrión: {host.name}
      </h2>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar y nombre */}
        <div className="flex-shrink-0">
          <div className="relative">
            <Image
              src={host.avatar}
              alt={host.name}
              width={96}
              height={96}
              className="rounded-full"
            />
            {host.isSuperhost && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                <Shield className="w-6 h-6 text-[#FF385C]" />
              </div>
            )}
          </div>
        </div>

        {/* Información */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{host.name}</h3>
            {host.isSuperhost && (
              <span className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-full">
                ⭐ Superanfitrión
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-2 text-sm text-gray-700">
            {host.responseRate && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>Tasa de respuesta: {host.responseRate}%</span>
              </div>
            )}
            
            {host.responseTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Responde en: {host.responseTime}</span>
              </div>
            )}

            <div className="pt-2 text-gray-600">
              <p>Se unió en {joinedYear}</p>
            </div>
          </div>

          {/* Descripción Superhost */}
          {host.isSuperhost && (
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

