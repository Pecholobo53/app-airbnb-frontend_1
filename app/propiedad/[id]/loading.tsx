// app/propiedad/[id]/loading.tsx

/**
 * Loading State para página de detalle de propiedad
 * Muestra skeleton mientras carga la información
 */
export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Galería Skeleton */}
          <div className="mb-8">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-lg overflow-hidden">
              <div className="col-span-2 row-span-2 bg-gray-200" />
              <div className="bg-gray-200" />
              <div className="bg-gray-200" />
              <div className="bg-gray-200" />
              <div className="bg-gray-200" />
            </div>
          </div>

          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
              <div className="h-64 bg-gray-200 rounded" />
            </div>

            {/* Price Card */}
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

