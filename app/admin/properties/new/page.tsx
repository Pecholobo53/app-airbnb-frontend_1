// app/admin/properties/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyService, CreatePropertyData } from '@/lib/properties/property-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Página para crear una nueva propiedad
 */
export default function NewPropertyPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreatePropertyData>({
    title: '',
    description: '',
    location: {
      city: '',
      country: '',
      region: '',
      address: '',
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 0,
      currency: 'EUR',
      cleaningFee: 0,
      serviceFee: 0,
    },
    capacity: {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    amenities: [],
    availability: {
      minNights: 1,
      maxNights: 365,
      instantBook: false,
      checkInTime: '15:00',
      checkOutTime: '11:00',
    },
    images: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validar datos mínimos
      const errors: string[] = [];

      if (!formData.title || formData.title.trim() === '') {
        errors.push('El título es requerido');
      }

      if (!formData.description || formData.description.trim() === '') {
        errors.push('La descripción es requerida');
      }

      if (!formData.location.city || formData.location.city.trim() === '') {
        errors.push('La ciudad es requerida');
      }

      if (!formData.location.country || formData.location.country.trim() === '') {
        errors.push('El país es requerido');
      }

      if (formData.pricing.basePrice <= 0) {
        errors.push('El precio base debe ser mayor a 0');
      }

      if (formData.capacity.guests < 1) {
        errors.push('Debe haber al menos 1 huésped');
      }

      if (formData.capacity.bedrooms < 1) {
        errors.push('Debe haber al menos 1 habitación');
      }

      if (formData.capacity.beds < 1) {
        errors.push('Debe haber al menos 1 cama');
      }

      if (formData.capacity.bathrooms < 1) {
        errors.push('Debe haber al menos 1 baño');
      }

      if (formData.images.length === 0) {
        errors.push('Debes agregar al menos una imagen');
      }

      if (errors.length > 0) {
        toast.error(`Errores de validación: ${errors.join(', ')}`);
        setIsSaving(false);
        return;
      }

      // Preparar datos para enviar - asegurar que todos los objetos requeridos estén presentes
      const dataToSend: CreatePropertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: {
          city: formData.location.city.trim(),
          country: formData.location.country.trim(),
          coordinates: {
            lat: formData.location.coordinates.lat || 0,
            lng: formData.location.coordinates.lng || 0,
          },
          ...(formData.location.region?.trim() && { region: formData.location.region.trim() }),
          ...(formData.location.address?.trim() && { address: formData.location.address.trim() }),
        },
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        pricing: {
          basePrice: formData.pricing.basePrice,
          currency: formData.pricing.currency,
          ...(formData.pricing.cleaningFee && formData.pricing.cleaningFee > 0 && { cleaningFee: formData.pricing.cleaningFee }),
          ...(formData.pricing.serviceFee && formData.pricing.serviceFee > 0 && { serviceFee: formData.pricing.serviceFee }),
        },
        capacity: {
          guests: formData.capacity.guests,
          bedrooms: formData.capacity.bedrooms,
          beds: formData.capacity.beds,
          bathrooms: formData.capacity.bathrooms,
        },
        amenities: formData.amenities,
        availability: {
          minNights: formData.availability.minNights,
          maxNights: formData.availability.maxNights,
          instantBook: formData.availability.instantBook,
          ...(formData.availability.checkInTime && { checkInTime: formData.availability.checkInTime }),
          ...(formData.availability.checkOutTime && { checkOutTime: formData.availability.checkOutTime }),
        },
        images: formData.images,
      };

      console.log('📤 Enviando datos:', JSON.stringify(dataToSend, null, 2));

      const response = await PropertyService.createProperty(dataToSend);

      if (response.success && response.data) {
        toast.success('Propiedad creada exitosamente');
        router.push(`/admin/properties`);
      } else {
        const errorMessage = response.error?.message || 'Error al crear la propiedad';
        console.error('❌ Error del backend:', response.error);
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Error creando propiedad:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear la propiedad');
    } finally {
      setIsSaving(false);
    }
  };

  const addImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const availableAmenities = [
    'wifi', 'kitchen', 'pool', 'ac', 'parking', 'gym',
    'beach_access', 'mountain_view', 'pet_friendly', 'washer',
    'dryer', 'balcony', 'workspace', 'fireplace', 'tv', 'heating',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/properties">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Propiedad</h1>
          <p className="text-gray-600 mt-1">Crea una nueva propiedad en el sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Datos principales de la propiedad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Hermoso apartamento en el centro"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                placeholder="Describe la propiedad..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Tipo de Propiedad</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value: 'entire_place' | 'private_room' | 'shared_room') =>
                    setFormData(prev => ({ ...prev, propertyType: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entire_place">Lugar completo</SelectItem>
                    <SelectItem value="private_room">Habitación privada</SelectItem>
                    <SelectItem value="shared_room">Habitación compartida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="roomType">Tipo de Alojamiento</Label>
                <Select
                  value={formData.roomType}
                  onValueChange={(value: any) =>
                    setFormData(prev => ({ ...prev, roomType: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="cabin">Cabaña</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="cottage">Casa de campo</SelectItem>
                    <SelectItem value="castle">Castillo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
            <CardDescription>Datos de ubicación de la propiedad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={formData.location.country}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, country: e.target.value },
                  }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="region">Región</Label>
              <Input
                id="region"
                value={formData.location.region || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, region: e.target.value },
                }))}
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.location.address || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value },
                }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitud</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.location.coordinates.lat}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: {
                        ...prev.location.coordinates,
                        lat: parseFloat(e.target.value) || 0,
                      },
                    },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitud</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.location.coordinates.lng}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: {
                        ...prev.location.coordinates,
                        lng: parseFloat(e.target.value) || 0,
                      },
                    },
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Precios */}
        <Card>
          <CardHeader>
            <CardTitle>Precios</CardTitle>
            <CardDescription>Configuración de precios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="basePrice">Precio Base (€) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  value={formData.pricing.basePrice}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      basePrice: parseFloat(e.target.value) || 0,
                    },
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cleaningFee">Tarifa de Limpieza (€)</Label>
                <Input
                  id="cleaningFee"
                  type="number"
                  min="0"
                  value={formData.pricing.cleaningFee || 0}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      cleaningFee: parseFloat(e.target.value) || 0,
                    },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="serviceFee">Tarifa de Servicio (€)</Label>
                <Input
                  id="serviceFee"
                  type="number"
                  min="0"
                  value={formData.pricing.serviceFee || 0}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      serviceFee: parseFloat(e.target.value) || 0,
                    },
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capacidad */}
        <Card>
          <CardHeader>
            <CardTitle>Capacidad</CardTitle>
            <CardDescription>Configuración de capacidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="guests">Huéspedes</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  value={formData.capacity.guests}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      guests: parseInt(e.target.value) || 1,
                    },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">Habitaciones</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  value={formData.capacity.bedrooms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      bedrooms: parseInt(e.target.value) || 1,
                    },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="beds">Camas</Label>
                <Input
                  id="beds"
                  type="number"
                  min="1"
                  value={formData.capacity.beds}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      beds: parseInt(e.target.value) || 1,
                    },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Baños</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  step="0.5"
                  value={formData.capacity.bathrooms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      bathrooms: parseFloat(e.target.value) || 1,
                    },
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenidades */}
        <Card>
          <CardHeader>
            <CardTitle>Amenidades</CardTitle>
            <CardDescription>Selecciona las amenidades disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {availableAmenities.map((amenity) => (
                <Button
                  key={amenity}
                  type="button"
                  variant={formData.amenities.includes(amenity) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disponibilidad */}
        <Card>
          <CardHeader>
            <CardTitle>Disponibilidad</CardTitle>
            <CardDescription>Configuración de disponibilidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minNights">Noches Mínimas</Label>
                <Input
                  id="minNights"
                  type="number"
                  min="1"
                  value={formData.availability.minNights}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      minNights: parseInt(e.target.value) || 1,
                    },
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="maxNights">Noches Máximas</Label>
                <Input
                  id="maxNights"
                  type="number"
                  min="1"
                  value={formData.availability.maxNights}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      maxNights: parseInt(e.target.value) || 365,
                    },
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="instantBook"
                checked={formData.availability.instantBook}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  availability: {
                    ...prev.availability,
                    instantBook: e.target.checked,
                  },
                }))}
                className="w-4 h-4"
              />
              <Label htmlFor="instantBook">Reserva Instantánea</Label>
            </div>
          </CardContent>
        </Card>

        {/* Imágenes */}
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
            <CardDescription>Agrega imágenes de la propiedad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="outline" onClick={addImage}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Imagen
            </Button>

            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/properties">
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={isSaving} className="bg-[#FF385C] hover:bg-[#E31C5F]">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Propiedad
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

