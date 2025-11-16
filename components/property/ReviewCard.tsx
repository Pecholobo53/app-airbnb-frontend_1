// components/property/ReviewCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '@/types/search';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReviewCardProps {
  review: Review;
}

/**
 * Tarjeta Individual de Review
 * Muestra avatar, nombre, rating, comentario y botón útil
 */
export default function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);
  
  const commentLimit = 150;
  const shouldTruncate = review.comment.length > commentLimit;
  
  const displayComment = shouldTruncate && !isExpanded
    ? review.comment.substring(0, commentLimit) + '...'
    : review.comment;

  const formattedDate = format(review.date, 'MMMM yyyy', { locale: es });

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount(helpfulCount + 1);
      setHasVoted(true);
    }
  };

  return (
    <div className="py-6">
      {/* Header: Avatar + Nombre + Fecha */}
      <div className="flex items-start gap-4 mb-4">
        <Image
          src={review.userAvatar}
          alt={review.userName}
          width={48}
          height={48}
          className="rounded-full"
        />
        
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{review.userName}</h4>
          <p className="text-sm text-gray-500 capitalize">{formattedDate}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-current text-gray-900" />
          <span className="text-sm font-semibold">{review.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Comentario */}
      <p className="text-gray-700 leading-relaxed mb-3">
        {displayComment}
      </p>

      {/* Botón Leer más */}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm font-semibold text-gray-900 underline hover:text-gray-700 transition-colors mb-3"
        >
          {isExpanded ? 'Mostrar menos' : 'Mostrar más'}
        </button>
      )}

      {/* Botón Útil */}
      <button
        onClick={handleHelpful}
        disabled={hasVoted}
        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
          hasVoted
            ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
        <span>Útil</span>
        {helpfulCount > 0 && (
          <span className="font-medium">({helpfulCount})</span>
        )}
      </button>
    </div>
  );
}

