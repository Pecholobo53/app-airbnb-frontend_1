// app/admin/properties/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PropertyService, CreatePropertyData } from '@/lib/properties/property-service';
import { Property } from '@/types/search';
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
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Página para editar una propiedad existente
 */
export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<CreatePropertyData | null>(null);

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    setIsLoading(true);
    try {
      const response = await PropertyService.getPropertyById(propertyId);
      
      if (response.success && response.data) {
        setProperty(response.data);
        // Convertir Property a CreatePropertyData
        setFormData({
          title: response.data.title,
          description: response.data.description,
          location: response.data.location,
          propertyType: response.data.propertyType,
          roomType: response.data.roomType,
          pricing: {
            basePrice: response.data.pricing.basePrice,
            currency: response.data.pricing.currency,
            cleaningFee: response.data.pricing.cleaningFee,
            serviceFee: response.data.pricing.serviceFee,
          },
          capacity: response.data.capacity,
          amenities: response.data.amenities,
          availability: response.data.availability,
          images: response.data.images,
        });
      } else {
        toast.error(response.error?.message || 'Error al cargar la propiedad');
        router.push('/admin/properties');
      }
    } catch (error) {
      console.error('Error cargando propiedad:', error);
      toast.error('Error al cargar la propiedad');
      router.push('/admin/properties');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);

    try {
      // Usar updateProperty para actualizar
      const response = await PropertyService.updateProperty(propertyId, formData);

      if (response.success && response.data) {
        toast.success('Propiedad actualizada exitosamente');
        router.push(`/admin/properties`);
      } else {
        toast.error(response.error?.message || 'Error al actualizar la propiedad');
      }
    } catch (error) {
      console.error('Error actualizando propiedad:', error);
      toast.error('Error al actualizar la propiedad');
    } finally {
      setIsSaving(false);
    }
  };

  const addImage = () => {
    if (!formData) return;
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      setFormData(prev => prev ? ({
        ...prev,
        images: [...prev.images, url],
      }) : null);
    }
  };

  const removeImage = (index: number) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }) : null);
  };

  const toggleAmenity = (amenity: string) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }) : null);
  };

  const availableAmenities = [
    'wifi', 'kitchen', 'pool', 'ac', 'parking', 'gym',
    'beach_access', 'mountain_view', 'pet_friendly', 'washer',
    'dryer', 'balcony', 'workspace', 'fireplace', 'tv', 'heating',
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF385C]" />
      </div>
    );
  }

  if (!formData || !property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Propiedad no encontrada</p>
        <Link href="/admin/properties">
          <Button variant="outline">Volver</Button>
        </Link>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Editar Propiedad</h1>
          <p className="text-gray-600 mt-1">{property.title}</p>
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
                onChange={(e) => setFormData(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Tipo de Propiedad</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value: 'entire_place' | 'private_room' | 'shared_room') =>
                    setFormData(prev => prev ? ({ ...prev, propertyType: value }) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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
                    setFormData(prev => prev ? ({ ...prev, roomType: value }) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }) : null)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={formData.location.country}
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    location: { ...prev.location, country: e.target.value },
                  }) : null)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="region">Región</Label>
              <Input
                id="region"
                value={formData.location.region || ''}
                onChange={(e) => setFormData(prev => prev ? ({
                  ...prev,
                  location: { ...prev.location, region: e.target.value },
                }) : null)}
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.location.address || ''}
                onChange={(e) => setFormData(prev => prev ? ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value },
                }) : null)}
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
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: {
                        ...prev.location.coordinates,
                        lat: parseFloat(e.target.value) || 0,
                      },
                    },
                  }) : null)}
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitud</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.location.coordinates.lng}
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: {
                        ...prev.location.coordinates,
                        lng: parseFloat(e.target.value) || 0,
                      },
                    },
                  }) : null)}
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
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      basePrice: parseFloat(e.target.value) || 0,
                    },
                  }) : null)}
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
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      cleaningFee: parseFloat(e.target.value) || 0,
                    },
                  }) : null)}
                />
              </div>
              <div>
                <Label htmlFor="serviceFee">Tarifa de Servicio (€)</Label>
                <Input
                  id="serviceFee"
                  type="number"
                  min="0"
                  value={formData.pricing.serviceFee || 0}
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      serviceFee: parseFloat(e.target.value) || 0,
                    },
                  }) : null)}
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
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      guests: parseInt(e.target.value) || 1,
                    },
                  }) : null)}
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">Habitaciones</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  value={formData.capacity.bedrooms}
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      bedrooms: parseInt(e.target.value) || 1,
                    },
                  }) : null)}
                />
              </div>
              <div>
                <Label htmlFor="beds">Camas</Label>
                <Input
                  id="beds"
                  type="number"
                  min="1"
                  value={formData.capacity.beds}
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      beds: parseInt(e.target.value) || 1,
                    },
                  }) : null)}
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
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    capacity: {
                      ...prev.capacity,
                      bathrooms: parseFloat(e.target.value) || 1,
                    },
                  }) : null)}
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
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      minNights: parseInt(e.target.value) || 1,
                    },
                  }) : null)}
                />
              </div>
              <div>
                <Label htmlFor="maxNights">Noches Máximas</Label>
                <Input
                  id="maxNights"
                  type="number"
                  min="1"
                  value={formData.availability.maxNights}
                  onChange={(e) => setFormData(prev => prev ? ({
                    ...prev,
                    availability: {
                      ...prev.availability,
                      maxNights: parseInt(e.target.value) || 365,
                    },
                  }) : null)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="instantBook"
                checked={formData.availability.instantBook}
                onChange={(e) => setFormData(prev => prev ? ({
                  ...prev,
                  availability: {
                    ...prev.availability,
                    instantBook: e.target.checked,
                  },
                }) : null)}
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
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

