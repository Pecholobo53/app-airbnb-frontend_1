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
          setReviews(reviewsResponse.data.reviews);
          // Calcular stats desde las reviews
          if (reviewsResponse.data.reviews.length > 0) {
            const avgRating = reviewsResponse.data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsResponse.data.reviews.length;
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
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
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
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">
            Esta propiedad aún no tiene reseñas
          </p>
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

