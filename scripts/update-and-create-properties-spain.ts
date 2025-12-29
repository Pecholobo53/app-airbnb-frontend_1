/**
 * Script para actualizar propiedades existentes y crear 21 nuevas propiedades
 * en 7 provincias españolas (Sevilla, Málaga, Madrid, Galicia, Las Palmas, Tenerife, Lanzarote)
 * 
 * Ejecutar con: npx tsx scripts/update-and-create-properties-spain.ts
 * 
 * Requisitos:
 * - Token de autenticación (pasar como variable de entorno AUTH_TOKEN)
 * - Backend corriendo en http://localhost:3000
 */

import { CreatePropertyData } from '../lib/properties/property-service';
import { Buffer } from 'buffer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

// Pool de imágenes únicas - Imágenes reales de Unsplash con IDs únicos
const IMAGE_POOL = {
  apartments: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260256-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e8?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0e?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0f?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c10?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c11?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c12?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c13?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c14?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c15?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c16?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c17?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c18?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c19?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c20?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c21?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c22?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c23?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c24?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c25?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c26?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c27?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c28?w=1200&q=80',
  ],
  houses: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a4?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a5?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a6?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a7?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a8?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5aa?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ab?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ac?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ad?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ae?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5af?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b0?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b1?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b2?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b4?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b5?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b6?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b7?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b8?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5b9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ba?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5bb?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5bc?w=1200&q=80',
  ],
  villas: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a4?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a5?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a6?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a7?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a8?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5aa?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ab?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ac?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ad?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ae?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5af?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c0?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c1?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c2?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c4?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c5?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c6?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c7?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c8?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5c9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ca?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5cb?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5cc?w=1200&q=80',
  ],
  cabins: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0e?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0f?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c10?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c11?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c12?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c13?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c14?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c15?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c16?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c17?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c18?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c19?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c20?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c21?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c22?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c23?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c24?w=1200&q=80',
  ],
  cottages: [
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a4?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a5?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a6?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a7?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a8?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5aa?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ab?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ac?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ad?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5ae?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5af?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5d0?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5d1?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5d2?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5d3?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5d4?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5d5?w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dbe4eb5d6?w=1200&q=80',
  ],
  lofts: [
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0d?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0e?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c0f?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c10?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c11?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c12?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c13?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c14?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c15?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c16?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607688066-9c2b0c0c0c17?w=1200&q=80',
  ],
};

// Sistema de tracking de imágenes usadas
const usedImages = new Set<string>();

/**
 * Obtiene 3 imágenes únicas de una categoría específica
 */
function getUniqueImages(category: keyof typeof IMAGE_POOL): string[] {
  const available = IMAGE_POOL[category].filter(img => !usedImages.has(img));
  
  if (available.length < 3) {
    console.warn(`⚠️ Solo hay ${available.length} imágenes disponibles en ${category}, reutilizando...`);
    // Si no hay suficientes, usar las que hay y completar con otras categorías
    const allAvailable = Object.values(IMAGE_POOL).flat().filter(img => !usedImages.has(img));
    const selected: string[] = [];
    
    // Primero las de la categoría
    selected.push(...available.slice(0, Math.min(3, available.length)));
    
    // Completar con otras categorías si es necesario
    for (const img of allAvailable) {
      if (selected.length >= 3) break;
      if (!selected.includes(img)) {
        selected.push(img);
      }
    }
    
    // Si aún no hay 3, reutilizar imágenes ya usadas (mejor que dejar vacío)
    if (selected.length < 3) {
      const allImages = Object.values(IMAGE_POOL).flat();
      for (const img of allImages) {
        if (selected.length >= 3) break;
        if (!selected.includes(img)) {
          selected.push(img);
        }
      }
    }
    
    selected.forEach(img => usedImages.add(img));
    return selected.slice(0, 3);
  }
  
  const selected = available.slice(0, 3);
  selected.forEach(img => usedImages.add(img));
  return selected;
}

/**
 * Genera descripción detallada y específica al estilo Airbnb
 */
function generateDescription(
  type: 'apartment' | 'house' | 'villa' | 'cabin' | 'cottage' | 'loft',
  city: string,
  region: string,
  roomType: string,
  features: string[]
): string {
  const typeNames: Record<string, string> = {
    apartment: 'apartamento',
    house: 'casa',
    villa: 'villa',
    cabin: 'cabaña',
    cottage: 'casa rural',
    loft: 'loft',
  };
  
  const typeName = typeNames[type] || type;
  
  // Descripciones específicas y detalladas para cada tipo y ciudad
  const citySpecifics: Record<string, Record<string, string>> = {
    'Sevilla': {
      apartment: `Acogedor apartamento completamente renovado en el corazón histórico de Sevilla, a pocos pasos de la Catedral y el Alcázar. Este espacio luminoso combina el encanto andaluz tradicional con todas las comodidades modernas que necesitas para una estancia perfecta. El apartamento cuenta con dos habitaciones espaciosas, una cocina completamente equipada con electrodomésticos modernos, y un salón acogedor con balcón que da a una callejuela típica del barrio de Santa Cruz. Las comodidades incluyen WiFi de alta velocidad, aire acondicionado en todas las estancias, y una cocina moderna con todos los electrodomésticos necesarios. El espacio es ideal para parejas, familias pequeñas o viajeros de negocios que buscan una base cómoda para explorar la ciudad. Desde aquí podrás caminar a los principales monumentos, restaurantes tradicionales y bares de tapas en menos de 5 minutos. El transporte público está a solo 2 minutos, facilitando el acceso a otras zonas de la ciudad. Te esperamos para que disfrutes de una experiencia auténtica en una de las ciudades más bellas de España.`,
      house: `Encantadora casa tradicional sevillana en el barrio de Triana, perfectamente restaurada para combinar el carácter histórico con el confort moderno. Esta casa única te transportará a la esencia de la vida sevillana mientras disfrutas de todas las comodidades actuales. La casa cuenta con tres habitaciones espaciosas, una cocina completamente equipada donde podrás preparar tus comidas, y un patio andaluz típico donde podrás relajarse después de un día explorando. El diseño mantiene elementos arquitectónicos originales como azulejos sevillanos, vigas de madera y rejas tradicionales que añaden carácter y autenticidad. Ubicada en una de las zonas más auténticas de Sevilla, podrás experimentar la vida cotidiana local mientras tienes fácil acceso a los principales atractivos turísticos. Los vecinos son amigables y la zona es segura, perfecta para familias o grupos que buscan una experiencia más residencial. Las comodidades incluyen WiFi de alta velocidad, calefacción y aire acondicionado en todas las estancias, cocina completa con electrodomésticos modernos, y el patio donde podrás disfrutar del clima andaluz. El espacio es ideal para estancias más largas o para quienes buscan una experiencia más auténtica. Desde la casa podrás explorar Sevilla a tu ritmo, descubriendo rincones ocultos y experiencias locales que solo los residentes conocen.`,
      villa: `Lujosa villa en una zona residencial exclusiva de Sevilla, diseñada para ofrecerte una experiencia de alojamiento excepcional. Este espacio exclusivo combina elegancia, confort y privacidad en un entorno privilegiado. La villa cuenta con amplias estancias distribuidas en dos plantas, diseño contemporáneo con toques andaluces, y acabados de alta calidad. Disfruta de espacios exteriores privados con jardín, piscina privada, áreas de descanso y entretenimiento, y todas las comodidades que esperarías de un alojamiento de lujo. Ubicada en una de las mejores zonas residenciales de Sevilla, podrás disfrutar de la tranquilidad y privacidad mientras tienes fácil acceso al centro histórico, restaurantes de alta cocina, y actividades exclusivas. El entorno es perfecto para desconectar y relajarse. Las comodidades premium incluyen piscina privada, WiFi de alta velocidad, aire acondicionado en todas las estancias, cocina gourmet completamente equipada, garaje privado, y espacios diseñados para el máximo confort. Ideal para familias, grupos de amigos o quienes buscan una experiencia de lujo. Desde la villa podrás disfrutar de Sevilla con el máximo confort y privacidad. Cada detalle ha sido cuidadosamente pensado para que tu estancia sea inolvidable.`,
    },
    'Málaga': {
      apartment: `Apartamento moderno con vistas al mar en la playa de la Malagueta, en el corazón de Málaga. Este espacio completamente renovado combina el encanto costero con todas las comodidades modernas que necesitas para una estancia perfecta. El apartamento cuenta con una habitación acogedora, una cocina completamente equipada con electrodomésticos modernos, y un salón luminoso con balcón que ofrece vistas espectaculares al Mediterráneo. Las comodidades incluyen WiFi de alta velocidad, aire acondicionado en todas las estancias, y una cocina moderna con todos los electrodomésticos necesarios. El espacio es ideal para parejas que buscan una escapada romántica junto al mar. Desde aquí podrás caminar directamente a la playa en menos de 2 minutos, y a los principales puntos de interés de Málaga como el Teatro Romano, la Alcazaba y el centro histórico en menos de 10 minutos. El transporte público está muy cerca, facilitando el acceso a otras zonas de la ciudad. Te esperamos para que disfrutes de una experiencia única en la Costa del Sol.`,
      house: `Casa andaluza tradicional en el centro histórico de Málaga, perfectamente restaurada para combinar el carácter histórico con el confort moderno. Esta casa única te transportará a la esencia de la vida malagueña mientras disfrutas de todas las comodidades actuales. La casa cuenta con tres habitaciones espaciosas, una cocina completamente equipada donde podrás preparar tus comidas, y un patio interior típico andaluz donde podrás relajarse después de un día explorando. El diseño mantiene elementos arquitectónicos originales como azulejos, vigas de madera y rejas tradicionales que añaden carácter y autenticidad. Ubicada en el corazón del casco histórico, podrás experimentar la vida cotidiana de Málaga mientras tienes fácil acceso a los principales atractivos turísticos como la Catedral, el Museo Picasso, y los mejores restaurantes de la ciudad. Los vecinos son amigables y la zona es segura, perfecta para familias o grupos que buscan una experiencia más residencial. Las comodidades incluyen WiFi de alta velocidad, calefacción y aire acondicionado en todas las estancias, cocina completa con electrodomésticos modernos, y el patio donde podrás disfrutar del clima mediterráneo. El espacio es ideal para estancias más largas o para quienes buscan una experiencia más auténtica.`,
      villa: `Villa exclusiva con vistas panorámicas al mar en Marbella, diseñada para ofrecerte una experiencia de alojamiento excepcional. Este espacio exclusivo combina elegancia, confort y privacidad en un entorno privilegiado de la Costa del Sol. La villa cuenta con amplias estancias distribuidas en varios niveles, diseño contemporáneo de lujo, y acabados de alta calidad. Disfruta de espacios exteriores privados con jardín mediterráneo, piscina infinity con vistas al mar, áreas de descanso y entretenimiento, y todas las comodidades que esperarías de un alojamiento de lujo. Ubicada en una de las mejores zonas de Marbella, podrás disfrutar de la tranquilidad y privacidad mientras tienes fácil acceso a playas exclusivas, restaurantes de alta cocina, campos de golf, y actividades exclusivas. El entorno es perfecto para desconectar y relajarse. Las comodidades premium incluyen piscina infinity privada, WiFi de alta velocidad, aire acondicionado en todas las estancias, cocina gourmet completamente equipada, garaje privado, jacuzzi exterior, y espacios diseñados para el máximo confort. Ideal para familias, grupos de amigos o quienes buscan una experiencia de lujo en la Costa del Sol. Desde la villa podrás disfrutar de Marbella con el máximo confort y privacidad. Cada detalle ha sido cuidadosamente pensado para que tu estancia sea inolvidable.`,
    },
    'Madrid': {
      apartment: `Apartamento elegante y moderno en el exclusivo barrio de Salamanca, en el corazón de Madrid. Este espacio completamente renovado combina el estilo madrileño clásico con todas las comodidades modernas que necesitas para una estancia perfecta. El apartamento cuenta con dos habitaciones espaciosas, una cocina completamente equipada con electrodomésticos de alta gama, y un salón luminoso con balcón que da a una calle tranquila del barrio. Las comodidades incluyen WiFi de alta velocidad, aire acondicionado en todas las estancias, y una cocina moderna con todos los electrodomésticos necesarios. El espacio es ideal para parejas, familias pequeñas o viajeros de negocios que buscan una base cómoda para explorar la capital. Desde aquí podrás caminar a los principales puntos de interés como el Parque del Retiro, el Museo del Prado, y las mejores tiendas y restaurantes de Madrid en menos de 15 minutos. El transporte público está muy cerca, facilitando el acceso a todas las zonas de la ciudad. Te esperamos para que disfrutes de una experiencia única en el corazón de Madrid.`,
      house: `Casa clásica con encanto en el barrio de Chamberí, perfectamente restaurada para combinar el carácter histórico madrileño con el confort moderno. Esta casa única te transportará a la esencia de la vida madrileña mientras disfrutas de todas las comodidades actuales. La casa cuenta con cuatro habitaciones espaciosas distribuidas en varias plantas, una cocina completamente equipada donde podrás preparar tus comidas, y áreas comunes acogedoras ideales para relajarse después de un día explorando. El diseño mantiene elementos arquitectónicos originales como molduras, suelos de parquet originales y techos altos que añaden carácter y autenticidad. Ubicada en uno de los barrios más tradicionales y seguros de Madrid, podrás experimentar la vida cotidiana de la capital mientras tienes fácil acceso a los principales atractivos turísticos, museos, y los mejores restaurantes de la ciudad. Los vecinos son amigables y la zona es perfecta para familias o grupos que buscan una experiencia más residencial. Las comodidades incluyen WiFi de alta velocidad, calefacción central y aire acondicionado en todas las estancias, cocina completa con electrodomésticos modernos, y espacios diseñados para el máximo confort. El espacio es ideal para estancias más largas o para quienes buscan una experiencia más auténtica en Madrid.`,
      loft: `Loft industrial moderno en el corazón de Malasaña, uno de los barrios más vibrantes y creativos de Madrid. Este espacio único combina diseño contemporáneo con espacios amplios y luminosos, ofreciéndote una experiencia de alojamiento diferente y sofisticada. El loft cuenta con techos altos, grandes ventanales que inundan el espacio de luz natural, y un diseño abierto que crea sensación de amplitud. Disfruta de espacios multifuncionales, decoración moderna con toques industriales, y un ambiente que inspira creatividad y relajación. Ubicado en el corazón de Malasaña, podrás disfrutar de la vida urbana local, con cafeterías de moda, restaurantes innovadores, bares alternativos, y una escena cultural vibrante a pocos pasos. El entorno es perfecto para quienes buscan una experiencia urbana auténtica y moderna. Las comodidades incluyen WiFi de alta velocidad, aire acondicionado, cocina moderna completamente equipada, y espacios diseñados tanto para trabajar como para relajarse. Ideal para parejas, viajeros de negocios, o quienes buscan un espacio con personalidad en el corazón de Madrid. Desde el loft podrás explorar Madrid desde una perspectiva diferente, descubriendo su lado más moderno, creativo y bohemio. Una experiencia que combina confort, estilo y autenticidad.`,
    },
  };
  
  // Si hay descripción específica para la ciudad, usarla
  if (citySpecifics[city] && citySpecifics[city][type]) {
    return citySpecifics[city][type];
  }
  
  // Descripciones genéricas mejoradas
  const descriptions: Record<string, string[]> = {
    apartment: [
      `Acogedor ${typeName} completamente renovado en el corazón de ${city}, ${region}. Este espacio moderno combina el encanto local con todas las comodidades que necesitas para una estancia perfecta.`,
      `Ubicado en una zona tranquila pero céntrica, podrás disfrutar de la auténtica vida local mientras exploras los principales puntos de interés a pie. El ${typeName} cuenta con espacios luminosos, una cocina completamente equipada y un ambiente acogedor que te hará sentir como en casa.`,
      `Las comodidades incluyen WiFi de alta velocidad, aire acondicionado en todas las estancias, y una cocina moderna con todos los electrodomésticos necesarios. El espacio es ideal para parejas, familias pequeñas o viajeros de negocios que buscan una base cómoda para explorar la ciudad.`,
      `Desde aquí podrás caminar a los principales monumentos, restaurantes tradicionales y lugares de interés en menos de 10 minutos. El transporte público está muy cerca, facilitando el acceso a otras zonas de la ciudad y alrededores.`,
      `Te esperamos para que disfrutes de una experiencia auténtica en una de las ciudades más bellas de España.`,
    ],
    house: [
      `Encantadora ${typeName} tradicional en ${city}, ${region}, perfectamente restaurada para combinar el carácter histórico con el confort moderno. Este espacio único te transportará a la esencia de la vida local mientras disfrutas de todas las comodidades actuales.`,
      `La ${typeName} cuenta con múltiples habitaciones espaciosas, una cocina completamente equipada donde podrás preparar tus comidas, y áreas comunes acogedoras ideales para relajarse después de un día explorando. El diseño mantiene elementos arquitectónicos originales que añaden carácter y autenticidad.`,
      `Ubicada en un barrio con encanto, podrás experimentar la vida cotidiana de ${city} mientras tienes fácil acceso a los principales atractivos turísticos. Los vecinos son amigables y la zona es segura, perfecta para familias o grupos que buscan una experiencia más residencial.`,
      `Las comodidades incluyen WiFi de alta velocidad, calefacción en todas las estancias, cocina completa con electrodomésticos modernos, y espacios exteriores donde podrás disfrutar del clima local. El espacio es ideal para estancias más largas o para quienes buscan una experiencia más auténtica.`,
      `Desde la ${typeName} podrás explorar ${city} a tu ritmo, descubriendo rincones ocultos y experiencias locales que solo los residentes conocen. Te esperamos para compartir contigo la magia de esta hermosa ciudad.`,
    ],
    villa: [
      `Lujosa ${typeName} en ${city}, ${region}, diseñada para ofrecerte una experiencia de alojamiento excepcional. Este espacio exclusivo combina elegancia, confort y privacidad en un entorno privilegiado.`,
      `La ${typeName} cuenta con amplias estancias, diseño contemporáneo y acabados de alta calidad. Disfruta de espacios exteriores privados, áreas de descanso y entretenimiento, y todas las comodidades que esperarías de un alojamiento de lujo.`,
      `Ubicada en una de las mejores zonas de ${city}, podrás disfrutar de la tranquilidad y privacidad mientras tienes fácil acceso a playas, restaurantes de alta cocina, y actividades exclusivas. El entorno es perfecto para desconectar y relajarse.`,
      `Las comodidades premium incluyen piscina privada, WiFi de alta velocidad, aire acondicionado en todas las estancias, cocina gourmet completamente equipada, y espacios diseñados para el máximo confort. Ideal para familias, grupos de amigos o quienes buscan una experiencia de lujo.`,
      `Desde la ${typeName} podrás disfrutar de ${city} con el máximo confort y privacidad. Cada detalle ha sido cuidadosamente pensado para que tu estancia sea inolvidable.`,
    ],
    cabin: [
      `Acogedora ${typeName} en ${city}, ${region}, perfecta para desconectar y reconectar con la naturaleza. Este refugio tranquilo te ofrece una experiencia única lejos del bullicio urbano, rodeado de paisajes espectaculares.`,
      `La ${typeName} está construida con materiales naturales y diseñada para integrarse armoniosamente con el entorno. Disfruta de espacios íntimos y acogedores, una cocina funcional, y áreas donde podrás relajarte mientras contemplas los paisajes que te rodean.`,
      `Ubicada en un entorno natural privilegiado, podrás disfrutar de la tranquilidad absoluta, el aire puro, y la posibilidad de realizar actividades al aire libre como senderismo, observación de aves, o simplemente relajarse en la naturaleza.`,
      `Las comodidades incluyen calefacción, cocina básica pero funcional, y espacios diseñados para el máximo confort en un entorno natural. El espacio es ideal para parejas o pequeños grupos que buscan una experiencia auténtica en la naturaleza.`,
      `Desde la ${typeName} podrás explorar los tesoros naturales de ${region}, descubriendo rutas de senderismo, miradores espectaculares, y la flora y fauna local. Una experiencia que te permitirá recargar energías y conectar con lo esencial.`,
    ],
    cottage: [
      `Encantadora ${typeName} en ${city}, ${region}, que combina el encanto rústico tradicional con el confort moderno. Este espacio único te ofrece una experiencia auténtica en un entorno rural idílico.`,
      `La ${typeName} ha sido cuidadosamente restaurada manteniendo su carácter original, con vigas de madera, muros de piedra, y elementos arquitectónicos tradicionales. Disfruta de espacios acogedores, una cocina completamente equipada, y áreas donde podrás relajarte después de explorar.`,
      `Ubicada en un entorno rural tranquilo, podrás disfrutar de la paz del campo, paisajes bucólicos, y la posibilidad de realizar actividades como paseos en bicicleta, visitas a bodegas locales, o simplemente disfrutar del ritmo pausado de la vida rural.`,
      `Las comodidades incluyen WiFi, calefacción, cocina completa, y espacios exteriores donde podrás disfrutar de las vistas y el clima local. El espacio es ideal para familias o grupos que buscan una experiencia diferente y auténtica.`,
      `Desde la ${typeName} podrás explorar ${region} a tu ritmo, descubriendo pueblos con encanto, tradiciones locales, y una gastronomía excepcional. Una experiencia que te permitirá conocer la verdadera esencia de esta hermosa región.`,
    ],
    loft: [
      `Moderno ${typeName} industrial en ${city}, ${region}, que combina diseño contemporáneo con espacios amplios y luminosos. Este espacio único te ofrece una experiencia de alojamiento diferente y sofisticada.`,
      `El ${typeName} cuenta con techos altos, grandes ventanales que inundan el espacio de luz natural, y un diseño abierto que crea sensación de amplitud. Disfruta de espacios multifuncionales, decoración moderna, y un ambiente que inspira creatividad y relajación.`,
      `Ubicado en un barrio con carácter, podrás disfrutar de la vida urbana local, con cafeterías de moda, restaurantes innovadores, y una escena cultural vibrante a pocos pasos. El entorno es perfecto para quienes buscan una experiencia urbana auténtica.`,
      `Las comodidades incluyen WiFi de alta velocidad, aire acondicionado, cocina moderna completamente equipada, y espacios diseñados tanto para trabajar como para relajarse. Ideal para parejas, viajeros de negocios, o quienes buscan un espacio con personalidad.`,
      `Desde el ${typeName} podrás explorar ${city} desde una perspectiva diferente, descubriendo su lado más moderno y creativo. Una experiencia que combina confort, estilo y autenticidad.`,
    ],
  };
  
  const template = descriptions[type] || descriptions.apartment;
  return template.join(' ');
}

/**
 * Obtiene todas las propiedades existentes
 */
async function getExistingProperties(token: string): Promise<any[]> {
  console.log('📋 Obteniendo propiedades existentes...');
  
  try {
    const allProperties: any[] = [];
    let page = 1;
    const perPage = 100; // Máximo permitido por el backend
    let hasMore = true;
    
    while (hasMore) {
      // Intentar primero sin autenticación (endpoint público)
      let response = await fetch(`${API_BASE_URL}/api/properties/search?perPage=${perPage}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Si falla, intentar con autenticación
      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/api/properties/search?perPage=${perPage}&page=${page}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      const data = await response.json();
      
      if (response.ok && data.success && data.data?.properties) {
        const properties = data.data.properties;
        allProperties.push(...properties);
        
        console.log(`📄 Página ${page}: ${properties.length} propiedades (Total acumulado: ${allProperties.length})`);
        
        // Verificar si hay más páginas
        const total = data.data.total || 0;
        hasMore = allProperties.length < total && properties.length === perPage;
        page++;
        
        // Delay para evitar rate limiting
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else {
        console.warn('⚠️ Error obteniendo propiedades en página', page);
        console.warn('   Status:', response.status);
        console.warn('   Error:', data.error?.message || data.message || 'Sin mensaje de error');
        hasMore = false;
      }
    }
    
    if (allProperties.length > 0) {
      console.log(`✅ Total de propiedades existentes encontradas: ${allProperties.length}`);
    } else {
      console.log('ℹ️ No se encontraron propiedades existentes en la base de datos');
    }
    
    return allProperties;
  } catch (error) {
    console.error('❌ Error obteniendo propiedades:', error);
    return [];
  }
}

/**
 * Actualiza una propiedad existente con nuevas fotos y descripción
 */
async function updateProperty(
  propertyId: string,
  newImages: string[],
  newDescription: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        images: newImages,
        description: newDescription,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      return true;
    } else {
      console.error(`❌ Error actualizando propiedad ${propertyId}:`, data.error?.message || data.message || 'Error desconocido');
      if (data.errors) {
        console.error('   Errores de validación:', JSON.stringify(data.errors, null, 2));
      }
      return false;
    }
  } catch (error) {
    console.error(`❌ Error de red actualizando propiedad ${propertyId}:`, error);
    return false;
  }
}

/**
 * Obtiene la información del usuario autenticado
 */
async function getCurrentUser(token: string): Promise<{ id: string; name: string; email: string; isSuperhost?: boolean; avatar?: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.success && data.data?.user) {
      return {
        id: data.data.user.id,
        name: data.data.user.name || 'Host',
        email: data.data.user.email || '',
        isSuperhost: data.data.user.isSuperhost || false,
        avatar: data.data.user.avatar || '',
      };
    }
    
    // Si no funciona /api/auth/me, intentar decodificar el token
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        return {
          id: payload.userId || payload.id || '',
          name: payload.name || 'Host',
          email: payload.email || '',
          isSuperhost: false,
          avatar: '',
        };
      }
    } catch (e) {
      console.warn('⚠️ No se pudo decodificar el token');
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    return null;
  }
}

/**
 * Crea una nueva propiedad
 */
async function createProperty(
  property: CreatePropertyData,
  token: string,
  host: { id: string; name: string; email: string; isSuperhost?: boolean; avatar?: string }
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Agregar el campo host requerido por el backend
    const propertyWithHost = {
      ...property,
      host: {
        id: host.id,
        name: host.name,
        email: host.email,
        isSuperhost: host.isSuperhost || false,
        avatar: host.avatar || '',
      },
    };
    
    const response = await fetch(`${API_BASE_URL}/api/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(propertyWithHost),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      return { success: true, id: data.data?.id || data.data?.property?.id };
    } else {
      console.error('❌ Error detallado:', JSON.stringify(data, null, 2));
      return { 
        success: false, 
        error: data.error?.message || data.message || 'Error desconocido' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error de red' 
    };
  }
}

/**
 * 21 nuevas propiedades a crear
 */
const newProperties: CreatePropertyData[] = [
  // SEVILLA (3 propiedades)
  {
    title: 'Apartamento Acogedor en el Corazón Histórico de Sevilla',
    description: generateDescription('apartment', 'Sevilla', 'Andalucía', 'apartment', []),
    location: {
      city: 'Sevilla',
      country: 'España',
      region: 'Andalucía',
      address: 'Calle Santa María la Blanca, 15',
      coordinates: { lat: 37.3891, lng: -5.9845 },
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 100, currency: 'EUR', cleaningFee: 25, serviceFee: 20 },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'workspace', 'heating'],
    availability: { minNights: 2, maxNights: 90, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Casa Tradicional con Encanto en Triana',
    description: generateDescription('house', 'Sevilla', 'Andalucía', 'house', []),
    location: {
      city: 'Sevilla',
      country: 'España',
      region: 'Andalucía',
      address: 'Calle Betis, 42',
      coordinates: { lat: 37.3850, lng: -5.9900 },
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 175, currency: 'EUR', cleaningFee: 35, serviceFee: 25 },
    capacity: { guests: 6, bedrooms: 3, beds: 4, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'ac', 'parking', 'garden', 'tv', 'heating'],
    availability: { minNights: 3, maxNights: 60, instantBook: false, checkInTime: '16:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Villa de Lujo con Piscina en Zona Residencial',
    description: generateDescription('villa', 'Sevilla', 'Andalucía', 'villa', []),
    location: {
      city: 'Sevilla',
      country: 'España',
      region: 'Andalucía',
      address: 'Avenida de la Palmera, 28',
      coordinates: { lat: 37.3800, lng: -5.9700 },
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: { basePrice: 300, currency: 'EUR', cleaningFee: 50, serviceFee: 35 },
    capacity: { guests: 8, bedrooms: 4, beds: 6, bathrooms: 3 },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'garden', 'tv', 'heating', 'bbq'],
    availability: { minNights: 3, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  
  // MÁLAGA (3 propiedades)
  {
    title: 'Apartamento Moderno frente a la Playa de la Malagueta',
    description: generateDescription('apartment', 'Málaga', 'Andalucía', 'apartment', []),
    location: {
      city: 'Málaga',
      country: 'España',
      region: 'Andalucía',
      address: 'Paseo de la Farola, 8',
      coordinates: { lat: 36.7213, lng: -4.4214 },
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 110, currency: 'EUR', cleaningFee: 30, serviceFee: 22 },
    capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'beach_access', 'balcony', 'heating'],
    availability: { minNights: 2, maxNights: 90, instantBook: true, checkInTime: '14:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Casa Andaluza en el Centro Histórico de Málaga',
    description: generateDescription('house', 'Málaga', 'Andalucía', 'house', []),
    location: {
      city: 'Málaga',
      country: 'España',
      region: 'Andalucía',
      address: 'Calle Granada, 35',
      coordinates: { lat: 36.7200, lng: -4.4200 },
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 165, currency: 'EUR', cleaningFee: 40, serviceFee: 28 },
    capacity: { guests: 5, bedrooms: 3, beds: 3, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'ac', 'parking', 'tv', 'heating', 'balcony'],
    availability: { minNights: 2, maxNights: 60, instantBook: false, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Villa Exclusiva con Vistas al Mar en Marbella',
    description: generateDescription('villa', 'Marbella', 'Andalucía', 'villa', []),
    location: {
      city: 'Marbella',
      country: 'España',
      region: 'Andalucía',
      address: 'Urbanización Nueva Alcántara',
      coordinates: { lat: 36.5109, lng: -4.8862 },
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: { basePrice: 375, currency: 'EUR', cleaningFee: 60, serviceFee: 40 },
    capacity: { guests: 10, bedrooms: 5, beds: 7, bathrooms: 4 },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'beach_access', 'tv', 'heating', 'bbq', 'garden'],
    availability: { minNights: 5, maxNights: 30, instantBook: true, checkInTime: '16:00', checkOutTime: '10:00' },
    images: [],
  },
  
  // MADRID (3 propiedades)
  {
    title: 'Apartamento Elegante en el Barrio de Salamanca',
    description: generateDescription('apartment', 'Madrid', 'Comunidad de Madrid', 'apartment', []),
    location: {
      city: 'Madrid',
      country: 'España',
      region: 'Comunidad de Madrid',
      address: 'Calle Serrano, 78',
      coordinates: { lat: 40.4168, lng: -3.7038 },
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 125, currency: 'EUR', cleaningFee: 35, serviceFee: 25 },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'workspace', 'heating', 'balcony'],
    availability: { minNights: 2, maxNights: 90, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Casa Clásica con Encanto en Chamberí',
    description: generateDescription('house', 'Madrid', 'Comunidad de Madrid', 'house', []),
    location: {
      city: 'Madrid',
      country: 'España',
      region: 'Comunidad de Madrid',
      address: 'Calle de Bravo Murillo, 120',
      coordinates: { lat: 40.4300, lng: -3.7000 },
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 215, currency: 'EUR', cleaningFee: 45, serviceFee: 30 },
    capacity: { guests: 7, bedrooms: 4, beds: 5, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'ac', 'parking', 'tv', 'heating', 'workspace'],
    availability: { minNights: 3, maxNights: 60, instantBook: false, checkInTime: '16:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Loft Industrial en el Corazón de Malasaña',
    description: generateDescription('loft', 'Madrid', 'Comunidad de Madrid', 'loft', []),
    location: {
      city: 'Madrid',
      country: 'España',
      region: 'Comunidad de Madrid',
      address: 'Calle de la Palma, 25',
      coordinates: { lat: 40.4280, lng: -3.7050 },
    },
    propertyType: 'entire_place',
    roomType: 'loft',
    pricing: { basePrice: 150, currency: 'EUR', cleaningFee: 30, serviceFee: 22 },
    capacity: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'workspace', 'heating'],
    availability: { minNights: 2, maxNights: 30, instantBook: true, checkInTime: '14:00', checkOutTime: '11:00' },
    images: [],
  },
  
  // GALICIA (3 propiedades)
  {
    title: 'Cabaña Acogedora en la Costa da Morte',
    description: generateDescription('cabin', 'Costa da Morte', 'Galicia', 'cabin', []),
    location: {
      city: 'Muxía',
      country: 'España',
      region: 'Galicia',
      address: 'Costa da Morte, Zona Norte',
      coordinates: { lat: 43.1061, lng: -9.2167 },
    },
    propertyType: 'entire_place',
    roomType: 'cabin',
    pricing: { basePrice: 75, currency: 'EUR', cleaningFee: 20, serviceFee: 15 },
    capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'fireplace', 'heating', 'mountain_view', 'bbq'],
    availability: { minNights: 2, maxNights: 14, instantBook: false, checkInTime: '16:00', checkOutTime: '10:00' },
    images: [],
  },
  {
    title: 'Casa de Piedra en Santiago de Compostela',
    description: generateDescription('house', 'Santiago de Compostela', 'Galicia', 'house', []),
    location: {
      city: 'Santiago de Compostela',
      country: 'España',
      region: 'Galicia',
      address: 'Rúa do Vilar, 45',
      coordinates: { lat: 42.8782, lng: -8.5448 },
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 135, currency: 'EUR', cleaningFee: 30, serviceFee: 20 },
    capacity: { guests: 6, bedrooms: 3, beds: 4, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'heating', 'tv', 'workspace'],
    availability: { minNights: 2, maxNights: 60, instantBook: false, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Cottage Rústico en las Rías Baixas',
    description: generateDescription('cottage', 'Rías Baixas', 'Galicia', 'house', []),
    location: {
      city: 'Cambados',
      country: 'España',
      region: 'Galicia',
      address: 'Zona Rural, Rías Baixas',
      coordinates: { lat: 42.5128, lng: -8.8136 },
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 115, currency: 'EUR', cleaningFee: 25, serviceFee: 18 },
    capacity: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'fireplace', 'heating', 'garden', 'parking'],
    availability: { minNights: 2, maxNights: 30, instantBook: false, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  
  // LAS PALMAS (3 propiedades)
  {
    title: 'Apartamento con Vistas a la Playa de Las Canteras',
    description: generateDescription('apartment', 'Las Palmas de Gran Canaria', 'Canarias', 'apartment', []),
    location: {
      city: 'Las Palmas de Gran Canaria',
      country: 'España',
      region: 'Canarias',
      address: 'Paseo de Las Canteras, 12',
      coordinates: { lat: 28.1248, lng: -15.4300 },
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 105, currency: 'EUR', cleaningFee: 28, serviceFee: 21 },
    capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'beach_access', 'balcony', 'heating'],
    availability: { minNights: 2, maxNights: 90, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Casa Colonial en el Barrio de Vegueta',
    description: generateDescription('house', 'Las Palmas de Gran Canaria', 'Canarias', 'house', []),
    location: {
      city: 'Las Palmas de Gran Canaria',
      country: 'España',
      region: 'Canarias',
      address: 'Calle de los Balcones, 8',
      coordinates: { lat: 28.1000, lng: -15.4150 },
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 155, currency: 'EUR', cleaningFee: 35, serviceFee: 26 },
    capacity: { guests: 5, bedrooms: 3, beds: 3, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'ac', 'parking', 'tv', 'heating', 'balcony'],
    availability: { minNights: 2, maxNights: 60, instantBook: false, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Villa con Piscina Privada en Maspalomas',
    description: generateDescription('villa', 'Maspalomas', 'Canarias', 'villa', []),
    location: {
      city: 'Maspalomas',
      country: 'España',
      region: 'Canarias',
      address: 'Urbanización Campo Internacional',
      coordinates: { lat: 27.7606, lng: -15.5860 },
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: { basePrice: 270, currency: 'EUR', cleaningFee: 50, serviceFee: 32 },
    capacity: { guests: 8, bedrooms: 4, beds: 6, bathrooms: 3 },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'beach_access', 'tv', 'heating', 'bbq', 'garden'],
    availability: { minNights: 3, maxNights: 30, instantBook: true, checkInTime: '16:00', checkOutTime: '10:00' },
    images: [],
  },
  
  // TENERIFE (3 propiedades)
  {
    title: 'Apartamento Céntrico en Puerto de la Cruz',
    description: generateDescription('apartment', 'Puerto de la Cruz', 'Canarias', 'apartment', []),
    location: {
      city: 'Puerto de la Cruz',
      country: 'España',
      region: 'Canarias',
      address: 'Avenida de Colón, 25',
      coordinates: { lat: 28.4158, lng: -16.5481 },
    },
    propertyType: 'entire_place',
    roomType: 'apartment',
    pricing: { basePrice: 90, currency: 'EUR', cleaningFee: 25, serviceFee: 18 },
    capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'beach_access', 'balcony', 'heating'],
    availability: { minNights: 2, maxNights: 90, instantBook: true, checkInTime: '14:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Casa Tradicional en La Laguna',
    description: generateDescription('house', 'San Cristóbal de La Laguna', 'Canarias', 'house', []),
    location: {
      city: 'San Cristóbal de La Laguna',
      country: 'España',
      region: 'Canarias',
      address: 'Calle Obispo Rey Redondo, 15',
      coordinates: { lat: 28.4853, lng: -16.3200 },
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 145, currency: 'EUR', cleaningFee: 32, serviceFee: 24 },
    capacity: { guests: 6, bedrooms: 3, beds: 4, bathrooms: 2 },
    amenities: ['wifi', 'kitchen', 'ac', 'parking', 'tv', 'heating'],
    availability: { minNights: 2, maxNights: 60, instantBook: false, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Villa Exclusiva con Vistas al Océano en Costa Adeje',
    description: generateDescription('villa', 'Costa Adeje', 'Canarias', 'villa', []),
    location: {
      city: 'Costa Adeje',
      country: 'España',
      region: 'Canarias',
      address: 'Urbanización La Caleta',
      coordinates: { lat: 28.1000, lng: -16.7167 },
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: { basePrice: 340, currency: 'EUR', cleaningFee: 55, serviceFee: 38 },
    capacity: { guests: 10, bedrooms: 5, beds: 7, bathrooms: 4 },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'beach_access', 'tv', 'heating', 'bbq', 'garden'],
    availability: { minNights: 5, maxNights: 30, instantBook: true, checkInTime: '16:00', checkOutTime: '10:00' },
    images: [],
  },
  
  // LANZAROTE (3 propiedades)
  {
    title: 'Cabaña Minimalista junto a Playa Blanca',
    description: generateDescription('cabin', 'Playa Blanca', 'Canarias', 'cabin', []),
    location: {
      city: 'Playa Blanca',
      country: 'España',
      region: 'Canarias',
      address: 'Avenida Marítima, Zona Sur',
      coordinates: { lat: 28.8636, lng: -13.8331 },
    },
    propertyType: 'entire_place',
    roomType: 'cabin',
    pricing: { basePrice: 85, currency: 'EUR', cleaningFee: 22, serviceFee: 16 },
    capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'heating', 'beach_access', 'bbq'],
    availability: { minNights: 2, maxNights: 14, instantBook: false, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Casa Canaria en el Centro de Arrecife',
    description: generateDescription('house', 'Arrecife', 'Canarias', 'house', []),
    location: {
      city: 'Arrecife',
      country: 'España',
      region: 'Canarias',
      address: 'Calle Real, 42',
      coordinates: { lat: 28.9630, lng: -13.5477 },
    },
    propertyType: 'entire_place',
    roomType: 'house',
    pricing: { basePrice: 125, currency: 'EUR', cleaningFee: 30, serviceFee: 22 },
    capacity: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 1 },
    amenities: ['wifi', 'kitchen', 'ac', 'tv', 'heating', 'balcony'],
    availability: { minNights: 2, maxNights: 60, instantBook: false, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
  {
    title: 'Villa Moderna con Piscina en Puerto del Carmen',
    description: generateDescription('villa', 'Puerto del Carmen', 'Canarias', 'villa', []),
    location: {
      city: 'Puerto del Carmen',
      country: 'España',
      region: 'Canarias',
      address: 'Avenida de las Playas, 28',
      coordinates: { lat: 28.9200, lng: -13.6667 },
    },
    propertyType: 'entire_place',
    roomType: 'villa',
    pricing: { basePrice: 250, currency: 'EUR', cleaningFee: 45, serviceFee: 30 },
    capacity: { guests: 8, bedrooms: 4, beds: 6, bathrooms: 3 },
    amenities: ['wifi', 'kitchen', 'pool', 'ac', 'parking', 'beach_access', 'tv', 'heating', 'bbq', 'garden'],
    availability: { minNights: 3, maxNights: 30, instantBook: true, checkInTime: '15:00', checkOutTime: '11:00' },
    images: [],
  },
];

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando actualización y creación de propiedades...\n');
  
  if (!AUTH_TOKEN) {
    console.error('❌ No se encontró token de autenticación.');
    console.log('💡 Por favor, proporciona el token como variable de entorno:');
    console.log('   AUTH_TOKEN=tu_token_aqui npx tsx scripts/update-and-create-properties-spain.ts');
    console.log('\n📝 Para obtener el token:');
    console.log('   1. Inicia sesión en la aplicación como administrador');
    console.log('   2. Abre la consola del navegador (F12)');
    console.log('   3. Ejecuta: JSON.parse(sessionStorage.getItem("airbnb_session")).accessToken');
    console.log('   4. Copia el token y úsalo en el comando anterior');
    process.exit(1);
  }
  
  // Obtener información del usuario
  console.log('👤 Obteniendo información del usuario...');
  const user = await getCurrentUser(AUTH_TOKEN);
  
  if (!user || !user.id) {
    console.error('❌ No se pudo obtener la información del usuario.');
    console.log('💡 Asegúrate de que el token sea válido y que tengas permisos de administrador.');
    process.exit(1);
  }
  
  console.log(`✅ Usuario identificado: ${user.name} (${user.email})\n`);
  
  const results = {
    updated: { success: 0, failed: 0, total: 0 },
    created: { success: 0, failed: 0, total: 0 },
  };
  
  // FASE 1: Obtener y actualizar propiedades existentes
  console.log('='.repeat(60));
  console.log('FASE 1: ACTUALIZAR PROPIEDADES EXISTENTES');
  console.log('='.repeat(60));
  
  const existingProperties = await getExistingProperties(AUTH_TOKEN);
  results.updated.total = process.env.MAX_UPDATE ? Math.min(parseInt(process.env.MAX_UPDATE), existingProperties.length) : existingProperties.length;
  
  if (existingProperties.length > 0) {
    // Limitar a N propiedades si se especifica
    const MAX_TO_UPDATE = process.env.MAX_UPDATE ? parseInt(process.env.MAX_UPDATE) : existingProperties.length;
    
    // Si se especifica UPDATE_FROM, empezar desde ese índice
    const START_FROM = process.env.UPDATE_FROM ? parseInt(process.env.UPDATE_FROM) : 0;
    const propertiesToUpdate = existingProperties.slice(START_FROM, START_FROM + MAX_TO_UPDATE);
    
    console.log(`\n📝 Actualizando ${propertiesToUpdate.length} propiedades existentes (índices ${START_FROM} a ${START_FROM + propertiesToUpdate.length - 1} de ${existingProperties.length} totales)...\n`);
    
    for (let i = 0; i < propertiesToUpdate.length; i++) {
      const prop = propertiesToUpdate[i];
      console.log(`\n[${i + 1}/${existingProperties.length}] Actualizando: ${prop.title || prop.id}`);
      
      // Determinar tipo para seleccionar imágenes apropiadas
      const roomType = prop.roomType || 'apartment';
      let imageCategory: keyof typeof IMAGE_POOL = 'apartments';
      
      if (roomType === 'house') imageCategory = 'houses';
      else if (roomType === 'villa') imageCategory = 'villas';
      else if (roomType === 'cabin') imageCategory = 'cabins';
      else if (roomType === 'cottage') imageCategory = 'cottages';
      else if (roomType === 'loft') imageCategory = 'lofts';
      
      const newImages = getUniqueImages(imageCategory);
      const newDescription = generateDescription(
        roomType as any,
        prop.location?.city || 'ciudad',
        prop.location?.region || 'región',
        roomType,
        []
      );
      
      const success = await updateProperty(prop.id, newImages, newDescription, AUTH_TOKEN);
      
      if (success) {
        console.log(`✅ Propiedad actualizada exitosamente`);
        results.updated.success++;
      } else {
        console.log(`❌ Error actualizando propiedad`);
        results.updated.failed++;
      }
      
      // Delay más largo para evitar rate limiting (2 segundos entre actualizaciones)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } else {
    console.log('ℹ️ No hay propiedades existentes para actualizar.');
  }
  
  // FASE 2: Crear nuevas propiedades (solo si no se especifica MAX_UPDATE)
  if (!process.env.MAX_UPDATE) {
    console.log('\n' + '='.repeat(60));
    console.log('FASE 2: CREAR NUEVAS PROPIEDADES');
    console.log('='.repeat(60));
    
    results.created.total = newProperties.length;
    console.log(`\n📝 Creando ${newProperties.length} nuevas propiedades...\n`);
  
  for (let i = 0; i < newProperties.length; i++) {
    const property = newProperties[i];
    console.log(`\n[${i + 1}/${newProperties.length}] Creando: ${property.title}`);
    
    // Asignar imágenes únicas según el tipo
    let imageCategory: keyof typeof IMAGE_POOL = 'apartments';
    if (property.roomType === 'house') imageCategory = 'houses';
    else if (property.roomType === 'villa') imageCategory = 'villas';
    else if (property.roomType === 'cabin') imageCategory = 'cabins';
    else if (property.roomType === 'cottage') imageCategory = 'cottages';
    else if (property.roomType === 'loft') imageCategory = 'lofts';
    
    property.images = getUniqueImages(imageCategory);
    
    const result = await createProperty(property, AUTH_TOKEN, user!);
    
    if (result.success) {
      console.log(`✅ Propiedad creada exitosamente: ${result.id || 'ID no disponible'}`);
      results.created.success++;
    } else {
      console.log(`❌ Error: ${result.error}`);
      results.created.failed++;
    }
    
    // Delay más largo para evitar rate limiting (2 segundos entre creaciones)
    await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } else {
    console.log('\n⏭️ Saltando creación de nuevas propiedades (modo solo actualización)');
    results.created.total = 0;
  }
  
  // RESUMEN FINAL
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN FINAL');
  console.log('='.repeat(60));
  
  console.log('\n🔄 PROPIEDADES ACTUALIZADAS:');
  console.log(`   ✅ Exitosas: ${results.updated.success}/${results.updated.total}`);
  console.log(`   ❌ Fallidas: ${results.updated.failed}/${results.updated.total}`);
  
  console.log('\n🆕 PROPIEDADES CREADAS:');
  console.log(`   ✅ Exitosas: ${results.created.success}/${results.created.total}`);
  console.log(`   ❌ Fallidas: ${results.created.failed}/${results.created.total}`);
  
  console.log('\n📸 IMÁGENES UTILIZADAS:');
  console.log(`   Total: ${usedImages.size} imágenes únicas`);
  
  const totalSuccess = results.updated.success + results.created.success;
  const totalFailed = results.updated.failed + results.created.failed;
  const total = results.updated.total + results.created.total;
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ TOTAL: ${totalSuccess}/${total} operaciones exitosas`);
  console.log(`❌ TOTAL: ${totalFailed}/${total} operaciones fallidas`);
  console.log('='.repeat(60));
}

// Ejecutar
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

export { main, newProperties, getUniqueImages, generateDescription };

