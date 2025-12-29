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

  // Helper para determinar si es Base64
  const isBase64 = (src: string) => {
    return src.startsWith('data:image/') || src.startsWith('data:image%2F');
  };

  // Helper para renderizar imagen
  const renderImage = (src: string, alt: string, className: string, useFill: boolean = true) => {
    if (isBase64(src)) {
      if (useFill) {
        return (
          <img
            src={src}
            alt={alt}
            className={className}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        );
      } else {
        return (
          <img
            src={src}
            alt={alt}
            className={className}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        );
      }
    }
    if (useFill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          sizes="100vw"
          priority
        />
      );
    } else {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          sizes="(max-width: 768px) 25vw, 10vw"
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
            "object-contain"
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
                  true
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

