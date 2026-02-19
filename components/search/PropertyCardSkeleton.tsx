'use client';

/**
 * PropertyCardSkeleton — Skeleton screen para PropertyCard.
 * Simula el layout exacto de la tarjeta real para evitar CLS (Cumulative Layout Shift)
 * y dar sensación de carga instantánea mientras llegan los datos de la API.
 * Zero backend: puramente client-side con Tailwind animate-pulse.
 */
export default function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse" aria-hidden="true">
      {/* Imagen placeholder */}
      <div className="relative aspect-[4/3] rounded-xl bg-gray-200" />

      {/* Info placeholder */}
      <div className="mt-3 space-y-2.5">
        {/* Fila ubicación + rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-10 flex-shrink-0" />
        </div>

        {/* Título */}
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>

        {/* Capacidad */}
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>

        {/* Precio */}
        <div className="pt-1">
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * PropertyGridSkeleton — Grid completo de skeletons para el estado de carga inicial.
 */
export function PropertyGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
