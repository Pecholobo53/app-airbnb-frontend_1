// scripts/reset-and-create-properties.js
/**
 * Script para:
 * 1. Borrar TODAS las propiedades existentes
 * 2. Crear 15 propiedades nuevas con imagenes unicas
 * 
 * Ejecutar desde la consola del navegador despues de iniciar sesion como admin
 * o desde Node.js con el token configurado
 */

const API_BASE_URL = 'http://localhost:3000';

// Obtener token de localStorage/sessionStorage
function getToken() {
  if (typeof window !== 'undefined') {
    const session = sessionStorage.getItem('airbnb_session') || localStorage.getItem('airbnb_session');
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.token || parsed.accessToken;
    }
  }
  return null;
}

const TOKEN = getToken();

if (!TOKEN) {
  console.error('No hay token. Por favor, inicia sesion primero.');
}

// 15 propiedades con imagenes UNICAS de Unsplash (sin repetir)
const PROPERTIES = [
  {
    title: 'Apartamento con Vistas a la Playa de Las Canteras',
    description: 'Acogedor apartamento completamente renovado en el corazon de Las Palmas de Gran Canaria. Este espacio moderno combina el encanto local con todas las comodidades que necesitas para una estancia perfecta. Ubicado en una zona tranquila pero centrica, podras disfrutar de la autentica vida local mientras exploras los principales puntos de interes a pie.',
    location: {
      city: 'Las Palmas de Gran Canaria',
      country: 'Espana',
      region: 'Canarias',
      address: 'Paseo de Las Canteras, 12',
      coordinates: { lat: 28.1346, lng: -15.4362 }
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 105, currency: 'EUR' },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'washer', 'beach_access'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b25ba?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Villa de Lujo con Piscina Privada en Marbella',
    description: 'Espectacular villa de lujo con piscina privada y vistas al Mediterraneo. Disfruta del clima andaluz en esta propiedad exclusiva con amplios jardines, terraza solarium y todas las comodidades de un hotel 5 estrellas. Perfecta para familias o grupos que buscan privacidad y confort.',
    location: {
      city: 'Marbella',
      country: 'Espana',
      region: 'Andalucia',
      address: 'Urbanizacion Sierra Blanca, 45',
      coordinates: { lat: 36.5109, lng: -4.8862 }
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: { basePrice: 350, currency: 'EUR' },
    capacity: { guests: 8, bedrooms: 4, beds: 5, bathrooms: 3 },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'garden', 'bbq', 'gym'],
    availability: { minNights: 3, maxNights: 30, instantBook: true, checkInTime: '16:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Loft Industrial en el Barrio Gotico de Barcelona',
    description: 'Impresionante loft de estilo industrial en pleno corazon del Barrio Gotico. Techos altos con vigas de madera vista, grandes ventanales y una decoracion cuidada al detalle. A pocos pasos de las Ramblas, la Catedral y los mejores restaurantes de la ciudad.',
    location: {
      city: 'Barcelona',
      country: 'Espana',
      region: 'Cataluna',
      address: 'Carrer del Call, 18',
      coordinates: { lat: 41.3825, lng: 2.1769 }
    },
    propertyType: 'entire_place',
    roomType: 'loft',
    pricing: { basePrice: 180, currency: 'EUR' },
    capacity: { guests: 4, bedrooms: 1, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'workspace', 'washer'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Casa Tradicional con Jardin en el Centro de Madrid',
    description: 'Encantadora casa tradicional madrilena con jardin privado en el barrio de Chamberi. Combina el encanto de la arquitectura clasica con todas las comodidades modernas. Ideal para familias que quieren vivir Madrid como un local.',
    location: {
      city: 'Madrid',
      country: 'Espana',
      region: 'Comunidad de Madrid',
      address: 'Calle de Ponzano, 78',
      coordinates: { lat: 40.4378, lng: -3.6953 }
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 195, currency: 'EUR' },
    capacity: { guests: 6, bedrooms: 3, beds: 4, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'garden', 'heating', 'tv', 'washer', 'workspace'],
    availability: { minNights: 2, maxNights: 60, instantBook: true, checkInTime: '14:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Cabana de Montana en los Pirineos Aragoneses',
    description: 'Acogedora cabana de madera en plena naturaleza pirenaica. Rodeada de bosques y con vistas espectaculares a las montanas. Perfecta para desconectar, hacer senderismo y disfrutar de la tranquilidad. Chimenea, terraza y todo lo necesario para una escapada inolvidable.',
    location: {
      city: 'Jaca',
      country: 'Espana',
      region: 'Aragon',
      address: 'Valle de Aisa, km 5',
      coordinates: { lat: 42.5700, lng: -0.5500 }
    },
    propertyType: 'entire_place',
    roomType: 'cabin',
    pricing: { basePrice: 95, currency: 'EUR' },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'fireplace', 'heating', 'mountain_view', 'parking'],
    availability: { minNights: 2, maxNights: 14, instantBook: false, checkInTime: '16:00', checkOutTime: '10:00' },
    images: [
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Apartamento Moderno frente a la Ciudad de las Artes',
    description: 'Elegante apartamento de diseno con vistas a la Ciudad de las Artes y las Ciencias de Valencia. Luminoso, con terraza privada y acabados de alta calidad. Ubicacion inmejorable para explorar la ciudad y disfrutar de la playa de la Malvarrosa.',
    location: {
      city: 'Valencia',
      country: 'Espana',
      region: 'Comunidad Valenciana',
      address: 'Avenida Autopista del Saler, 3',
      coordinates: { lat: 39.4553, lng: -0.3515 }
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 135, currency: 'EUR' },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'balcony', 'parking'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Villa Mediterranea con Piscina en Ibiza',
    description: 'Impresionante villa mediterranea con vistas al mar y piscina infinity. Ubicada en una colina privilegiada de Ibiza, ofrece privacidad total y puestas de sol espectaculares. Perfecta para grupos que buscan el equilibrio entre fiesta y relax.',
    location: {
      city: 'Sant Josep de sa Talaia',
      country: 'Espana',
      region: 'Islas Baleares',
      address: 'Carretera de Cala Conta, km 3',
      coordinates: { lat: 38.9247, lng: 1.2355 }
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: { basePrice: 450, currency: 'EUR' },
    capacity: { guests: 10, bedrooms: 5, beds: 6, bathrooms: 4 },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'beach_access', 'bbq', 'hot_tub'],
    availability: { minNights: 5, maxNights: 30, instantBook: false, checkInTime: '16:00', checkOutTime: '10:00' },
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Casa Vasca con Encanto en San Sebastian',
    description: 'Autentica casa vasca renovada con todo el encanto tradicional y comodidades modernas. Ubicada en el barrio de Gros, a pasos de la playa de la Zurriola y de los mejores pintxos de la ciudad. Ideal para amantes de la gastronomia y el surf.',
    location: {
      city: 'San Sebastian',
      country: 'Espana',
      region: 'Pais Vasco',
      address: 'Calle Zabaleta, 25',
      coordinates: { lat: 43.3224, lng: -1.9737 }
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 175, currency: 'EUR' },
    capacity: { guests: 6, bedrooms: 3, beds: 4, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'heating', 'tv', 'washer', 'beach_access'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Loft Artistico en el Centro de Sevilla',
    description: 'Espectacular loft de artista en un edificio historico del centro de Sevilla. Techos altisimos, luz natural abundante y una decoracion unica que mezcla lo antiguo con lo contemporaneo. A minutos de la Catedral, el Alcazar y el barrio de Santa Cruz.',
    location: {
      city: 'Sevilla',
      country: 'Espana',
      region: 'Andalucia',
      address: 'Calle Sierpes, 42',
      coordinates: { lat: 37.3886, lng: -5.9953 }
    },
    propertyType: 'entire_place',
    roomType: 'loft',
    pricing: { basePrice: 145, currency: 'EUR' },
    capacity: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'workspace', 'balcony'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '14:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560440021-33f9b867899d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Apartamento de Diseno en Bilbao',
    description: 'Moderno apartamento de diseno junto al Museo Guggenheim. Interiorismo contemporaneo, vistas al rio Nervion y ubicacion perfecta para descubrir la vibrante escena cultural y gastronomica de Bilbao. El lugar ideal para los amantes del arte y la arquitectura.',
    location: {
      city: 'Bilbao',
      country: 'Espana',
      region: 'Pais Vasco',
      address: 'Alameda Mazarredo, 15',
      coordinates: { lat: 43.2683, lng: -2.9340 }
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 125, currency: 'EUR' },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'heating', 'tv', 'workspace', 'washer'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Finca Rural con Piscina en Mallorca',
    description: 'Autentica finca mallorquina restaurada con piscina privada y huerto ecologico. Rodeada de olivos y almendros, ofrece paz y tranquilidad a solo 20 minutos de Palma. Ideal para desconectar y disfrutar de la esencia mediterranea.',
    location: {
      city: 'Alaro',
      country: 'Espana',
      region: 'Islas Baleares',
      address: 'Camino de Son Fortesa, s/n',
      coordinates: { lat: 39.7013, lng: 2.7897 }
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: { basePrice: 275, currency: 'EUR' },
    capacity: { guests: 8, bedrooms: 4, beds: 5, bathrooms: 3 },
    amenities: ['wifi', 'kitchen', 'pool', 'garden', 'parking', 'bbq', 'mountain_view'],
    availability: { minNights: 3, maxNights: 30, instantBook: true, checkInTime: '16:00', checkOutTime: '10:00' },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Casita de Piedra en los Picos de Europa',
    description: 'Encantadora casita de piedra tradicional asturiana en pleno Parque Nacional de los Picos de Europa. Perfecta para amantes del senderismo, la naturaleza y la tranquilidad. Con chimenea, vistas a las montanas y acceso a rutas increibles.',
    location: {
      city: 'Cangas de Onis',
      country: 'Espana',
      region: 'Asturias',
      address: 'Covadonga, km 8',
      coordinates: { lat: 43.3107, lng: -5.0662 }
    },
    propertyType: 'entire_place',
    roomType: 'cottage',
    pricing: { basePrice: 85, currency: 'EUR' },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'fireplace', 'heating', 'mountain_view', 'parking'],
    availability: { minNights: 2, maxNights: 14, instantBook: true, checkInTime: '15:00', checkOutTime: '10:00' },
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Apartamento Luminoso en la Malagueta',
    description: 'Precioso apartamento completamente reformado frente a la playa de la Malagueta. Luminoso, con terraza y vistas al mar. A pasos del centro historico de Malaga, el Museo Picasso y los mejores chiringuitos de la Costa del Sol.',
    location: {
      city: 'Malaga',
      country: 'Espana',
      region: 'Andalucia',
      address: 'Paseo de la Farola, 8',
      coordinates: { lat: 36.7162, lng: -4.4097 }
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 115, currency: 'EUR' },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'beach_access', 'balcony'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1617104678098-de229db51175?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Carmen con Vistas a la Alhambra en Granada',
    description: 'Historico carmen granadino con vistas directas a la Alhambra desde su terraza-jardin. Una experiencia unica en el Albaicin, patrimonio de la humanidad. Arquitectura tradicional, patios con fuentes y todo el romanticismo de Granada.',
    location: {
      city: 'Granada',
      country: 'Espana',
      region: 'Andalucia',
      address: 'Cuesta del Chapiz, 12',
      coordinates: { lat: 37.1789, lng: -3.5885 }
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 165, currency: 'EUR' },
    capacity: { guests: 5, bedrooms: 2, beds: 3, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'garden', 'heating', 'tv', 'terrace'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&h=800&fit=crop'
    ]
  },
  {
    title: 'Atico con Terraza Panoramica en Tenerife',
    description: 'Espectacular atico con terraza de 50m2 y vistas al Teide y al oceano. Ubicado en Puerto de la Cruz, combina el encanto del norte de Tenerife con todas las comodidades. Perfecto para disfrutar de atardeceres unicos y el mejor clima del mundo.',
    location: {
      city: 'Puerto de la Cruz',
      country: 'Espana',
      region: 'Canarias',
      address: 'Avenida de Colon, 35',
      coordinates: { lat: 28.4169, lng: -16.5493 }
    },
    propertyType: 'entire_place',
    roomType: 'loft',
    pricing: { basePrice: 155, currency: 'EUR' },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'terrace', 'mountain_view', 'parking'],
    availability: { minNights: 3, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&h=800&fit=crop'
    ]
  }
];

/**
 * Obtiene todas las propiedades existentes
 */
async function getAllProperties() {
  console.log('Obteniendo propiedades existentes...');
  
  const response = await fetch(`${API_BASE_URL}/api/properties/search?perPage=100`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  
  const data = await response.json();
  
  if (data.success && data.data?.properties) {
    console.log(`Encontradas ${data.data.properties.length} propiedades`);
    return data.data.properties;
  }
  
  console.log('No se encontraron propiedades o error en la respuesta');
  return [];
}

/**
 * Elimina una propiedad por ID
 */
async function deleteProperty(propertyId) {
  console.log(`Eliminando propiedad: ${propertyId}`);
  
  const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  
  if (response.ok) {
    console.log(`Propiedad ${propertyId} eliminada`);
    return true;
  } else {
    const data = await response.json();
    console.error(`Error eliminando ${propertyId}:`, data.message || data.error);
    return false;
  }
}

/**
 * Crea una nueva propiedad
 */
async function createProperty(propertyData, index) {
  console.log(`Creando propiedad ${index + 1}/15: ${propertyData.title}`);
  
  const response = await fetch(`${API_BASE_URL}/api/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify(propertyData)
  });
  
  const data = await response.json();
  
  if (response.ok && data.success) {
    console.log(`Propiedad creada: ${data.data?.id || data.data?._id || 'ID desconocido'}`);
    return { success: true, id: data.data?.id || data.data?._id };
  } else {
    console.error(`Error creando propiedad:`, data.message || data.error);
    return { success: false, error: data.message || data.error };
  }
}

/**
 * Ejecuta el proceso completo
 */
async function main() {
  console.log('='.repeat(60));
  console.log('INICIANDO RESET DE PROPIEDADES');
  console.log('='.repeat(60));
  
  // 1. Obtener todas las propiedades existentes
  const existingProperties = await getAllProperties();
  
  // 2. Eliminar todas las propiedades
  if (existingProperties.length > 0) {
    console.log(`\nEliminando ${existingProperties.length} propiedades existentes...`);
    
    for (const prop of existingProperties) {
      const id = prop.id || prop._id;
      await deleteProperty(id);
      await new Promise(resolve => setTimeout(resolve, 200)); // Esperar entre eliminaciones
    }
    
    console.log('Todas las propiedades eliminadas.');
  } else {
    console.log('\nNo hay propiedades para eliminar.');
  }
  
  // 3. Crear las 15 nuevas propiedades
  console.log('\nCreando 15 nuevas propiedades...');
  const results = [];
  
  for (let i = 0; i < PROPERTIES.length; i++) {
    const result = await createProperty(PROPERTIES[i], i);
    results.push({ ...result, title: PROPERTIES[i].title });
    await new Promise(resolve => setTimeout(resolve, 500)); // Esperar entre creaciones
  }
  
  // 4. Resumen
  console.log('\n' + '='.repeat(60));
  console.log('RESUMEN');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  console.log(`Propiedades creadas: ${successCount}/15`);
  console.log(`Errores: ${failCount}`);
  
  if (failCount > 0) {
    console.log('\nPropiedades con error:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`- ${r.title}: ${r.error}`);
    });
  }
  
  console.log('\nPropiedades creadas exitosamente:');
  results.filter(r => r.success).forEach(r => {
    console.log(`- ${r.title} (ID: ${r.id})`);
  });
  
  return results;
}

// Ejecutar si estamos en el navegador
if (typeof window !== 'undefined') {
  main().then(results => {
    console.log('\nProceso completado. Recarga la pagina para ver los cambios.');
  }).catch(error => {
    console.error('Error fatal:', error);
  });
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined') {
  module.exports = { main, PROPERTIES, getAllProperties, deleteProperty, createProperty };
}
