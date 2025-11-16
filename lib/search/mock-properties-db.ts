// lib/search/mock-properties-db.ts

import { Property, Amenity } from '@/types/search';

/**
 * BASE DE DATOS MOCK DE PROPIEDADES
 * 
 * Contexto:
 * Simula una base de datos en memoria con propiedades de alojamiento.
 * En producción, esto sería una base de datos real (PostgreSQL, MongoDB, etc.)
 * 
 * Contenido:
 * - 20 propiedades con datos realistas para testing
 * - Variedad de ubicaciones: España, Portugal, Francia, Italia, Reino Unido, Alemania, Países Bajos
 * - Diferentes tipos: villas, apartamentos, casas, cabañas
 * - Rango de precios: desde 35€ hasta 450€ por noche
 * - Amenidades variadas: wifi, piscina, playa, montaña, etc.
 * - Hosts con diferentes niveles (Superhost, regular)
 * - Ratings y reviews asociados
 * 
 * Clasificación:
 * - Casas (house): 5 propiedades
 * - Apartamentos (apartment): 13 propiedades (incluye lofts y estudios)
 * - Villas (villa): 2 propiedades
 * - Cabañas (cabin): 1 propiedad
 * 
 * Utilidades:
 * - getPropertyById(id): Obtener propiedad por ID
 * - getPropertiesByCity(city): Filtrar por ciudad
 * - getFeaturedProperties(): Obtener propiedades destacadas
 * - getPropertiesByPriceRange(min, max): Filtrar por rango de precio
 */

export const MOCK_PROPERTIES: Property[] = [
  // ESPAÑA - Barcelona
  {
    id: 'prop-001',
    title: 'Villa Mediterránea con Vista al Mar',
    description: 'Hermosa villa con impresionantes vistas al Mediterráneo. Perfecta para familias que buscan lujo y confort cerca de la playa.',
    host: {
      id: 'host-001',
      name: 'María García',
      avatar: 'https://i.pravatar.cc/150?img=45',
      isSuperhost: true,
      joinedDate: new Date('2020-03-15'),
      responseTime: '1 hora',
      responseRate: 98
    },
    location: {
      city: 'Barcelona',
      country: 'España',
      region: 'Cataluña',
      address: 'Barceloneta',
      coordinates: { lat: 41.3874, lng: 2.1901 }
    },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: {
      basePrice: 189,
      currency: 'EUR',
      cleaningFee: 50,
      serviceFee: 35,
      discounts: { weekly: 10, monthly: 20 }
    },
    capacity: {
      guests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3
    },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'beach_access', 'bbq', 'terrace', 'tv'], // Villa + Playa
    rating: {
      overall: 4.9,
      reviewCount: 156,
      breakdown: {
        cleanliness: 4.9,
        accuracy: 4.8,
        communication: 5.0,
        location: 4.9,
        checkIn: 4.9,
        value: 4.8
      }
    },
    availability: {
      minNights: 3,
      maxNights: 30,
      instantBook: true,
      checkInTime: '15:00',
      checkOutTime: '11:00'
    },
    featured: true,
    createdAt: new Date('2020-06-01'),
    updatedAt: new Date('2024-11-01')
  },

  {
    id: 'prop-002',
    title: 'Loft Moderno en El Born',
    description: 'Loft contemporáneo en el corazón del barrio gótico. Ideal para parejas que buscan estar cerca de todo.',
    host: {
      id: 'host-002',
      name: 'Carlos Ruiz',
      avatar: 'https://i.pravatar.cc/150?img=12',
      isSuperhost: false,
      joinedDate: new Date('2022-01-10')
    },
    location: {
      city: 'Barcelona',
      country: 'España',
      region: 'Cataluña',
      address: 'El Born',
      coordinates: { lat: 41.3825, lng: 2.1814 }
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment', // Loft se clasifica como apartment
    pricing: {
      basePrice: 95,
      currency: 'EUR',
      cleaningFee: 30,
      serviceFee: 18
    },
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'ac', 'workspace', 'tv', 'heating'],
    rating: {
      overall: 4.7,
      reviewCount: 89,
    },
    availability: {
      minNights: 2,
      maxNights: 90,
      instantBook: true
    },
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-10-20')
  },

  // ESPAÑA - Madrid
  {
    id: 'prop-003',
    title: 'Apartamento Elegante en Salamanca',
    description: 'Apartamento de lujo en el exclusivo barrio de Salamanca. Con todas las comodidades para una estancia perfecta.',
    host: {
      id: 'host-003',
      name: 'Ana Martínez',
      avatar: 'https://i.pravatar.cc/150?img=20',
      isSuperhost: true,
      joinedDate: new Date('2019-05-20'),
      responseTime: '30 minutos',
      responseRate: 100
    },
    location: {
      city: 'Madrid',
      country: 'España',
      region: 'Comunidad de Madrid',
      address: 'Barrio Salamanca',
      coordinates: { lat: 40.4313, lng: -3.6792 }
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 120,
      currency: 'EUR',
      cleaningFee: 40,
      serviceFee: 22
    },
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2
    },
    amenities: ['wifi', 'kitchen', 'ac', 'parking', 'workspace', 'tv', 'heating', 'washer'],
    rating: {
      overall: 4.8,
      reviewCount: 203
    },
    availability: {
      minNights: 2,
      maxNights: 60,
      instantBook: false
    },
    featured: true,
    createdAt: new Date('2019-08-01'),
    updatedAt: new Date('2024-11-05')
  },

  {
    id: 'prop-004',
    title: 'Estudio Acogedor en Malasaña',
    description: 'Estudio pequeño pero encantador en el vibrante barrio de Malasaña. Perfecto para viajeros individuales.',
    host: {
      id: 'host-004',
      name: 'David López',
      avatar: 'https://i.pravatar.cc/150?img=33',
      isSuperhost: false,
      joinedDate: new Date('2021-09-12')
    },
    location: {
      city: 'Madrid',
      country: 'España',
      region: 'Comunidad de Madrid',
      address: 'Malasaña',
      coordinates: { lat: 40.4267, lng: -3.7038 }
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 55,
      currency: 'EUR',
      cleaningFee: 20,
      serviceFee: 12
    },
    capacity: {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'heating', 'tv'],
    rating: {
      overall: 4.5,
      reviewCount: 67
    },
    availability: {
      minNights: 1,
      maxNights: 30,
      instantBook: true
    },
    createdAt: new Date('2021-11-01'),
    updatedAt: new Date('2024-09-30')
  },

  // ESPAÑA - Valencia
  {
    id: 'prop-005',
    title: 'Casa de Playa con Jardín',
    description: 'Casa espaciosa a pocos metros de la playa. Jardín privado y terraza perfecta para barbacoas.',
    host: {
      id: 'host-005',
      name: 'Laura Sánchez',
      avatar: 'https://i.pravatar.cc/150?img=48',
      isSuperhost: true,
      joinedDate: new Date('2018-04-08'),
      responseTime: '2 horas',
      responseRate: 95
    },
    location: {
      city: 'Valencia',
      country: 'España',
      region: 'Comunidad Valenciana',
      address: 'Playa de la Malvarrosa',
      coordinates: { lat: 39.4810, lng: -0.3269 }
    },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: {
      basePrice: 145,
      currency: 'EUR',
      cleaningFee: 45,
      serviceFee: 28,
      discounts: { weekly: 15 }
    },
    capacity: {
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2
    },
    amenities: ['wifi', 'kitchen', 'ac', 'parking', 'beach_access', 'bbq', 'garden', 'terrace', 'washer'],
    rating: {
      overall: 4.9,
      reviewCount: 178
    },
    availability: {
      minNights: 3,
      maxNights: 45,
      instantBook: true
    },
    featured: true,
    createdAt: new Date('2018-07-15'),
    updatedAt: new Date('2024-10-28')
  },

  // PORTUGAL - Lisboa
  {
    id: 'prop-006',
    title: 'Apartamento Histórico en Alfama',
    description: 'Encantador apartamento en el barrio más antiguo de Lisboa. Vistas al Tajo y decoración tradicional.',
    host: {
      id: 'host-006',
      name: 'João Silva',
      avatar: 'https://i.pravatar.cc/150?img=15',
      isSuperhost: true,
      joinedDate: new Date('2019-02-14'),
      responseTime: '1 hora',
      responseRate: 99
    },
    location: {
      city: 'Lisboa',
      country: 'Portugal',
      region: 'Lisboa',
      address: 'Alfama',
      coordinates: { lat: 38.7134, lng: -9.1290 }
    },
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 85,
      currency: 'EUR',
      cleaningFee: 30,
      serviceFee: 16
    },
    capacity: {
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'balcony', 'tv', 'heating'],
    rating: {
      overall: 4.8,
      reviewCount: 142
    },
    availability: {
      minNights: 2,
      maxNights: 30,
      instantBook: false
    },
    createdAt: new Date('2019-04-20'),
    updatedAt: new Date('2024-11-02')
  },

  {
    id: 'prop-007',
    title: 'Loft Moderno en Chiado',
    description: 'Loft de diseño en el corazón cultural de Lisboa. Perfecto para profesionales y creativos.',
    host: {
      id: 'host-007',
      name: 'Sofia Costa',
      avatar: 'https://i.pravatar.cc/150?img=25',
      isSuperhost: false,
      joinedDate: new Date('2021-06-05')
    },
    location: {
      city: 'Lisboa',
      country: 'Portugal',
      region: 'Lisboa',
      address: 'Chiado',
      coordinates: { lat: 38.7106, lng: -9.1418 }
    },
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment', // Loft se clasifica como apartment
    pricing: {
      basePrice: 110,
      currency: 'EUR',
      cleaningFee: 35,
      serviceFee: 20
    },
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'ac', 'workspace', 'tv', 'heating'],
    rating: {
      overall: 4.6,
      reviewCount: 78
    },
    availability: {
      minNights: 2,
      maxNights: 60,
      instantBook: true
    },
    createdAt: new Date('2021-08-10'),
    updatedAt: new Date('2024-10-15')
  },

  // FRANCIA - París
  {
    id: 'prop-008',
    title: 'Apartamento Elegante en Le Marais',
    description: 'Piso parisino clásico con techos altos y molduras originales. En el trendy barrio de Le Marais.',
    host: {
      id: 'host-008',
      name: 'Sophie Dubois',
      avatar: 'https://i.pravatar.cc/150?img=38',
      isSuperhost: true,
      joinedDate: new Date('2017-11-22'),
      responseTime: '30 minutos',
      responseRate: 100
    },
    location: {
      city: 'París',
      country: 'Francia',
      region: 'Île-de-France',
      address: 'Le Marais',
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 175,
      currency: 'EUR',
      cleaningFee: 50,
      serviceFee: 32
    },
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'heating', 'tv', 'workspace', 'washer'],
    rating: {
      overall: 4.9,
      reviewCount: 245
    },
    availability: {
      minNights: 3,
      maxNights: 30,
      instantBook: false
    },
    featured: true,
    createdAt: new Date('2018-01-15'),
    updatedAt: new Date('2024-11-08')
  },

  // ITALIA - Roma
  {
    id: 'prop-009',
    title: 'Apartamento Romano cerca del Coliseo',
    description: 'Apartamento acogedor a pasos del Coliseo. Perfecto para explorar la Roma antigua.',
    host: {
      id: 'host-009',
      name: 'Marco Rossi',
      avatar: 'https://i.pravatar.cc/150?img=56',
      isSuperhost: true,
      joinedDate: new Date('2019-08-30'),
      responseTime: '2 horas',
      responseRate: 97
    },
    location: {
      city: 'Roma',
      country: 'Italia',
      region: 'Lazio',
      address: 'Monti',
      coordinates: { lat: 41.8933, lng: 12.4829 }
    },
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 130,
      currency: 'EUR',
      cleaningFee: 40,
      serviceFee: 24
    },
    capacity: {
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'heating'],
    rating: {
      overall: 4.7,
      reviewCount: 167
    },
    availability: {
      minNights: 2,
      maxNights: 21,
      instantBook: true
    },
    createdAt: new Date('2019-10-01'),
    updatedAt: new Date('2024-10-25')
  },

  // REINO UNIDO - Londres
  {
    id: 'prop-010',
    title: 'Loft Industrial en Shoreditch',
    description: 'Loft con carácter en el corazón creativo de Londres. Ideal para amantes del arte y diseño.',
    host: {
      id: 'host-010',
      name: 'Emma Thompson',
      avatar: 'https://i.pravatar.cc/150?img=42',
      isSuperhost: false,
      joinedDate: new Date('2020-05-18')
    },
    location: {
      city: 'Londres',
      country: 'Reino Unido',
      region: 'Inglaterra',
      address: 'Shoreditch',
      coordinates: { lat: 51.5252, lng: -0.0825 }
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment', // Loft se clasifica como apartment
    pricing: {
      basePrice: 165,
      currency: 'GBP',
      cleaningFee: 45,
      serviceFee: 30
    },
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'heating', 'workspace', 'tv', 'washer'],
    rating: {
      overall: 4.6,
      reviewCount: 92
    },
    availability: {
      minNights: 2,
      maxNights: 90,
      instantBook: true
    },
    createdAt: new Date('2020-07-10'),
    updatedAt: new Date('2024-10-18')
  },

  // Continuaré con más propiedades...
  // ALEMANIA - Berlín
  {
    id: 'prop-011',
    title: 'Apartamento Minimalista en Kreuzberg',
    description: 'Diseño minimalista alemán en el vibrante barrio de Kreuzberg. Perfecto para viajeros modernos.',
    host: {
      id: 'host-011',
      name: 'Hans Mueller',
      avatar: 'https://i.pravatar.cc/150?img=60',
      isSuperhost: true,
      joinedDate: new Date('2018-09-20'),
      responseTime: '1 hora',
      responseRate: 98
    },
    location: {
      city: 'Berlín',
      country: 'Alemania',
      region: 'Berlín',
      address: 'Kreuzberg',
      coordinates: { lat: 52.5200, lng: 13.4050 }
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 95,
      currency: 'EUR',
      cleaningFee: 35,
      serviceFee: 18
    },
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'heating', 'workspace', 'tv', 'washer'],
    rating: {
      overall: 4.8,
      reviewCount: 134
    },
    availability: {
      minNights: 2,
      maxNights: 60,
      instantBook: true
    },
    createdAt: new Date('2018-11-05'),
    updatedAt: new Date('2024-10-22')
  },

  // PAÍSES BAJOS - Ámsterdam
  {
    id: 'prop-012',
    title: 'Casa Canal Típica Holandesa',
    description: 'Auténtica casa junto al canal en el centro de Ámsterdam. Experiencia holandesa única.',
    host: {
      id: 'host-012',
      name: 'Anna van Dijk',
      avatar: 'https://i.pravatar.cc/150?img=52',
      isSuperhost: true,
      joinedDate: new Date('2017-03-12'),
      responseTime: '30 minutos',
      responseRate: 100
    },
    location: {
      city: 'Ámsterdam',
      country: 'Países Bajos',
      region: 'Noord-Holland',
      address: 'Jordaan',
      coordinates: { lat: 52.3676, lng: 4.8831 }
    },
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: {
      basePrice: 210,
      currency: 'EUR',
      cleaningFee: 60,
      serviceFee: 38,
      discounts: { weekly: 10 }
    },
    capacity: {
      guests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2
    },
    amenities: ['wifi', 'kitchen', 'heating', 'tv', 'washer', 'dryer', 'balcony'],
    rating: {
      overall: 4.9,
      reviewCount: 201
    },
    availability: {
      minNights: 3,
      maxNights: 30,
      instantBook: false
    },
    featured: true,
    createdAt: new Date('2017-06-01'),
    updatedAt: new Date('2024-11-10')
  },

  // ESPAÑA - Sevilla
  {
    id: 'prop-013',
    title: 'Casa Andaluza con Patio',
    description: 'Casa típica sevillana con hermoso patio interior. Arquitectura andaluza tradicional.',
    host: {
      id: 'host-013',
      name: 'Carmen Fernández',
      avatar: 'https://i.pravatar.cc/150?img=28',
      isSuperhost: true,
      joinedDate: new Date('2019-04-08')
    },
    location: {
      city: 'Sevilla',
      country: 'España',
      region: 'Andalucía',
      address: 'Santa Cruz',
      coordinates: { lat: 37.3886, lng: -5.9923 }
    },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: {
      basePrice: 135,
      currency: 'EUR',
      cleaningFee: 45,
      serviceFee: 25
    },
    capacity: {
      guests: 5,
      bedrooms: 3,
      beds: 3,
      bathrooms: 2
    },
    amenities: ['wifi', 'kitchen', 'ac', 'terrace', 'tv', 'heating', 'washer'],
    rating: {
      overall: 4.8,
      reviewCount: 156
    },
    availability: {
      minNights: 2,
      maxNights: 30,
      instantBook: true
    },
    createdAt: new Date('2019-06-15'),
    updatedAt: new Date('2024-11-01')
  },

  // ITALIA - Florencia
  {
    id: 'prop-014',
    title: 'Apartamento Toscano con Vista al Duomo',
    description: 'Vistas espectaculares a la catedral de Florencia. Decoración elegante y ubicación inmejorable.',
    host: {
      id: 'host-014',
      name: 'Giulia Bianchi',
      avatar: 'https://i.pravatar.cc/150?img=31',
      isSuperhost: true,
      joinedDate: new Date('2018-02-28'),
      responseTime: '1 hora',
      responseRate: 99
    },
    location: {
      city: 'Florencia',
      country: 'Italia',
      region: 'Toscana',
      address: 'Centro Storico',
      coordinates: { lat: 43.7696, lng: 11.2558 }
    },
    images: [
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 155,
      currency: 'EUR',
      cleaningFee: 45,
      serviceFee: 28
    },
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'ac', 'balcony', 'tv', 'heating'],
    rating: {
      overall: 4.9,
      reviewCount: 189
    },
    availability: {
      minNights: 2,
      maxNights: 21,
      instantBook: false
    },
    featured: true,
    createdAt: new Date('2018-05-10'),
    updatedAt: new Date('2024-11-03')
  },

  // PORTUGAL - Porto
  {
    id: 'prop-015',
    title: 'Casa con Vista al Río Duero',
    description: 'Hermosa casa con vistas panorámicas al río Duero. Terraza perfecta para el atardecer.',
    host: {
      id: 'host-015',
      name: 'Pedro Santos',
      avatar: 'https://i.pravatar.cc/150?img=68',
      isSuperhost: false,
      joinedDate: new Date('2020-08-14')
    },
    location: {
      city: 'Porto',
      country: 'Portugal',
      region: 'Porto',
      address: 'Ribeira',
      coordinates: { lat: 41.1579, lng: -8.6291 }
    },
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: {
      basePrice: 125,
      currency: 'EUR',
      cleaningFee: 40,
      serviceFee: 23
    },
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 2
    },
    amenities: ['wifi', 'kitchen', 'terrace', 'tv', 'heating', 'washer'],
    rating: {
      overall: 4.7,
      reviewCount: 98
    },
    availability: {
      minNights: 2,
      maxNights: 45,
      instantBook: true
    },
    createdAt: new Date('2020-10-20'),
    updatedAt: new Date('2024-10-28')
  },

  // Más propiedades económicas
  {
    id: 'prop-016',
    title: 'Habitación Privada en Casa Compartida',
    description: 'Habitación acogedora en casa compartida con otros viajeros. Ambiente internacional.',
    host: {
      id: 'host-016',
      name: 'Luis Rodríguez',
      avatar: 'https://i.pravatar.cc/150?img=14',
      isSuperhost: false,
      joinedDate: new Date('2021-03-25')
    },
    location: {
      city: 'Barcelona',
      country: 'España',
      region: 'Cataluña',
      address: 'Gràcia',
      coordinates: { lat: 41.4036, lng: 2.1573 }
    },
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800'
    ],
    propertyType: 'private_room',
    roomType: 'house', // Casa compartida = house
    pricing: {
      basePrice: 35,
      currency: 'EUR',
      cleaningFee: 15,
      serviceFee: 8
    },
    capacity: {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'heating', 'tv'],
    rating: {
      overall: 4.4,
      reviewCount: 52
    },
    availability: {
      minNights: 1,
      maxNights: 30,
      instantBook: true
    },
    createdAt: new Date('2021-05-10'),
    updatedAt: new Date('2024-10-12')
  },

  {
    id: 'prop-017',
    title: 'Estudio Económico Centro Madrid',
    description: 'Estudio básico pero limpio en el centro de Madrid. Perfecto para viajeros con presupuesto.',
    host: {
      id: 'host-017',
      name: 'Isabel García',
      avatar: 'https://i.pravatar.cc/150?img=47',
      isSuperhost: false,
      joinedDate: new Date('2022-01-15')
    },
    location: {
      city: 'Madrid',
      country: 'España',
      region: 'Comunidad de Madrid',
      address: 'Sol',
      coordinates: { lat: 40.4168, lng: -3.7038 }
    },
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 45,
      currency: 'EUR',
      cleaningFee: 20,
      serviceFee: 10
    },
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'heating'],
    rating: {
      overall: 4.3,
      reviewCount: 78
    },
    availability: {
      minNights: 1,
      maxNights: 14,
      instantBook: true
    },
    createdAt: new Date('2022-03-01'),
    updatedAt: new Date('2024-09-20')
  },

  // Propiedades premium/lujo
  {
    id: 'prop-018',
    title: 'Villa de Lujo con Piscina Infinita',
    description: 'Villa exclusiva con piscina infinita y vistas al Mediterráneo. Servicio de conserjería incluido.',
    host: {
      id: 'host-018',
      name: 'Ricardo Pérez',
      avatar: 'https://i.pravatar.cc/150?img=8',
      isSuperhost: true,
      joinedDate: new Date('2016-06-10'),
      responseTime: '15 minutos',
      responseRate: 100
    },
    location: {
      city: 'Marbella',
      country: 'España',
      region: 'Andalucía',
      address: 'Puerto Banús',
      coordinates: { lat: 36.4907, lng: -4.9538 }
    },
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: {
      basePrice: 450,
      currency: 'EUR',
      cleaningFee: 120,
      serviceFee: 85,
      discounts: { weekly: 15, monthly: 25 }
    },
    capacity: {
      guests: 10,
      bedrooms: 5,
      beds: 6,
      bathrooms: 4
    },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'gym', 'hot_tub', 'beach_access', 'bbq', 'garden', 'terrace', 'tv', 'washer', 'dryer'], // Villa + Playa
    rating: {
      overall: 5.0,
      reviewCount: 87
    },
    availability: {
      minNights: 7,
      maxNights: 90,
      instantBook: false
    },
    featured: true,
    createdAt: new Date('2016-08-20'),
    updatedAt: new Date('2024-11-12')
  },

  {
    id: 'prop-019',
    title: 'Penthouse Exclusivo con Terraza',
    description: 'Ático de lujo con terraza de 150m². Vistas panorámicas de la ciudad.',
    host: {
      id: 'host-019',
      name: 'Victoria Romero',
      avatar: 'https://i.pravatar.cc/150?img=36',
      isSuperhost: true,
      joinedDate: new Date('2017-09-18'),
      responseTime: '30 minutos',
      responseRate: 100
    },
    location: {
      city: 'Barcelona',
      country: 'España',
      region: 'Cataluña',
      address: 'Eixample',
      coordinates: { lat: 41.3929, lng: 2.1647 }
    },
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: {
      basePrice: 320,
      currency: 'EUR',
      cleaningFee: 80,
      serviceFee: 60
    },
    capacity: {
      guests: 6,
      bedrooms: 3,
      beds: 3,
      bathrooms: 3
    },
    amenities: ['wifi', 'kitchen', 'ac', 'parking', 'gym', 'terrace', 'tv', 'workspace', 'washer', 'dryer'],
    rating: {
      overall: 4.9,
      reviewCount: 123
    },
    availability: {
      minNights: 3,
      maxNights: 60,
      instantBook: false
    },
    featured: true,
    createdAt: new Date('2017-11-01'),
    updatedAt: new Date('2024-11-08')
  },

  // Propiedades adicionales para mayor variedad
  {
    id: 'prop-020',
    title: 'Cabaña Rústica en la Montaña',
    description: 'Cabaña acogedora en los Pirineos. Perfecta para esquiar en invierno o hacer senderismo en verano.',
    host: {
      id: 'host-020',
      name: 'Javier Morales',
      avatar: 'https://i.pravatar.cc/150?img=70',
      isSuperhost: true,
      joinedDate: new Date('2018-12-05')
    },
    location: {
      city: 'Jaca',
      country: 'España',
      region: 'Aragón',
      address: 'Valle de Tena',
      coordinates: { lat: 42.5700, lng: -0.5508 }
    },
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800'
    ],
    propertyType: 'entire_place',
    roomType: 'cabin',
    pricing: {
      basePrice: 105,
      currency: 'EUR',
      cleaningFee: 35,
      serviceFee: 20
    },
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1
    },
    amenities: ['wifi', 'kitchen', 'heating', 'fireplace', 'mountain_view', 'parking', 'tv'],
    rating: {
      overall: 4.8,
      reviewCount: 145
    },
    availability: {
      minNights: 2,
      maxNights: 30,
      instantBook: true
    },
    createdAt: new Date('2019-01-10'),
    updatedAt: new Date('2024-11-05')
  },
];

/**
 * Utilidades para trabajar con propiedades
 */

export function getPropertyById(id: string): Property | undefined {
  return MOCK_PROPERTIES.find(p => p.id === id);
}

export function getPropertiesByCity(city: string): Property[] {
  return MOCK_PROPERTIES.filter(p => 
    p.location.city.toLowerCase() === city.toLowerCase()
  );
}

export function getFeaturedProperties(): Property[] {
  return MOCK_PROPERTIES.filter(p => p.featured === true);
}

export function getPropertiesByPriceRange(min: number, max: number): Property[] {
  return MOCK_PROPERTIES.filter(p => 
    p.pricing.basePrice >= min && p.pricing.basePrice <= max
  );
}

if (typeof window !== 'undefined') {
  console.log('🏠 MOCK Properties Database inicializada');
  console.log(`📊 Total propiedades: ${MOCK_PROPERTIES.length}`);
  console.log(`⭐ Featured properties: ${getFeaturedProperties().length}`);
}

