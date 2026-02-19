// components/property/ReviewsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types/search';
import ReviewCard from './ReviewCard';
import ReviewsSection from './ReviewsSection';
import { Button } from '@/components/ui/button';
import { PropertyService } from '@/lib/properties/property-service';

interface ReviewsListProps {
  propertyId: string;
  initialRating: number;
  initialReviewCount: number;
}

/**
 * Lista de Reviews con Paginación
 * Muestra 6 reviews por página
 */
export default function ReviewsList({
  propertyId,
  initialRating,
  initialReviewCount
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const reviewsPerPage = 6;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const displayedReviews = reviews.slice(startIndex, endIndex);

  useEffect(() => {
    async function loadReviews() {
      try {
        setIsLoading(true);
        
        // Cargar reviews
        const reviewsResponse = await PropertyService.getPropertyReviews(propertyId, currentPage, reviewsPerPage);
        if (reviewsResponse.success && reviewsResponse.data) {
          const reviews = reviewsResponse.data?.reviews ?? [];
          setReviews(reviews as any);
          if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
            setStats({
              average: avgRating,
              total: reviewsResponse.data.total
            });
          }
        }
      } catch (error) {
        console.error('Error cargando reviews:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReviews();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="py-8 border-b border-gray-200">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="h-6 bg-gray-200 rounded w-24" />
          </div>
          
          {/* Review cards skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-16" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reseñas
        </h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aún no hay reseñas
            </h3>
            <p className="text-gray-600 mb-1">
              Esta propiedad es nueva y aún no ha recibido reseñas de huéspedes.
            </p>
            <p className="text-sm text-gray-500">
              Sé el primero en compartir tu experiencia después de tu estancia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header con Breakdown */}
      <ReviewsSection
        overallRating={stats?.averageRating || initialRating}
        totalReviews={reviews.length}
        breakdown={stats?.categories}
      />

      {/* Lista de Reviews */}
      <div className="divide-y divide-gray-200">
        {displayedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, reviews.length)} de {reviews.length}
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

