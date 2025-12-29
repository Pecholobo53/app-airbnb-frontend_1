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
import { ArrowLeft, Save, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import ImageUpload from '@/components/properties/ImageUpload';
import { geocodeAddress, buildAddress, isValidCoordinates } from '@/lib/utils/geocoding';

/**
 * Página para crear una nueva propiedad
 */
export default function NewPropertyPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
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
    console.log('🚀 [FORM] handleSubmit ejecutado');
    
    // Verificar autenticación ANTES de procesar el formulario
    const session = typeof window !== 'undefined' 
      ? sessionStorage.getItem('airbnb_session') 
      : null;
    
    if (!session) {
      console.error('❌ [FORM] NO HAY SESIÓN - El usuario no está autenticado');
      toast.error('Debes iniciar sesión para crear una propiedad');
      router.push('/login');
      return;
    }
    
    let user = null;
    try {
      const parsed = JSON.parse(session);
      const token = parsed.token || parsed.accessToken;
      user = parsed.user;
      if (!token) {
        console.error('❌ [FORM] NO HAY TOKEN en la sesión');
        toast.error('Sesión inválida. Por favor, inicia sesión nuevamente');
        router.push('/login');
        return;
      }
      if (!user || !user.id) {
        console.error('❌ [FORM] NO HAY USUARIO en la sesión');
        toast.error('Sesión inválida. Por favor, inicia sesión nuevamente');
        router.push('/login');
        return;
      }
      console.log('✅ [FORM] Usuario autenticado, token presente:', `${token.substring(0, 20)}...`);
      console.log('✅ [FORM] Usuario ID:', user.id);
    } catch (error) {
      console.error('❌ [FORM] Error verificando sesión:', error);
      toast.error('Error de autenticación. Por favor, inicia sesión nuevamente');
      router.push('/login');
      return;
    }
    console.log('📋 [FORM] Estado actual del formulario:', {
      title: formData.title,
      description: formData.description,
      city: formData.location.city,
      country: formData.location.country,
      basePrice: formData.pricing.basePrice,
      imagesCount: formData.images.length,
      amenitiesCount: formData.amenities.length,
    });
    setIsSaving(true);

    try {
      // Validar datos mínimos
      const errors: string[] = [];

      if (!formData.title || formData.title.trim() === '') {
        errors.push('El título es requerido');
      }

      if (!formData.description || formData.description.trim() === '') {
        errors.push('La descripción es requerida');
      } else if (formData.description.trim().length < 50) {
        errors.push('La descripción debe tener al menos 50 caracteres');
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
      // Construir location con validación de campos
      const locationData = {
        city: (formData.location.city || '').trim(),
        country: (formData.location.country || '').trim(),
        coordinates: {
          lat: Number(formData.location.coordinates?.lat) || 0,
          lng: Number(formData.location.coordinates?.lng) || 0,
        },
      };
      
      // Agregar campos opcionales solo si tienen valor
      const region = (formData.location.region || '').trim();
      if (region) {
        locationData.region = region;
      }
      
      const address = (formData.location.address || '').trim();
      if (address) {
        locationData.address = address;
      }

      // Construir pricing con validación
      const pricingData = {
        basePrice: Number(formData.pricing.basePrice) || 0,
        currency: (formData.pricing.currency || 'EUR') as 'EUR' | 'USD' | 'GBP',
      };
      
      const cleaningFee = Number(formData.pricing.cleaningFee);
      if (cleaningFee > 0) {
        pricingData.cleaningFee = cleaningFee;
      }
      
      const serviceFee = Number(formData.pricing.serviceFee);
      if (serviceFee > 0) {
        pricingData.serviceFee = serviceFee;
      }

      // Construir availability con validación
      const availabilityData = {
        minNights: Number(formData.availability.minNights) || 1,
        maxNights: Number(formData.availability.maxNights) || 365,
        instantBook: Boolean(formData.availability.instantBook),
      };
      
      const checkInTime = (formData.availability.checkInTime || '').trim();
      if (checkInTime) {
        availabilityData.checkInTime = checkInTime;
      }
      
      const checkOutTime = (formData.availability.checkOutTime || '').trim();
      if (checkOutTime) {
        availabilityData.checkOutTime = checkOutTime;
      }

      // Función helper para eliminar valores undefined de un objeto
      // NO elimina objetos requeridos, solo campos opcionales con undefined
      const removeUndefined = (obj: any, isRequired: boolean = false): any => {
        if (obj === null) {
          return obj; // null es válido, no lo eliminamos
        }
        if (obj === undefined) {
          return isRequired ? obj : undefined; // undefined solo se elimina si no es requerido
        }
        if (Array.isArray(obj)) {
          return obj.map(item => removeUndefined(item, false)).filter(item => item !== undefined);
        }
        if (typeof obj === 'object') {
          const cleaned: any = {};
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const value = obj[key];
              // No incluir undefined, pero sí incluir null y otros valores
              if (value !== undefined) {
                cleaned[key] = removeUndefined(value, false);
              }
            }
          }
          return cleaned;
        }
        return obj;
      };

      // Construir el objeto final asegurando que todos los campos requeridos estén presentes
      // NO usar spread operator para campos opcionales que puedan ser undefined
      const dataToSend: CreatePropertyData & { host?: any } = {
        title: String(formData.title || '').trim(),
        description: String(formData.description || '').trim(),
        location: {
          city: String(locationData.city || '').trim(),
          country: String(locationData.country || '').trim(),
          coordinates: {
            lat: Number(locationData.coordinates?.lat) || 0,
            lng: Number(locationData.coordinates?.lng) || 0,
          },
        },
        propertyType: formData.propertyType || 'entire_place',
        roomType: formData.roomType || 'apartment',
        pricing: {
          basePrice: Number(pricingData.basePrice) || 0,
          currency: (pricingData.currency || 'EUR') as 'EUR' | 'USD' | 'GBP',
        },
        capacity: {
          guests: Number(formData.capacity?.guests) || 1,
          bedrooms: Number(formData.capacity?.bedrooms) || 1,
          beds: Number(formData.capacity?.beds) || 1,
          bathrooms: Number(formData.capacity?.bathrooms) || 1,
        },
        amenities: Array.isArray(formData.amenities) ? formData.amenities.filter(Boolean) : [],
        availability: {
          minNights: Number(availabilityData.minNights) || 1,
          maxNights: Number(availabilityData.maxNights) || 365,
          instantBook: Boolean(availabilityData.instantBook),
        },
        images: Array.isArray(formData.images) ? formData.images.filter(Boolean) : [],
        // Agregar el campo host que el backend requiere
        host: {
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          isSuperhost: user.isSuperhost || false, // Boolean requerido por el backend
          avatar: user.avatar || '', // String requerido por el backend (puede ser vacío)
        },
      };

      // Agregar campos opcionales SOLO si tienen valor válido (no undefined, no null, no vacío)
      if (locationData.region && String(locationData.region).trim()) {
        dataToSend.location.region = String(locationData.region).trim();
      }
      if (locationData.address && String(locationData.address).trim()) {
        dataToSend.location.address = String(locationData.address).trim();
      }
      if (pricingData.cleaningFee && Number(pricingData.cleaningFee) > 0) {
        dataToSend.pricing.cleaningFee = Number(pricingData.cleaningFee);
      }
      if (pricingData.serviceFee && Number(pricingData.serviceFee) > 0) {
        dataToSend.pricing.serviceFee = Number(pricingData.serviceFee);
      }
      if (availabilityData.checkInTime && String(availabilityData.checkInTime).trim()) {
        dataToSend.availability.checkInTime = String(availabilityData.checkInTime).trim();
      }
      if (availabilityData.checkOutTime && String(availabilityData.checkOutTime).trim()) {
        dataToSend.availability.checkOutTime = String(availabilityData.checkOutTime).trim();
      }

      // Validar que todos los objetos requeridos estén presentes antes de limpiar
      if (!dataToSend.location || typeof dataToSend.location !== 'object') {
        throw new Error('El objeto location es requerido');
      }
      if (!dataToSend.location.coordinates || typeof dataToSend.location.coordinates !== 'object') {
        throw new Error('El objeto coordinates es requerido dentro de location');
      }
      if (!dataToSend.pricing || typeof dataToSend.pricing !== 'object') {
        throw new Error('El objeto pricing es requerido');
      }
      if (!dataToSend.capacity || typeof dataToSend.capacity !== 'object') {
        throw new Error('El objeto capacity es requerido');
      }
      if (!dataToSend.availability || typeof dataToSend.availability !== 'object') {
        throw new Error('El objeto availability es requerido');
      }

      // Log detallado de cada campo antes de enviar
      console.log('📤 [FORM] Datos antes de limpiar:', {
        title: dataToSend.title,
        description: dataToSend.description,
        location: dataToSend.location,
        locationType: typeof dataToSend.location,
        coordinates: dataToSend.location.coordinates,
        coordinatesType: typeof dataToSend.location.coordinates,
        propertyType: dataToSend.propertyType,
        roomType: dataToSend.roomType,
        pricing: dataToSend.pricing,
        pricingType: typeof dataToSend.pricing,
        capacity: dataToSend.capacity,
        capacityType: typeof dataToSend.capacity,
        amenities: dataToSend.amenities,
        amenitiesIsArray: Array.isArray(dataToSend.amenities),
        availability: dataToSend.availability,
        availabilityType: typeof dataToSend.availability,
        images: dataToSend.images,
        imagesIsArray: Array.isArray(dataToSend.images),
      });

      // NO limpiar el objeto - enviarlo tal cual está construido
      // El backend debe recibir exactamente lo que construimos
      // Solo usar JSON.stringify que automáticamente omite undefined
      const cleanedData = dataToSend as CreatePropertyData;
      
      // Verificación final exhaustiva ANTES de serializar
      console.log('🔍 [FORM] Verificación final ANTES de serializar:');
      console.log('  ✅ location existe:', !!cleanedData.location, typeof cleanedData.location);
      console.log('  ✅ location.coordinates existe:', !!cleanedData.location?.coordinates, typeof cleanedData.location?.coordinates);
      console.log('  ✅ pricing existe:', !!cleanedData.pricing, typeof cleanedData.pricing);
      console.log('  ✅ capacity existe:', !!cleanedData.capacity, typeof cleanedData.capacity);
      console.log('  ✅ availability existe:', !!cleanedData.availability, typeof cleanedData.availability);
      console.log('  ✅ host existe:', !!(cleanedData as any).host, typeof (cleanedData as any).host);
      if ((cleanedData as any).host) {
        console.log('  ✅ host.id:', (cleanedData as any).host.id);
        console.log('  ✅ host.name:', (cleanedData as any).host.name);
        console.log('  ✅ host.email:', (cleanedData as any).host.email);
      }
      
      // Garantizar que los objetos requeridos estén presentes
      if (!cleanedData.location || typeof cleanedData.location !== 'object') {
        throw new Error('CRÍTICO: location no es un objeto válido');
      }
      if (!cleanedData.location.coordinates || typeof cleanedData.location.coordinates !== 'object') {
        throw new Error('CRÍTICO: location.coordinates no es un objeto válido');
      }
      if (!cleanedData.pricing || typeof cleanedData.pricing !== 'object') {
        throw new Error('CRÍTICO: pricing no es un objeto válido');
      }
      if (!cleanedData.capacity || typeof cleanedData.capacity !== 'object') {
        throw new Error('CRÍTICO: capacity no es un objeto válido');
      }
      if (!cleanedData.availability || typeof cleanedData.availability !== 'object') {
        throw new Error('CRÍTICO: availability no es un objeto válido');
      }
      
      console.log('✅ [FORM] Todos los objetos requeridos están presentes y son válidos');

      // Validación final exhaustiva antes de enviar
      const validationErrors: string[] = [];

      // Validar campos requeridos
      if (!cleanedData.title || cleanedData.title.trim() === '') {
        validationErrors.push('El título es requerido');
      }
      if (!cleanedData.description || cleanedData.description.trim() === '') {
        validationErrors.push('La descripción es requerida');
      }
      if (!cleanedData.location || typeof cleanedData.location !== 'object') {
        validationErrors.push('El objeto location es requerido');
      } else {
        if (!cleanedData.location.city || cleanedData.location.city.trim() === '') {
          validationErrors.push('La ciudad es requerida');
        }
        if (!cleanedData.location.country || cleanedData.location.country.trim() === '') {
          validationErrors.push('El país es requerido');
        }
        if (!cleanedData.location.coordinates || typeof cleanedData.location.coordinates !== 'object') {
          validationErrors.push('Las coordenadas son requeridas');
        } else {
          if (typeof cleanedData.location.coordinates.lat !== 'number' || isNaN(cleanedData.location.coordinates.lat)) {
            validationErrors.push('La latitud debe ser un número válido');
          }
          if (typeof cleanedData.location.coordinates.lng !== 'number' || isNaN(cleanedData.location.coordinates.lng)) {
            validationErrors.push('La longitud debe ser un número válido');
          }
        }
      }
      if (!cleanedData.pricing || typeof cleanedData.pricing !== 'object') {
        validationErrors.push('El objeto pricing es requerido');
      } else {
        if (typeof cleanedData.pricing.basePrice !== 'number' || cleanedData.pricing.basePrice <= 0) {
          validationErrors.push('El precio base debe ser un número mayor a 0');
        }
        if (!cleanedData.pricing.currency || !['EUR', 'USD', 'GBP'].includes(cleanedData.pricing.currency)) {
          validationErrors.push('La moneda debe ser EUR, USD o GBP');
        }
      }
      if (!cleanedData.capacity || typeof cleanedData.capacity !== 'object') {
        validationErrors.push('El objeto capacity es requerido');
      } else {
        if (typeof cleanedData.capacity.guests !== 'number' || cleanedData.capacity.guests < 1) {
          validationErrors.push('Debe haber al menos 1 huésped');
        }
        if (typeof cleanedData.capacity.bedrooms !== 'number' || cleanedData.capacity.bedrooms < 1) {
          validationErrors.push('Debe haber al menos 1 habitación');
        }
        if (typeof cleanedData.capacity.beds !== 'number' || cleanedData.capacity.beds < 1) {
          validationErrors.push('Debe haber al menos 1 cama');
        }
        if (typeof cleanedData.capacity.bathrooms !== 'number' || cleanedData.capacity.bathrooms < 1) {
          validationErrors.push('Debe haber al menos 1 baño');
        }
      }
      if (!cleanedData.availability || typeof cleanedData.availability !== 'object') {
        validationErrors.push('El objeto availability es requerido');
      } else {
        if (typeof cleanedData.availability.minNights !== 'number' || cleanedData.availability.minNights < 1) {
          validationErrors.push('Las noches mínimas deben ser al menos 1');
        }
        if (typeof cleanedData.availability.maxNights !== 'number' || cleanedData.availability.maxNights < cleanedData.availability.minNights) {
          validationErrors.push('Las noches máximas deben ser mayores o iguales a las mínimas');
        }
        if (typeof cleanedData.availability.instantBook !== 'boolean') {
          validationErrors.push('instantBook debe ser un valor booleano');
        }
      }
      if (!Array.isArray(cleanedData.images) || cleanedData.images.length === 0) {
        validationErrors.push('Debes agregar al menos una imagen');
      }
      if (!Array.isArray(cleanedData.amenities)) {
        validationErrors.push('Las amenidades deben ser un array');
      }
      if (!cleanedData.propertyType || !['entire_place', 'private_room', 'shared_room'].includes(cleanedData.propertyType)) {
        validationErrors.push('El tipo de propiedad es inválido');
      }
      if (!cleanedData.roomType || !['apartment', 'house', 'villa', 'loft', 'cabin', 'hotel', 'cottage', 'castle'].includes(cleanedData.roomType)) {
        validationErrors.push('El tipo de alojamiento es inválido');
      }

      if (validationErrors.length > 0) {
        console.error('❌ [FORM] Errores de validación:', validationErrors);
        toast.error(`Errores de validación: ${validationErrors.join(', ')}`);
        setIsSaving(false);
        return;
      }

      console.log('📤 [FORM] JSON completo (limpiado y validado):', JSON.stringify(cleanedData, null, 2));
      console.log('✅ [FORM] Todos los campos requeridos están presentes y válidos');
      
      // Log detallado de cada objeto antes de enviar
      console.log('🔍 [FORM] Verificación detallada antes de enviar:');
      console.log('  📍 location:', {
        exists: !!cleanedData.location,
        city: cleanedData.location?.city,
        country: cleanedData.location?.country,
        hasCoordinates: !!cleanedData.location?.coordinates,
        coordinates: cleanedData.location?.coordinates,
        keys: cleanedData.location ? Object.keys(cleanedData.location) : [],
      });
      console.log('  💰 pricing:', {
        exists: !!cleanedData.pricing,
        basePrice: cleanedData.pricing?.basePrice,
        currency: cleanedData.pricing?.currency,
        keys: cleanedData.pricing ? Object.keys(cleanedData.pricing) : [],
      });
      console.log('  👥 capacity:', {
        exists: !!cleanedData.capacity,
        guests: cleanedData.capacity?.guests,
        bedrooms: cleanedData.capacity?.bedrooms,
        beds: cleanedData.capacity?.beds,
        bathrooms: cleanedData.capacity?.bathrooms,
        keys: cleanedData.capacity ? Object.keys(cleanedData.capacity) : [],
      });
      console.log('  📅 availability:', {
        exists: !!cleanedData.availability,
        minNights: cleanedData.availability?.minNights,
        maxNights: cleanedData.availability?.maxNights,
        instantBook: cleanedData.availability?.instantBook,
        keys: cleanedData.availability ? Object.keys(cleanedData.availability) : [],
      });
      console.log('  🏠 propertyType:', cleanedData.propertyType);
      console.log('  🛏️ roomType:', cleanedData.roomType);
      console.log('  🖼️ images:', Array.isArray(cleanedData.images) ? cleanedData.images.length : 'NO ES ARRAY');
      console.log('  ⭐ amenities:', Array.isArray(cleanedData.amenities) ? cleanedData.amenities.length : 'NO ES ARRAY');
      console.log('  👤 host:', (cleanedData as any).host ? {
        id: (cleanedData as any).host.id,
        name: (cleanedData as any).host.name,
        email: (cleanedData as any).host.email,
      } : 'NO EXISTE');

      console.log('🚀 [FORM] Llamando a PropertyService.createProperty...');
      const response = await PropertyService.createProperty(cleanedData);
      console.log('📥 [FORM] Respuesta recibida:', response);

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

  const handleImagesChange = (newImages: string[]) => {
      setFormData(prev => ({
        ...prev,
      images: newImages,
      }));
  };

  const handleGetCoordinates = async () => {
    // Validar que al menos ciudad y país estén completos
    if (!formData.location.city || !formData.location.country) {
      toast.error('Por favor, completa al menos la ciudad y el país antes de obtener coordenadas');
      return;
    }

    // Construir dirección completa
    const address = buildAddress(
      formData.location.city,
      formData.location.country,
      formData.location.address,
      formData.location.region
    );

    setIsGeocoding(true);
    try {
      const coordinates = await geocodeAddress(address);
      
      if (coordinates) {
    setFormData(prev => ({
      ...prev,
          location: {
            ...prev.location,
            coordinates: {
              lat: coordinates.lat,
              lng: coordinates.lng,
            },
          },
        }));
        toast.success(`Coordenadas obtenidas: ${coordinates.displayName || 'Ubicación encontrada'}`);
      } else {
        // Mensaje más útil con sugerencias
        const suggestions = [];
        if (!formData.location.address) {
          suggestions.push('agregar una dirección específica');
        }
        if (!formData.location.region) {
          suggestions.push('agregar la región o provincia');
        }
        
        const suggestionText = suggestions.length > 0 
          ? ` Sugerencias: ${suggestions.join(', ')}.`
          : ' Intenta verificar que la ciudad y país estén escritos correctamente.';
        
        toast.error(`No se pudieron obtener las coordenadas para "${address}".${suggestionText}`, {
          duration: 6000,
        });
      }
    } catch (error) {
      console.error('Error obteniendo coordenadas:', error);
      toast.error('Error al obtener coordenadas. Intenta nuevamente.');
    } finally {
      setIsGeocoding(false);
    }
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

            <div className="space-y-4">
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
                    placeholder="Ej: 41.3851"
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
                    placeholder="Ej: 2.1734"
                />
              </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCoordinates}
                disabled={isGeocoding || !formData.location.city || !formData.location.country}
                className="w-full sm:w-auto"
              >
                {isGeocoding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Obteniendo coordenadas...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Obtener Coordenadas Automáticamente
                  </>
                )}
              </Button>
              
              {formData.location.coordinates.lat !== 0 && formData.location.coordinates.lng !== 0 && (
                <p className="text-xs text-gray-500">
                  ✅ Coordenadas: {formData.location.coordinates.lat.toFixed(6)}, {formData.location.coordinates.lng.toFixed(6)}
                </p>
              )}
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
            <CardDescription>Agrega imágenes de la propiedad (arrastra y suelta o haz clic para seleccionar)</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              images={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={10}
            />
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

