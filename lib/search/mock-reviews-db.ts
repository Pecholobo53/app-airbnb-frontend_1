// lib/search/mock-reviews-db.ts

import { Review } from '@/types/search';

/**
 * BASE DE DATOS MOCK DE REVIEWS
 * 
 * Contexto:
 * Simula una base de datos en memoria con reviews/reseñas de propiedades.
 * En producción, esto sería una base de datos real vinculada a propiedades y usuarios.
 * 
 * Contenido:
 * - 50 reviews distribuidas entre las primeras 10 propiedades (prop-001 a prop-010)
 * - 5 reviews por propiedad para tener datos suficientes para estadísticas
 * - Ratings del 1 al 5 estrellas
 * - Comentarios realistas en español
 * - Categorías de calificación: limpieza, precisión, comunicación, ubicación, check-in, valor
 * - Fechas de review variadas (últimos 6 meses)
 * - Usuarios con nombres y avatares variados
 * 
 * Estructura de Review:
 * - id: Identificador único
 * - propertyId: ID de la propiedad (vinculado a MOCK_PROPERTIES)
 * - userId: ID del usuario que hizo la review
 * - userName: Nombre del usuario
 * - userAvatar: Avatar del usuario
 * - rating: Calificación general (1-5)
 * - categories: Desglose por categorías (opcional)
 * - comment: Comentario del usuario
 * - date: Fecha de la review
 * - helpful: Número de "útil" recibidos
 * 
 * Utilidades:
 * - getReviewsByPropertyId(propertyId): Obtener todas las reviews de una propiedad
 * - getReviewStats(propertyId): Calcular estadísticas (promedio, categorías)
 * - getReviewById(reviewId): Obtener una review específica por ID
 */

export const MOCK_REVIEWS: Review[] = [
  // REVIEWS PARA prop-001 (Barcelona Villa - 4.9 stars)
  {
    id: 'rev-001',
    propertyId: 'prop-001',
    userId: 'user-001',
    userName: 'Sophie Martin',
    userAvatar: 'https://i.pravatar.cc/150?img=47',
    rating: 5,
    comment: '¡Increíble! La villa supera todas las expectativas. Las vistas al mar son espectaculares y la casa está impecable. María fue una anfitriona excepcional, siempre atenta a nuestras necesidades. Definitivamente volveremos.',
    date: new Date('2024-10-15'),
    helpful: 24,
    categories: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      checkIn: 5.0,
      value: 4.8
    }
  },
  {
    id: 'rev-002',
    propertyId: 'prop-001',
    userId: 'user-002',
    userName: 'James Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=13',
    rating: 5,
    comment: 'Perfect location near the beach. The house is spacious and has everything you need. The pool area is beautiful. Highly recommended for families!',
    date: new Date('2024-09-22'),
    helpful: 18,
    categories: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 5.0,
      location: 5.0,
      checkIn: 4.9,
      value: 4.7
    }
  },
  {
    id: 'rev-003',
    propertyId: 'prop-001',
    userId: 'user-003',
    userName: 'Laura González',
    userAvatar: 'https://i.pravatar.cc/150?img=32',
    rating: 4.8,
    comment: 'Una estancia maravillosa. La casa es aún mejor que en las fotos. Solo un pequeño detalle: el WiFi podría ser más rápido. Por lo demás, todo perfecto.',
    date: new Date('2024-08-30'),
    helpful: 12,
    categories: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 5.0,
      location: 4.9,
      checkIn: 4.8,
      value: 4.6
    }
  },
  {
    id: 'rev-004',
    propertyId: 'prop-001',
    userId: 'user-004',
    userName: 'Michael Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=51',
    rating: 5,
    comment: 'Outstanding property! Clean, comfortable, and the terrace is perfect for evening dinners. María provided excellent local recommendations.',
    date: new Date('2024-07-18'),
    helpful: 15,
    categories: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 4.8,
      checkIn: 5.0,
      value: 4.9
    }
  },
  {
    id: 'rev-005',
    propertyId: 'prop-001',
    userId: 'user-005',
    userName: 'Emma Schmidt',
    userAvatar: 'https://i.pravatar.cc/150?img=44',
    rating: 4.9,
    comment: 'Wunderschönes Haus mit tollem Meerblick! Die Lage ist perfekt für einen Strandurlaub. Sehr sauber und gut ausgestattet.',
    date: new Date('2024-06-25'),
    helpful: 9,
    categories: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 4.9,
      location: 5.0,
      checkIn: 4.8,
      value: 4.8
    }
  },

  // REVIEWS PARA prop-002 (Barcelona Loft - 4.5 stars)
  {
    id: 'rev-006',
    propertyId: 'prop-002',
    userId: 'user-006',
    userName: 'Anna Rossi',
    userAvatar: 'https://i.pravatar.cc/150?img=25',
    rating: 4.5,
    comment: 'Loft moderno en el corazón del Born. Ubicación perfecta para explorar Barcelona. Espacioso y bien decorado. El único inconveniente es que puede ser ruidoso por la noche debido a los bares cercanos.',
    date: new Date('2024-10-08'),
    helpful: 7,
    categories: {
      cleanliness: 4.5,
      accuracy: 4.6,
      communication: 4.4,
      location: 5.0,
      checkIn: 4.3,
      value: 4.5
    }
  },
  {
    id: 'rev-007',
    propertyId: 'prop-002',
    userId: 'user-007',
    userName: 'David Brown',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    rating: 4.2,
    comment: 'Good location and nice space. A bit noisy at night but that comes with being in the city center. Overall satisfied with our stay.',
    date: new Date('2024-09-14'),
    helpful: 5,
    categories: {
      cleanliness: 4.3,
      accuracy: 4.5,
      communication: 4.0,
      location: 5.0,
      checkIn: 4.2,
      value: 4.0
    }
  },
  {
    id: 'rev-008',
    propertyId: 'prop-002',
    userId: 'user-008',
    userName: 'Marie Dupont',
    userAvatar: 'https://i.pravatar.cc/150?img=38',
    rating: 4.8,
    comment: 'Superbe loft! Très bien situé, proche de tout. Carlos a été très réactif. Je recommande vivement pour un séjour à Barcelone.',
    date: new Date('2024-08-20'),
    helpful: 11,
    categories: {
      cleanliness: 4.7,
      accuracy: 4.8,
      communication: 4.9,
      location: 5.0,
      checkIn: 4.6,
      value: 4.7
    }
  },
  {
    id: 'rev-009',
    propertyId: 'prop-002',
    userId: 'user-009',
    userName: 'Luis Fernández',
    userAvatar: 'https://i.pravatar.cc/150?img=52',
    rating: 4.6,
    comment: 'Loft muy bien ubicado y con todas las comodidades. Perfecto para parejas. La terraza es pequeña pero acogedora.',
    date: new Date('2024-07-05'),
    helpful: 6,
    categories: {
      cleanliness: 4.6,
      accuracy: 4.7,
      communication: 4.5,
      location: 4.9,
      checkIn: 4.4,
      value: 4.6
    }
  },
  {
    id: 'rev-010',
    propertyId: 'prop-002',
    userId: 'user-010',
    userName: 'Sarah Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=29',
    rating: 4.4,
    comment: 'Nice place in great location. Check-in was a bit confusing but Carlos helped us quickly. Would stay again.',
    date: new Date('2024-06-12'),
    helpful: 4,
    categories: {
      cleanliness: 4.5,
      accuracy: 4.4,
      communication: 4.3,
      location: 4.8,
      checkIn: 4.0,
      value: 4.5
    }
  },

  // REVIEWS PARA prop-003 (Madrid Centro - 4.3 stars)
  {
    id: 'rev-011',
    propertyId: 'prop-003',
    userId: 'user-011',
    userName: 'Paolo Bianchi',
    userAvatar: 'https://i.pravatar.cc/150?img=14',
    rating: 4.5,
    comment: 'Estudio económico muy cerca del centro. Tiene todo lo necesario. Ideal para estancias cortas. Muy buena relación calidad-precio.',
    date: new Date('2024-10-01'),
    helpful: 8,
    categories: {
      cleanliness: 4.4,
      accuracy: 4.5,
      communication: 4.3,
      location: 4.7,
      checkIn: 4.2,
      value: 4.8
    }
  },
  {
    id: 'rev-012',
    propertyId: 'prop-003',
    userId: 'user-012',
    userName: 'Nina Petrov',
    userAvatar: 'https://i.pravatar.cc/150?img=41',
    rating: 4.0,
    comment: 'Decent place for the price. Location is convenient. The space is compact but functional. Host was responsive.',
    date: new Date('2024-09-08'),
    helpful: 3,
    categories: {
      cleanliness: 4.0,
      accuracy: 4.1,
      communication: 4.2,
      location: 4.5,
      checkIn: 3.9,
      value: 4.3
    }
  },
  {
    id: 'rev-013',
    propertyId: 'prop-003',
    userId: 'user-013',
    userName: 'Carlos Mendoza',
    userAvatar: 'https://i.pravatar.cc/150?img=56',
    rating: 4.4,
    comment: 'Perfecto para viaje de trabajo. Ubicación céntrica y buen precio. El estudio es pequeño pero tiene todo lo necesario.',
    date: new Date('2024-08-15'),
    helpful: 5,
    categories: {
      cleanliness: 4.3,
      accuracy: 4.4,
      communication: 4.5,
      location: 4.6,
      checkIn: 4.3,
      value: 4.7
    }
  },
  {
    id: 'rev-014',
    propertyId: 'prop-003',
    userId: 'user-014',
    userName: 'Helena Costa',
    userAvatar: 'https://i.pravatar.cc/150?img=22',
    rating: 4.3,
    comment: 'Bom apartamento para o preço. Localização excelente. Poderia ser um pouco mais limpo, mas no geral foi bom.',
    date: new Date('2024-07-22'),
    helpful: 4,
    categories: {
      cleanliness: 3.9,
      accuracy: 4.4,
      communication: 4.3,
      location: 4.8,
      checkIn: 4.2,
      value: 4.6
    }
  },
  {
    id: 'rev-015',
    propertyId: 'prop-003',
    userId: 'user-015',
    userName: 'Tom Anderson',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    rating: 4.5,
    comment: 'Great value for money! Perfect location to explore Madrid. Small but cozy. Would recommend for solo travelers.',
    date: new Date('2024-06-30'),
    helpful: 6,
    categories: {
      cleanliness: 4.4,
      accuracy: 4.6,
      communication: 4.4,
      location: 4.9,
      checkIn: 4.3,
      value: 4.8
    }
  },

  // REVIEWS PARA prop-004 (París Loft - 4.6 stars)
  {
    id: 'rev-016',
    propertyId: 'prop-004',
    userId: 'user-016',
    userName: 'Isabella Rodriguez',
    userAvatar: 'https://i.pravatar.cc/150?img=48',
    rating: 4.7,
    comment: 'Loft encantador en el corazón de París. La decoración es moderna y el espacio es perfecto para una pareja. La ubicación es excelente, cerca de todo.',
    date: new Date('2024-10-10'),
    helpful: 15,
    categories: {
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.6,
      location: 5.0,
      checkIn: 4.5,
      value: 4.6
    }
  },
  {
    id: 'rev-017',
    propertyId: 'prop-004',
    userId: 'user-017',
    userName: 'Pierre Dubois',
    userAvatar: 'https://i.pravatar.cc/150?img=19',
    rating: 4.5,
    comment: 'Très bel appartement! Bien situé et propre. Parfait pour découvrir Paris. L\'hôte était très réactif.',
    date: new Date('2024-09-18'),
    helpful: 12,
    categories: {
      cleanliness: 4.6,
      accuracy: 4.5,
      communication: 4.7,
      location: 4.9,
      checkIn: 4.4,
      value: 4.5
    }
  },
  {
    id: 'rev-018',
    propertyId: 'prop-004',
    userId: 'user-018',
    userName: 'Emma Thompson',
    userAvatar: 'https://i.pravatar.cc/150?img=27',
    rating: 4.6,
    comment: 'Lovely loft in a great location! The apartment is well-equipped and the host was very helpful. Would definitely stay again.',
    date: new Date('2024-08-25'),
    helpful: 9,
    categories: {
      cleanliness: 4.7,
      accuracy: 4.6,
      communication: 4.8,
      location: 5.0,
      checkIn: 4.5,
      value: 4.6
    }
  },
  {
    id: 'rev-019',
    propertyId: 'prop-004',
    userId: 'user-019',
    userName: 'Marco Rossi',
    userAvatar: 'https://i.pravatar.cc/150?img=16',
    rating: 4.8,
    comment: 'Ottimo loft! Posizione perfetta per visitare Parigi. L\'appartamento è moderno e confortevole. Consigliato!',
    date: new Date('2024-07-12'),
    helpful: 7,
    categories: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 4.7,
      location: 5.0,
      checkIn: 4.6,
      value: 4.7
    }
  },
  {
    id: 'rev-020',
    propertyId: 'prop-004',
    userId: 'user-020',
    userName: 'Sofia Martinez',
    userAvatar: 'https://i.pravatar.cc/150?img=35',
    rating: 4.4,
    comment: 'Buen loft en París. La ubicación es perfecta y el espacio es cómodo. El único detalle es que puede ser un poco ruidoso por la noche.',
    date: new Date('2024-06-20'),
    helpful: 5,
    categories: {
      cleanliness: 4.5,
      accuracy: 4.4,
      communication: 4.3,
      location: 4.8,
      checkIn: 4.2,
      value: 4.5
    }
  },

  // REVIEWS PARA prop-005 (Londres Casa - 4.7 stars)
  {
    id: 'rev-021',
    propertyId: 'prop-005',
    userId: 'user-021',
    userName: 'Oliver Brown',
    userAvatar: 'https://i.pravatar.cc/150?img=17',
    rating: 4.8,
    comment: 'Beautiful house in a quiet neighborhood. Perfect for families. The garden is lovely and the house has everything you need. Highly recommended!',
    date: new Date('2024-10-05'),
    helpful: 20,
    categories: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 4.7,
      location: 4.6,
      checkIn: 4.8,
      value: 4.7
    }
  },
  {
    id: 'rev-022',
    propertyId: 'prop-005',
    userId: 'user-022',
    userName: 'Charlotte Williams',
    userAvatar: 'https://i.pravatar.cc/150?img=42',
    rating: 4.6,
    comment: 'Lovely home away from home! The house is spacious and well-maintained. Great location with easy access to public transport.',
    date: new Date('2024-09-15'),
    helpful: 14,
    categories: {
      cleanliness: 4.7,
      accuracy: 4.6,
      communication: 4.8,
      location: 4.5,
      checkIn: 4.7,
      value: 4.6
    }
  },
  {
    id: 'rev-023',
    propertyId: 'prop-005',
    userId: 'user-023',
    userName: 'Hans Mueller',
    userAvatar: 'https://i.pravatar.cc/150?img=53',
    rating: 4.7,
    comment: 'Sehr schönes Haus! Ruhige Lage, perfekt für Familien. Der Garten ist wunderbar. Sehr empfehlenswert.',
    date: new Date('2024-08-22'),
    helpful: 11,
    categories: {
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.6,
      location: 4.7,
      checkIn: 4.6,
      value: 4.7
    }
  },
  {
    id: 'rev-024',
    propertyId: 'prop-005',
    userId: 'user-024',
    userName: 'Julia Andersson',
    userAvatar: 'https://i.pravatar.cc/150?img=39',
    rating: 4.5,
    comment: 'Nice house in a good location. Clean and comfortable. The host was very responsive. Would stay again.',
    date: new Date('2024-07-30'),
    helpful: 8,
    categories: {
      cleanliness: 4.6,
      accuracy: 4.5,
      communication: 4.7,
      location: 4.6,
      checkIn: 4.4,
      value: 4.5
    }
  },
  {
    id: 'rev-025',
    propertyId: 'prop-005',
    userId: 'user-025',
    userName: 'David Lee',
    userAvatar: 'https://i.pravatar.cc/150?img=24',
    rating: 4.9,
    comment: 'Exceptional stay! The house exceeded our expectations. Beautiful garden, well-equipped kitchen, and very comfortable beds. Perfect for our family vacation.',
    date: new Date('2024-06-15'),
    helpful: 18,
    categories: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 4.8,
      location: 4.7,
      checkIn: 4.9,
      value: 4.8
    }
  },

  // REVIEWS PARA prop-006 (Roma Apartamento - 4.5 stars)
  {
    id: 'rev-026',
    propertyId: 'prop-006',
    userId: 'user-026',
    userName: 'Giulia Romano',
    userAvatar: 'https://i.pravatar.cc/150?img=36',
    rating: 4.6,
    comment: 'Appartamento delizioso nel centro di Roma! Posizione perfetta per visitare i monumenti. L\'host è stato molto disponibile.',
    date: new Date('2024-10-08'),
    helpful: 13,
    categories: {
      cleanliness: 4.7,
      accuracy: 4.6,
      communication: 4.8,
      location: 5.0,
      checkIn: 4.5,
      value: 4.6
    }
  },
  {
    id: 'rev-027',
    propertyId: 'prop-006',
    userId: 'user-027',
    userName: 'Robert Taylor',
    userAvatar: 'https://i.pravatar.cc/150?img=21',
    rating: 4.4,
    comment: 'Great apartment in the heart of Rome! Walking distance to major attractions. The place is clean and has all amenities. Highly recommend!',
    date: new Date('2024-09-20'),
    helpful: 10,
    categories: {
      cleanliness: 4.5,
      accuracy: 4.4,
      communication: 4.5,
      location: 5.0,
      checkIn: 4.3,
      value: 4.5
    }
  },
  {
    id: 'rev-028',
    propertyId: 'prop-006',
    userId: 'user-028',
    userName: 'Ana Silva',
    userAvatar: 'https://i.pravatar.cc/150?img=43',
    rating: 4.5,
    comment: 'Apartamento muito bom em Roma! Localização excelente, perto de tudo. O anfitrião foi muito atencioso. Recomendo!',
    date: new Date('2024-08-28'),
    helpful: 7,
    categories: {
      cleanliness: 4.6,
      accuracy: 4.5,
      communication: 4.6,
      location: 4.9,
      checkIn: 4.4,
      value: 4.5
    }
  },
  {
    id: 'rev-029',
    propertyId: 'prop-006',
    userId: 'user-029',
    userName: 'François Moreau',
    userAvatar: 'https://i.pravatar.cc/150?img=18',
    rating: 4.3,
    comment: 'Bon appartement dans le centre de Rome. Un peu bruyant le soir mais c\'est normal pour le centre-ville. Bon rapport qualité-prix.',
    date: new Date('2024-07-18'),
    helpful: 6,
    categories: {
      cleanliness: 4.4,
      accuracy: 4.3,
      communication: 4.4,
      location: 4.8,
      checkIn: 4.2,
      value: 4.4
    }
  },
  {
    id: 'rev-030',
    propertyId: 'prop-006',
    userId: 'user-030',
    userName: 'Yuki Tanaka',
    userAvatar: 'https://i.pravatar.cc/150?img=31',
    rating: 4.7,
    comment: '素晴らしいアパートメント！ローマの中心部にあり、観光に最適です。清潔で快適でした。',
    date: new Date('2024-06-25'),
    helpful: 9,
    categories: {
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.6,
      location: 5.0,
      checkIn: 4.5,
      value: 4.7
    }
  },

  // REVIEWS PARA prop-007 (París - 4.8 stars)
  {
    id: 'rev-031',
    propertyId: 'prop-007',
    userId: 'user-031',
    userName: 'Claire Dubois',
    userAvatar: 'https://i.pravatar.cc/150?img=48',
    rating: 5,
    comment: 'Magnifique appartement! Très bien situé, proche de tous les monuments. L\'appartement est très propre et bien équipé. Je recommande vivement!',
    date: new Date('2024-10-10'),
    helpful: 22,
    categories: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 5.0,
      location: 5.0,
      checkIn: 4.8,
      value: 4.9
    }
  },
  {
    id: 'rev-032',
    propertyId: 'prop-007',
    userId: 'user-032',
    userName: 'Robert Smith',
    userAvatar: 'https://i.pravatar.cc/150?img=16',
    rating: 4.8,
    comment: 'Great location in the heart of Paris! The apartment is exactly as described. Clean, comfortable, and the host was very responsive. Perfect for a romantic getaway.',
    date: new Date('2024-09-18'),
    helpful: 15,
    categories: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 4.9,
      location: 5.0,
      checkIn: 4.7,
      value: 4.7
    }
  },
  {
    id: 'rev-033',
    propertyId: 'prop-007',
    userId: 'user-033',
    userName: 'Isabella Rossi',
    userAvatar: 'https://i.pravatar.cc/150?img=26',
    rating: 4.7,
    comment: 'Appartamento delizioso nel cuore di Parigi! Posizione perfetta per visitare la città. Molto pulito e accogliente.',
    date: new Date('2024-08-25'),
    helpful: 12,
    categories: {
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.8,
      location: 5.0,
      checkIn: 4.6,
      value: 4.6
    }
  },
  {
    id: 'rev-034',
    propertyId: 'prop-007',
    userId: 'user-034',
    userName: 'Thomas Anderson',
    userAvatar: 'https://i.pravatar.cc/150?img=34',
    rating: 4.9,
    comment: 'Perfect stay! The location couldn\'t be better - walking distance to Louvre and Notre-Dame. The apartment is beautifully decorated and has everything you need.',
    date: new Date('2024-07-30'),
    helpful: 18,
    categories: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 5.0,
      location: 5.0,
      checkIn: 4.8,
      value: 4.8
    }
  },
  {
    id: 'rev-035',
    propertyId: 'prop-007',
    userId: 'user-035',
    userName: 'Emma Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=42',
    rating: 4.6,
    comment: 'Lovely apartment in a great location. Very clean and well-maintained. The only minor issue was the WiFi speed, but overall a wonderful experience.',
    date: new Date('2024-06-15'),
    helpful: 8,
    categories: {
      cleanliness: 4.7,
      accuracy: 4.6,
      communication: 4.7,
      location: 4.9,
      checkIn: 4.5,
      value: 4.6
    }
  },

  // REVIEWS PARA prop-008 (Londres - 4.6 stars)
  {
    id: 'rev-036',
    propertyId: 'prop-008',
    userId: 'user-036',
    userName: 'Oliver Brown',
    userAvatar: 'https://i.pravatar.cc/150?img=17',
    rating: 4.8,
    comment: 'Excellent flat in a fantastic location! Very close to the tube and all major attractions. Clean, modern, and well-equipped. Highly recommended!',
    date: new Date('2024-10-05'),
    helpful: 20,
    categories: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 4.8,
      location: 5.0,
      checkIn: 4.7,
      value: 4.7
    }
  },
  {
    id: 'rev-037',
    propertyId: 'prop-008',
    userId: 'user-037',
    userName: 'Sophia Williams',
    userAvatar: 'https://i.pravatar.cc/150?img=43',
    rating: 4.5,
    comment: 'Great place to stay in London! The flat is cozy and has everything you need. The location is perfect for exploring the city. Would stay again!',
    date: new Date('2024-09-12'),
    helpful: 14,
    categories: {
      cleanliness: 4.6,
      accuracy: 4.5,
      communication: 4.6,
      location: 4.8,
      checkIn: 4.4,
      value: 4.5
    }
  },
  {
    id: 'rev-038',
    propertyId: 'prop-008',
    userId: 'user-038',
    userName: 'Lucas Martinez',
    userAvatar: 'https://i.pravatar.cc/150?img=53',
    rating: 4.7,
    comment: 'Muy buen apartamento en Londres. Ubicación excelente, cerca del metro. Limpio y cómodo. El anfitrión fue muy atento.',
    date: new Date('2024-08-20'),
    helpful: 11,
    categories: {
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.7,
      location: 4.9,
      checkIn: 4.6,
      value: 4.6
    }
  },
  {
    id: 'rev-039',
    propertyId: 'prop-008',
    userId: 'user-039',
    userName: 'Amélie Laurent',
    userAvatar: 'https://i.pravatar.cc/150?img=49',
    rating: 4.4,
    comment: 'Bon appartement dans un bon quartier. Propre et bien situé. Parfait pour un séjour à Londres.',
    date: new Date('2024-07-28'),
    helpful: 7,
    categories: {
      cleanliness: 4.5,
      accuracy: 4.4,
      communication: 4.5,
      location: 4.7,
      checkIn: 4.3,
      value: 4.4
    }
  },
  {
    id: 'rev-040',
    propertyId: 'prop-008',
    userId: 'user-040',
    userName: 'David Lee',
    userAvatar: 'https://i.pravatar.cc/150?img=54',
    rating: 4.6,
    comment: 'Nice flat in a convenient location. Clean and well-maintained. The host was responsive and helpful. Good value for money.',
    date: new Date('2024-06-10'),
    helpful: 9,
    categories: {
      cleanliness: 4.7,
      accuracy: 4.6,
      communication: 4.6,
      location: 4.8,
      checkIn: 4.5,
      value: 4.6
    }
  },

  // REVIEWS PARA prop-009 (Roma - 4.7 stars)
  {
    id: 'rev-041',
    propertyId: 'prop-009',
    userId: 'user-041',
    userName: 'Giulia Bianchi',
    userAvatar: 'https://i.pravatar.cc/150?img=27',
    rating: 5,
    comment: 'Appartamento fantastico nel centro di Roma! Posizione perfetta per visitare tutti i monumenti. Molto pulito e accogliente. Consigliatissimo!',
    date: new Date('2024-10-08'),
    helpful: 25,
    categories: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      checkIn: 4.9,
      value: 4.9
    }
  },
  {
    id: 'rev-042',
    propertyId: 'prop-009',
    userId: 'user-042',
    userName: 'Michael Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=55',
    rating: 4.6,
    comment: 'Great apartment in the heart of Rome! Walking distance to Colosseum and Forum. Clean, comfortable, and the host was very helpful with recommendations.',
    date: new Date('2024-09-15'),
    helpful: 16,
    categories: {
      cleanliness: 4.7,
      accuracy: 4.6,
      communication: 4.7,
      location: 5.0,
      checkIn: 4.5,
      value: 4.6
    }
  },
  {
    id: 'rev-043',
    propertyId: 'prop-009',
    userId: 'user-043',
    userName: 'Elena Petrov',
    userAvatar: 'https://i.pravatar.cc/150?img=50',
    rating: 4.8,
    comment: 'Прекрасная квартира в центре Рима! Очень чистая и уютная. Отличное расположение рядом с достопримечательностями.',
    date: new Date('2024-08-22'),
    helpful: 13,
    categories: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 4.8,
      location: 5.0,
      checkIn: 4.7,
      value: 4.7
    }
  },
  {
    id: 'rev-044',
    propertyId: 'prop-009',
    userId: 'user-044',
    userName: 'Pierre Moreau',
    userAvatar: 'https://i.pravatar.cc/150?img=35',
    rating: 4.5,
    comment: 'Bel appartement dans le centre de Rome. Très bien situé pour visiter la ville. Propre et fonctionnel.',
    date: new Date('2024-07-18'),
    helpful: 10,
    categories: {
      cleanliness: 4.6,
      accuracy: 4.5,
      communication: 4.6,
      location: 4.9,
      checkIn: 4.4,
      value: 4.5
    }
  },
  {
    id: 'rev-045',
    propertyId: 'prop-009',
    userId: 'user-045',
    userName: 'Sarah Taylor',
    userAvatar: 'https://i.pravatar.cc/150?img=44',
    rating: 4.7,
    comment: 'Perfect location in Rome! The apartment is beautiful and has all the amenities you need. The host provided great local tips. Highly recommend!',
    date: new Date('2024-06-05'),
    helpful: 17,
    categories: {
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.8,
      location: 5.0,
      checkIn: 4.6,
      value: 4.7
    }
  },

  // REVIEWS PARA prop-010 (Amsterdam - 4.5 stars)
  {
    id: 'rev-046',
    propertyId: 'prop-010',
    userId: 'user-046',
    userName: 'Jan de Vries',
    userAvatar: 'https://i.pravatar.cc/150?img=18',
    rating: 4.6,
    comment: 'Geweldig appartement in het centrum van Amsterdam! Zeer schoon en goed uitgerust. Perfecte locatie om de stad te verkennen.',
    date: new Date('2024-10-03'),
    helpful: 19,
    categories: {
      cleanliness: 4.7,
      accuracy: 4.6,
      communication: 4.7,
      location: 4.9,
      checkIn: 4.5,
      value: 4.6
    }
  },
  {
    id: 'rev-047',
    propertyId: 'prop-010',
    userId: 'user-047',
    userName: 'Lisa Anderson',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    rating: 4.4,
    comment: 'Nice apartment in Amsterdam! Good location, clean and comfortable. The canal view is lovely. Would recommend for a city break.',
    date: new Date('2024-09-10'),
    helpful: 12,
    categories: {
      cleanliness: 4.5,
      accuracy: 4.4,
      communication: 4.5,
      location: 4.8,
      checkIn: 4.3,
      value: 4.4
    }
  },
  {
    id: 'rev-048',
    propertyId: 'prop-010',
    userId: 'user-048',
    userName: 'Carlos Mendez',
    userAvatar: 'https://i.pravatar.cc/150?img=56',
    rating: 4.5,
    comment: 'Buen apartamento en Ámsterdam. Ubicación céntrica, cerca de todo. Limpio y bien equipado. Recomendado.',
    date: new Date('2024-08-15'),
    helpful: 8,
    categories: {
      cleanliness: 4.6,
      accuracy: 4.5,
      communication: 4.5,
      location: 4.9,
      checkIn: 4.4,
      value: 4.5
    }
  },
  {
    id: 'rev-049',
    propertyId: 'prop-010',
    userId: 'user-049',
    userName: 'Anna Kowalski',
    userAvatar: 'https://i.pravatar.cc/150?img=51',
    rating: 4.7,
    comment: 'Świetne mieszkanie w centrum Amsterdamu! Bardzo czyste i wygodne. Doskonała lokalizacja.',
    date: new Date('2024-07-20'),
    helpful: 14,
    categories: {
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.7,
      location: 5.0,
      checkIn: 4.6,
      value: 4.6
    }
  },
  {
    id: 'rev-050',
    propertyId: 'prop-010',
    userId: 'user-050',
    userName: 'Thomas Müller',
    userAvatar: 'https://i.pravatar.cc/150?img=36',
    rating: 4.3,
    comment: 'Gutes Apartment in Amsterdam. Zentrale Lage, sauber und funktional. Guter Preis-Leistungs-Verhältnis.',
    date: new Date('2024-06-12'),
    helpful: 6,
    categories: {
      cleanliness: 4.4,
      accuracy: 4.3,
      communication: 4.4,
      location: 4.7,
      checkIn: 4.2,
      value: 4.4
    }
  },
];

/**
 * Obtener reviews de una propiedad específica
 */
export function getReviewsByPropertyId(propertyId: string): Review[] {
  return MOCK_REVIEWS.filter(review => review.propertyId === propertyId);
}

/**
 * Obtener estadísticas de reviews de una propiedad
 */
export function getReviewStats(propertyId: string) {
  const reviews = getReviewsByPropertyId(propertyId);
  
  if (reviews.length === 0) {
    return null;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = totalRating / reviews.length;

  // Calcular promedio de categorías
  const categoriesAvg = {
    cleanliness: 0,
    accuracy: 0,
    communication: 0,
    location: 0,
    checkIn: 0,
    value: 0
  };

  reviews.forEach(review => {
    if (review.categories) {
      Object.keys(categoriesAvg).forEach(key => {
        categoriesAvg[key as keyof typeof categoriesAvg] += 
          review.categories![key as keyof typeof review.categories] || 0;
      });
    }
  });

  Object.keys(categoriesAvg).forEach(key => {
    categoriesAvg[key as keyof typeof categoriesAvg] /= reviews.length;
  });

  return {
    totalReviews: reviews.length,
    averageRating: Math.round(avgRating * 10) / 10,
    categories: categoriesAvg
  };
}

/**
 * Obtener review por ID
 */
export function getReviewById(reviewId: string): Review | undefined {
  return MOCK_REVIEWS.find(review => review.id === reviewId);
}

