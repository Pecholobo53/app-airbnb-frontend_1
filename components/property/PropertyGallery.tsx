// components/property/PropertyGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageGalleryModal from './ImageGalleryModal';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const validImages = Array.isArray(images) ? images : [];
  const displayImages = validImages.slice(0, 5);
  const remainingCount = Math.max(0, validImages.length - 5);
  const placeholderImage = '/placeholder-property.jpg';

  const isBase64 = (src: string) =>
    src.startsWith('data:image/') || src.startsWith('data:image%2F');

  const handleImageError = (index: number, isPlaceholder: boolean = false) => {
    if (!isPlaceholder) {
      setImageErrors(prev => {
        if (prev.has(index)) return prev;
        const next = new Set(prev);
        next.add(index);
        return next;
      });
    }
  };

  const renderImage = (
    src: string,
    alt: string,
    className: string,
    sizes?: string,
    priority?: boolean,
    index: number = 0
  ) => {
    const hasError = imageErrors.has(index);
    const imageSrc = hasError ? placeholderImage : src;
    const isPlaceholder = hasError || imageSrc === placeholderImage;

    if (!imageSrc || imageSrc.trim() === '') {
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Sin imagen</p>
        </div>
      );
    }

    if (isBase64(imageSrc)) {
      return (
        <img
          src={imageSrc}
          alt={alt}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => handleImageError(index, isPlaceholder)}
        />
      );
    }

    return (
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          onError={() => handleImageError(index, isPlaceholder)}
          unoptimized={imageSrc.includes('localhost')}
        />
      </div>
    );
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const mobilePrev = () => setMobileIndex(i => (i > 0 ? i - 1 : validImages.length - 1));
  const mobileNext = () => setMobileIndex(i => (i < validImages.length - 1 ? i + 1 : 0));

  if (validImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Sin imágenes disponibles</p>
      </div>
    );
  }

  // Determinar layout desktop según cantidad de imágenes
  const count = displayImages.length;

  return (
    <>
      {/* ── Desktop Grid ── */}
      <div className="hidden md:block">
        {count === 1 && (
          <div
            className="relative h-[500px] rounded-xl overflow-hidden cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            {renderImage(displayImages[0], title, 'object-cover', '100vw', true, 0)}
          </div>
        )}

        {count === 2 && (
          <div className="grid grid-cols-2 gap-2 h-[500px] rounded-xl overflow-hidden">
            {displayImages.map((img, i) => (
              <div key={i} className="relative cursor-pointer group" onClick={() => handleImageClick(i)}>
                {renderImage(img, `${title} - ${i + 1}`, 'object-cover group-hover:brightness-90 transition-all', '50vw', i === 0, i)}
              </div>
            ))}
          </div>
        )}

        {count === 3 && (
          <div className="grid grid-cols-2 gap-2 h-[500px] rounded-xl overflow-hidden">
            <div className="relative cursor-pointer group row-span-2" onClick={() => handleImageClick(0)}>
              {renderImage(displayImages[0], `${title} - 1`, 'object-cover group-hover:brightness-90 transition-all', '50vw', true, 0)}
            </div>
            {displayImages.slice(1).map((img, i) => (
              <div key={i} className="relative cursor-pointer group" onClick={() => handleImageClick(i + 1)}>
                {renderImage(img, `${title} - ${i + 2}`, 'object-cover group-hover:brightness-90 transition-all', '50vw', false, i + 1)}
              </div>
            ))}
          </div>
        )}

        {count >= 4 && (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-xl overflow-hidden">
            {/* Imagen principal 2x2 */}
            <div
              className="col-span-2 row-span-2 relative cursor-pointer group"
              onClick={() => handleImageClick(0)}
            >
              {renderImage(displayImages[0], `${title} - 1`, 'object-cover group-hover:brightness-90 transition-all', '(max-width:768px) 100vw, 50vw', true, 0)}
            </div>
            {/* Thumbnails */}
            {displayImages.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer group"
                onClick={() => handleImageClick(idx + 1)}
              >
                {renderImage(img, `${title} - ${idx + 2}`, 'object-cover group-hover:brightness-90 transition-all', '(max-width:768px) 100vw, 25vw', false, idx + 1)}
                {idx === 3 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">+{remainingCount} fotos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile Carousel ── */}
      <div className="md:hidden relative h-72 rounded-xl overflow-hidden bg-gray-100">
        <div
          className="w-full h-full cursor-pointer"
          onClick={() => handleImageClick(mobileIndex)}
        >
          {renderImage(validImages[mobileIndex], `${title} - ${mobileIndex + 1}`, 'object-cover', '100vw', mobileIndex === 0, mobileIndex)}
        </div>

        {/* Prev / Next */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); mobilePrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); mobileNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setMobileIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === mobileIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Contador */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {mobileIndex + 1} / {validImages.length}
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
