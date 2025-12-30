// components/property/PropertyGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageGalleryModal from './ImageGalleryModal';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/**
 * Galería de Imágenes de Propiedad
 * Grid: 1 imagen grande + 4 pequeñas en desktop
 * Carrusel en mobile
 */
export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Validar que images sea un array válido
  const validImages = Array.isArray(images) ? images : [];
  const displayImages = validImages.slice(0, 5);
  const remainingCount = Math.max(0, validImages.length - 5);

  // Helper para determinar si es Base64
  const isBase64 = (src: string) => {
    return src.startsWith('data:image/') || src.startsWith('data:image%2F');
  };

  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const placeholderImage = '/placeholder-property.jpg';

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
      console.warn(`⚠️ [PROPERTY GALLERY] Error cargando imagen ${index} de ${title}`);
    }
  };

  // Helper para renderizar imagen (Next.js Image para URLs, img para Base64)
  const renderImage = (src: string, alt: string, className: string, sizes?: string, priority?: boolean, index: number = 0) => {
    const hasError = imageErrors.has(index);
    const imageSrc = hasError ? placeholderImage : src;
    const isPlaceholder = imageSrc === placeholderImage || hasError;
    
    if (isBase64(imageSrc)) {
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
    }
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onError={() => handleImageError(index, isPlaceholder)}
      />
    );
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  if (validImages.length === 0) {
    return (
      <div className="w-full h-96 bg-white rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Sin imágenes disponibles</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-xl overflow-hidden bg-white">
        {/* Imagen principal (2x2) */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group bg-white rounded-lg overflow-hidden"
          onClick={() => handleImageClick(0)}
        >
          {renderImage(
            displayImages[0],
            `${title} - 1`,
            "object-contain group-hover:brightness-90 transition-all",
            "(max-width: 768px) 100vw, 50vw",
            true,
            0
          )}
        </div>

        {/* Imágenes secundarias (1x1 cada una) - Lazy loading */}
        {displayImages.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer group bg-white rounded-lg overflow-hidden"
            onClick={() => handleImageClick(idx + 1)}
          >
            {renderImage(
              img,
              `${title} - ${idx + 2}`,
              "object-contain group-hover:brightness-90 transition-all",
              "(max-width: 768px) 100vw, 25vw",
              false, // Lazy loading para imágenes secundarias
              idx + 1
            )}
            {/* Mostrar contador en última imagen */}
            {idx === 3 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{remainingCount} fotos
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Botón "Ver todas las fotos" - Centrado */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Ver todas las fotos
          </Button>
        </div>
      </div>

      {/* Mobile Carousel - Simple first image with button */}
      <div className="md:hidden relative h-64 rounded-lg overflow-hidden bg-white">
        <div className="w-full h-full bg-white rounded-lg overflow-hidden">
          {renderImage(
            displayImages[0],
            title,
            "object-contain",
            "100vw",
            true,
            0
          )}
        </div>
        {/* Botón "Ver todas las fotos" - Centrado en mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Ver {validImages.length} fotos
          </Button>
        </div>
      </div>

      {/* Modal Fullscreen */}
      <ImageGalleryModal
        images={validImages}
        title={title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialIndex={selectedIndex}
      />
    </>
  );
}

