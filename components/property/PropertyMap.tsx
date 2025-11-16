// components/property/PropertyMap.tsx
'use client';

import { MapPin, ExternalLink } from 'lucide-react';
import { Location } from '@/types/search';

interface PropertyMapProps {
  location: Location;
}

/**
 * Mapa de Ubicación de la Propiedad
 * Muestra ubicación aproximada con Google Maps
 */
export default function PropertyMap({ location }: PropertyMapProps) {
  const { lat, lng } = location.coordinates;
  const address = location.address || `${location.city}, ${location.country}`;
  const fullAddress = `${location.city}, ${location.region}, ${location.country}`;
  
  // URL de Google Maps (modo lugar - abre en nueva pestaña)
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  
  // URL para iframe de Google Maps (embed básico - NO requiere API key)
  // Usa el formato de búsqueda que funciona sin API key
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${Math.floor(lat)}!5e0!3m2!1ses!2ses!4v1!5m2!1ses!2ses`;
  
  // Alternativa: OpenStreetMap (gratuito, sin API key)
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        ¿Dónde estarás?
      </h2>

      {/* Ubicación */}
      <div className="flex items-start gap-3 mb-4">
        <MapPin className="w-5 h-5 text-gray-700 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">{address}</p>
          <p className="text-sm text-gray-600">
            {location.city}, {location.region}, {location.country}
          </p>
        </div>
      </div>

      {/* Mapa con iframe */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 relative">
        {/* Google Maps Embed - Formato que funciona sin API key */}
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          title={`Mapa de ${fullAddress}`}
          className="w-full h-full"
        />
        
        {/* Overlay con link a Google Maps completo */}
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow text-sm font-medium text-gray-900 hover:text-[#FF385C]"
          >
            <MapPin className="w-4 h-4" />
            Abrir en Google Maps
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Nota:</strong> La ubicación exacta se compartirá después de confirmar la reserva.
          Esta es una ubicación aproximada del área.
        </p>
      </div>
    </div>
  );
}

