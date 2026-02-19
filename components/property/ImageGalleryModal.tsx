// components/property/ImageGalleryModal.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageGalleryModalProps {
  images: string[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

/**
 * Modal Fullscreen de Galería
 * Navegación con flechas, teclado y thumbnails
 */
export default function ImageGalleryModal({
  images,
  title,
  isOpen,
  onClose,
  initialIndex = 0
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const placeholderImage = '/placeholder-property.jpg';

  // Helper para determinar si es Base64
  const isBase64 = (src: string) => {
    return src.startsWith('data:image/') || src.startsWith('data:image%2F');
  };

  const handleImageError = (index: number, isPlaceholder: boolean = false) => {
    // Solo marcar error si NO es el placeholder (evitar bucles infinitos)
    if (!isPlaceholder) {
      setImageErrors(prev => {
        // Solo agregar si no está ya en el set (evitar re-renders innecesarios)
        if (prev.has(index)) {
          return prev;
        }
        const newSet = new Set(prev);
        newSet.add(index);
        return newSet;
      });
    }
  };

  // Helper para renderizar imagen
  const renderImage = (src: string, alt: string, className: string, useFill: boolean = true, priority: boolean = false, index: number = 0) => {
    const hasError = imageErrors.has(index);
    const imageSrc = hasError ? placeholderImage : src;
    const isPlaceholder = imageSrc === placeholderImage || hasError;
    
    if (isBase64(imageSrc)) {
      if (useFill) {
        return (
          <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => handleImageError(index, isPlaceholder)}
          />
        );
      } else {
        return (
          <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            loading="lazy"
            onError={() => handleImageError(index, isPlaceholder)}
          />
        );
      }
    }
    if (useFill) {
      return (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={className}
          sizes="100vw"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          onError={() => handleImageError(index, isPlaceholder)}
        />
      );
    } else {
      return (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={className}
          sizes="(max-width: 768px) 25vw, 10vw"
          loading="lazy"
          onError={() => handleImageError(index, isPlaceholder)}
        />
      );
    }
  };

  // Actualizar índice cuando cambia el inicial
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Navegación con teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full h-full p-0 bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-gray-300">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Imagen Principal */}
        <div className="relative w-full h-full flex items-center justify-center">
          {renderImage(
            images[currentIndex],
            `${title} - ${currentIndex + 1}`,
            "object-contain",
            true,
            true, // Priority para imagen principal visible
            currentIndex
          )}

          {/* Botones de Navegación */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 text-white bg-black/50 hover:bg-black/70"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 text-white bg-black/50 hover:bg-black/70"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails (Desktop) */}
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4 hidden md:block">
          <div className="flex gap-2 overflow-x-auto justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-16 rounded overflow-hidden transition-all ${
                  idx === currentIndex
                    ? 'ring-2 ring-white opacity-100'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                {renderImage(
                  img,
                  `Thumbnail ${idx + 1}`,
                  "object-cover",
                  false,
                  false,
                  idx
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

