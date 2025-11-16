// components/property/ReviewsSection.tsx
'use client';

import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  overallRating: number;
  totalReviews: number;
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
 * Sección Header de Reviews
 * Muestra calificación general y breakdown por categorías
 */
export default function ReviewsSection({
  overallRating,
  totalReviews,
  breakdown
}: ReviewsSectionProps) {
  const categories = breakdown ? [
    { key: 'cleanliness', label: 'Limpieza', value: breakdown.cleanliness },
    { key: 'accuracy', label: 'Precisión', value: breakdown.accuracy },
    { key: 'communication', label: 'Comunicación', value: breakdown.communication },
    { key: 'location', label: 'Ubicación', value: breakdown.location },
    { key: 'checkIn', label: 'Llegada', value: breakdown.checkIn },
    { key: 'value', label: 'Relación calidad-precio', value: breakdown.value },
  ] : [];

  const getBarWidth = (rating: number) => {
    return `${(rating / 5) * 100}%`;
  };

  return (
    <div className="py-8 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-6 h-6 fill-current text-gray-900" />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {overallRating} · {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
        </h2>
      </div>

      {/* Breakdown de Calificaciones */}
      {breakdown && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {categories.map((category) => (
            <div key={category.key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">{category.label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {category.value.toFixed(1)}
                </span>
              </div>
              {/* Barra de progreso */}
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 transition-all duration-300"
                  style={{ width: getBarWidth(category.value) }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

