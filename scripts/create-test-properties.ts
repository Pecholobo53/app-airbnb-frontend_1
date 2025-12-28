// scripts/create-test-properties.ts
/**
 * Script para crear 5 propiedades de prueba
 * Ejecutar con: npx tsx scripts/create-test-properties.ts
 */

import { PropertyService, CreatePropertyData } from '../lib/properties/property-service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Datos de las 5 propiedades de prueba
const testProperties: CreatePropertyData[] = [
  {
    title: 'Villa de Lujo con Piscina en Marbella',
    description: 'Hermosa villa moderna con piscina privada, vistas al mar y todas las comodidades. Perfecta para familias o grupos grandes. Ubicada en una de las mejores zonas de Marbella, a solo 5 minutos de la playa.',
    location: {
      city: 'Marbella',
      country: 'España',
      region: 'Andalucía',
      address: 'Calle del Mar, 123',
      coordinates: {
        lat: 36.5109,
        lng: -4.8862,
      },
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: {
      basePrice: 250,
      currency: 'EUR',
      cleaningFee: 50,
      serviceFee: 30,
    },
    capacity: {
      guests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3,
    },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'beach_access', 'tv', 'heating'],
    availability: {
      minNights: 3,
      maxNights: 30,
      instantBook: true,
      checkInTime: '15:00',
      checkOutTime: '11:00',
    },
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
  },
  {
    title: 'Apartamento Moderno en el Centro de Madrid',
    description: 'Acogedor apartamento completamente renovado en el corazón de Madrid. Cerca de los principales puntos de interés, restaurantes y transporte público. Ideal para parejas o viajeros de negocios.',
    location: {
      city: 'Madrid',
      country: 'España',
      region: 'Comunidad de Madrid',
      address: 'Calle Gran Vía, 45',
      coordinates: {
        lat: 40.4168,
        lng: -3.7038,
      },
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 120,
      currency: 'EUR',
      cleaningFee: 25,
      serviceFee: 20,
    },
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
    },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'workspace', 'heating'],
    availability: {
      minNights: 2,
      maxNights: 90,
      instantBook: true,
      checkInTime: '14:00',
      checkOutTime: '11:00',
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260256-1c1ef2d93688?w=800',
    ],
  },
  {
    title: 'Casa Rústica en la Montaña - Pirineos',
    description: 'Encantadora casa de piedra restaurada en los Pirineos. Rodeada de naturaleza, perfecta para desconectar y disfrutar del senderismo. Chimenea, jardín privado y vistas espectaculares a las montañas.',
    location: {
      city: 'Jaca',
      country: 'España',
      region: 'Aragón',
      address: 'Carretera de la Montaña, km 12',
      coordinates: {
        lat: 42.5700,
        lng: -0.5500,
      },
    },
    propertyType: 'entire_place',
    roomType: 'cottage',
    pricing: {
      basePrice: 95,
      currency: 'EUR',
      cleaningFee: 30,
      serviceFee: 15,
    },
    capacity: {
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
    },
    amenities: ['wifi', 'kitchen', 'fireplace', 'heating', 'mountain_view', 'parking', 'garden'],
    availability: {
      minNights: 2,
      maxNights: 60,
      instantBook: false,
      checkInTime: '16:00',
      checkOutTime: '10:00',
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
  },
  {
    title: 'Loft Industrial en Barcelona - El Born',
    description: 'Espacioso loft en el barrio más trendy de Barcelona. Diseño industrial con techos altos, grandes ventanales y decoración moderna. A pocos pasos de restaurantes, bares y la playa.',
    location: {
      city: 'Barcelona',
      country: 'España',
      region: 'Cataluña',
      address: 'Calle del Born, 28',
      coordinates: {
        lat: 41.3851,
        lng: 2.1734,
      },
    },
    propertyType: 'entire_place',
    roomType: 'loft',
    pricing: {
      basePrice: 180,
      currency: 'EUR',
      cleaningFee: 40,
      serviceFee: 25,
    },
    capacity: {
      guests: 4,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
    },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'workspace', 'balcony', 'heating'],
    availability: {
      minNights: 2,
      maxNights: 30,
      instantBook: true,
      checkInTime: '15:00',
      checkOutTime: '11:00',
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260256-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
    ],
  },
  {
    title: 'Cabaña Acogedora junto al Lago',
    description: 'Pequeña cabaña de madera con encanto junto a un lago tranquilo. Perfecta para una escapada romántica o para relajarse en la naturaleza. Terraza privada con vistas al lago y barbacoa.',
    location: {
      city: 'Sanabria',
      country: 'España',
      region: 'Castilla y León',
      address: 'Lago de Sanabria, Zona Norte',
      coordinates: {
        lat: 42.1234,
        lng: -6.7890,
      },
    },
    propertyType: 'entire_place',
    roomType: 'cabin',
    pricing: {
      basePrice: 75,
      currency: 'EUR',
      cleaningFee: 20,
      serviceFee: 15,
    },
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    amenities: ['wifi', 'kitchen', 'fireplace', 'heating', 'mountain_view', 'bbq', 'garden'],
    availability: {
      minNights: 2,
      maxNights: 14,
      instantBook: false,
      checkInTime: '15:00',
      checkOutTime: '11:00',
    },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800',
    ],
  },
];

async function createProperties() {
  console.log('🚀 Iniciando creación de propiedades de prueba...\n');

  // Obtener token de sesión
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('airbnb_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        token = parsed.token || parsed.accessToken;
      } catch (e) {
        console.error('Error parseando sesión:', e);
      }
    }
  }

  if (!token) {
    console.error('❌ No se encontró token de autenticación. Por favor, inicia sesión primero.');
    console.log('💡 Ejecuta este script desde el navegador después de iniciar sesión como administrador.');
    return;
  }

  const results = [];

  for (let i = 0; i < testProperties.length; i++) {
    const property = testProperties[i];
    console.log(`\n📝 Creando propiedad ${i + 1}/5: ${property.title}`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(property),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`✅ Propiedad creada exitosamente: ${data.data?.id || 'ID no disponible'}`);
        results.push({ success: true, property: property.title, data: data.data });
      } else {
        console.error(`❌ Error: ${data.error?.message || data.message || 'Error desconocido'}`);
        results.push({ success: false, property: property.title, error: data.error?.message || data.message });
      }
    } catch (error) {
      console.error(`❌ Error de red: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      results.push({ success: false, property: property.title, error: error instanceof Error ? error.message : 'Error de red' });
    }
  }

  console.log('\n📊 Resumen de creación:');
  console.log('='.repeat(50));
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.property}: ${result.success ? '✅ Creada' : '❌ Error'}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ ${successCount}/5 propiedades creadas exitosamente`);
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  createProperties().catch(console.error);
}

export { createProperties, testProperties };

