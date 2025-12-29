// components/properties/ImageUpload.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

/**
 * Componente de carga de imágenes con drag and drop
 * Convierte las imágenes a base64 para almacenamiento
 */
export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Convierte un archivo a base64
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Error al convertir imagen a base64'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  };

  /**
   * Valida y procesa archivos de imagen
   */
  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((file) => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB máximo
      
      if (!isValidType) {
        console.warn(`Archivo ${file.name} no es una imagen válida`);
        return false;
      }
      if (!isValidSize) {
        console.warn(`Archivo ${file.name} es demasiado grande (máximo 5MB)`);
        return false;
      }
      return true;
    });

    if (imageFiles.length === 0) {
      return;
    }

    // Verificar límite de imágenes
    const remainingSlots = maxImages - images.length;
    if (imageFiles.length > remainingSlots) {
      console.warn(`Solo puedes agregar ${remainingSlots} imagen(es) más`);
      imageFiles.splice(remainingSlots);
    }

    setIsUploading(true);

    try {
      const base64Promises = imageFiles.map((file) => fileToBase64(file));
      const base64Images = await Promise.all(base64Promises);
      
      onImagesChange([...images, ...base64Images]);
    } catch (error) {
      console.error('Error procesando imágenes:', error);
    } finally {
      setIsUploading(false);
    }
  }, [images, maxImages, onImagesChange]);

  /**
   * Maneja el click en el botón de subir
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Maneja la selección de archivos desde el input
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Resetear el input para permitir seleccionar el mismo archivo de nuevo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Maneja el drag over
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Maneja el drag leave
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Maneja el drop
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    processFiles(files);
  };

  /**
   * Elimina una imagen
   */
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Zona de drag and drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-[#FF385C] bg-[#FF385C]/5'
            : 'border-gray-300 hover:border-gray-400',
          isUploading && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <div className="w-12 h-12 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Subiendo imágenes...</p>
            </>
          ) : (
            <>
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center',
                isDragging ? 'bg-[#FF385C]/10' : 'bg-gray-100'
              )}>
                <Upload className={cn(
                  'w-8 h-8',
                  isDragging ? 'text-[#FF385C]' : 'text-gray-400'
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isDragging ? 'Suelta las imágenes aquí' : 'Arrastra y suelta imágenes aquí'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP hasta 5MB cada una
                </p>
                <p className="text-xs text-gray-400">
                  {images.length}/{maxImages} imágenes
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleButtonClick}
                disabled={images.length >= maxImages}
                className="mt-2"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Seleccionar Imágenes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Grid de imágenes preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Imagen {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje si se alcanza el límite */}
      {images.length >= maxImages && (
        <p className="text-sm text-amber-600 text-center">
          Has alcanzado el límite de {maxImages} imágenes
        </p>
      )}
    </div>
  );
}

