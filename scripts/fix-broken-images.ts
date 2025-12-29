/**
 * Script para corregir imágenes rotas o cortadas en propiedades
 * Reemplaza imágenes que no se cargan con imágenes confiables de Pexels
 */

import { Buffer } from 'buffer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error('❌ Error: AUTH_TOKEN no proporcionado');
  console.log('💡 Uso: AUTH_TOKEN="tu_token" npx tsx scripts/fix-broken-images.ts');
  process.exit(1);
}

// Pool de imágenes confiables de Pexels (URLs reales y verificadas)
const RELIABLE_IMAGES = {
  houses: [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  apartments: [
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  villas: [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  cabins: [
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  lofts: [
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  cottages: [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
};

// Función para validar si una imagen se carga correctamente
async function validateImage(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch (error) {
    return false;
  }
}

// Función para obtener todas las propiedades
async function getAllProperties(): Promise<any[]> {
  const allProperties: any[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    try {
      const url = `${API_BASE_URL}/api/properties/search?page=${page}&perPage=${perPage}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`❌ Error obteniendo página ${page}: ${response.status}`);
        break;
      }

      const data = await response.json();
      const properties = data.data?.properties || data.properties || [];

      if (properties.length === 0) {
        break;
      }

      allProperties.push(...properties);
      console.log(`📄 Página ${page}: ${properties.length} propiedades (Total acumulado: ${allProperties.length})`);

      if (properties.length < perPage) {
        break;
      }

      page++;
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay para evitar rate limiting
    } catch (error) {
      console.error(`❌ Error en página ${page}:`, error);
      break;
    }
  }

  return allProperties;
}

// Función para obtener imágenes confiables según el tipo
function getReliableImages(roomType: string, count: number = 3): string[] {
  let category: keyof typeof RELIABLE_IMAGES = 'apartments';
  
  if (roomType === 'house') category = 'houses';
  else if (roomType === 'villa') category = 'villas';
  else if (roomType === 'cabin') category = 'cabins';
  else if (roomType === 'loft') category = 'lofts';
  else if (roomType === 'cottage') category = 'cottages';
  
  const pool = RELIABLE_IMAGES[category];
  const images: string[] = [];
  
  for (let i = 0; i < count; i++) {
    images.push(pool[i % pool.length]);
  }
  
  return images;
}

// Función para actualizar imágenes de una propiedad
async function fixPropertyImages(property: any): Promise<boolean> {
  try {
    const roomType = property.roomType || 'apartment';
    const currentImages = property.images || [];
    
    console.log(`\n🔍 Validando imágenes de: ${property.title || property.id}`);
    console.log(`   Tipo: ${roomType}, Imágenes actuales: ${currentImages.length}`);
    
    // Validar cada imagen
    const validImages: string[] = [];
    const invalidIndices: number[] = [];
    
    for (let i = 0; i < currentImages.length; i++) {
      const img = currentImages[i];
      
      // Si es Base64, asumimos que es válida
      if (img.startsWith('data:image/')) {
        validImages.push(img);
        console.log(`   ✅ Imagen ${i + 1}: Base64 (válida)`);
      } else {
        const isValid = await validateImage(img);
        if (isValid) {
          validImages.push(img);
          console.log(`   ✅ Imagen ${i + 1}: ${img.substring(0, 60)}... (válida)`);
        } else {
          invalidIndices.push(i);
          console.log(`   ❌ Imagen ${i + 1}: ${img.substring(0, 60)}... (rota)`);
        }
      }
      
      // Delay pequeño entre validaciones
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Si hay imágenes inválidas, reemplazarlas
    if (invalidIndices.length > 0 || validImages.length < 3) {
      const neededImages = Math.max(3 - validImages.length, invalidIndices.length);
      const replacementImages = getReliableImages(roomType, neededImages);
      
      console.log(`   🔄 Reemplazando ${invalidIndices.length} imágenes rotas + agregando ${neededImages - invalidIndices.length} nuevas`);
      
      // Reemplazar imágenes inválidas
      for (const index of invalidIndices) {
        const replacement = replacementImages.shift() || getReliableImages(roomType, 1)[0];
        validImages[index] = replacement;
      }
      
      // Agregar imágenes faltantes
      while (validImages.length < 3 && replacementImages.length > 0) {
        validImages.push(replacementImages.shift()!);
      }
      
      // Asegurar que siempre haya al menos 3 imágenes
      while (validImages.length < 3) {
        validImages.push(...getReliableImages(roomType, 3 - validImages.length));
      }
      
      // Actualizar propiedad
      const updateUrl = `${API_BASE_URL}/api/properties/${property.id}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: validImages.slice(0, 3), // Solo las primeras 3
        }),
      });
      
      if (updateResponse.ok) {
        console.log(`   ✅ Propiedad actualizada con ${validImages.length} imágenes válidas`);
        return true;
      } else {
        const errorData = await updateResponse.json();
        console.error(`   ❌ Error actualizando: ${errorData.error?.message || updateResponse.statusText}`);
        return false;
      }
    } else {
      console.log(`   ✅ Todas las imágenes son válidas`);
      return true;
    }
  } catch (error) {
    console.error(`   ❌ Error procesando propiedad:`, error);
    return false;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando corrección de imágenes rotas...\n');
  
  // Obtener todas las propiedades
  console.log('📋 Obteniendo todas las propiedades...');
  const properties = await getAllProperties();
  console.log(`✅ Total de propiedades encontradas: ${properties.length}\n`);
  
  if (properties.length === 0) {
    console.log('⚠️ No se encontraron propiedades');
    return;
  }
  
  // Procesar cada propiedad
  const results = { success: 0, failed: 0, skipped: 0 };
  
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    
    console.log(`\n[${i + 1}/${properties.length}] Procesando: ${property.title || property.id}`);
    
    const success = await fixPropertyImages(property);
    
    if (success) {
      results.success++;
    } else {
      results.failed++;
    }
    
      // Delay entre propiedades para evitar rate limiting (aumentado a 2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN FINAL');
  console.log('='.repeat(60));
  console.log(`✅ Exitosas: ${results.success}`);
  console.log(`❌ Fallidas: ${results.failed}`);
  console.log(`⏭️  Omitidas: ${results.skipped}`);
  console.log('='.repeat(60));
}

main().catch(console.error);

