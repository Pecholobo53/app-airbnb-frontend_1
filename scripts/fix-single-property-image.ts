/**
 * Script para corregir imágenes de una propiedad específica
 * Reemplaza imágenes que no se cargan con imágenes confiables
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const PROPERTY_ID = process.env.PROPERTY_ID || '6952c20cede9905614c48552';

if (!AUTH_TOKEN) {
  console.error('❌ Error: AUTH_TOKEN no proporcionado');
  console.log('💡 Uso: AUTH_TOKEN="tu_token" PROPERTY_ID="id_propiedad" npx tsx scripts/fix-single-property-image.ts');
  process.exit(1);
}

// Pool de imágenes confiables de Pexels para apartamentos
const APARTMENT_IMAGES = [
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

// Función para validar si una imagen se carga correctamente
async function validateImage(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch (error) {
    return false;
  }
}

// Función para obtener una propiedad por ID
async function getProperty(propertyId: string): Promise<any | null> {
  try {
    const url = `${API_BASE_URL}/api/properties/${propertyId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Error obteniendo propiedad: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data?.property || data.property || data.data || null;
  } catch (error) {
    console.error('❌ Error de red obteniendo propiedad:', error);
    return null;
  }
}

// Función para actualizar una propiedad
async function updateProperty(propertyId: string, images: string[]): Promise<boolean> {
  try {
    const url = `${API_BASE_URL}/api/properties/${propertyId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: images,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ Error actualizando propiedad: ${errorData.error?.message || response.statusText}`);
      return false;
    }

    const data = await response.json();
    return data.success !== false;
  } catch (error) {
    console.error('❌ Error de red actualizando propiedad:', error);
    return false;
  }
}

// Función principal
async function main() {
  console.log(`\n🔍 Corrigiendo imágenes de propiedad: ${PROPERTY_ID}`);
  console.log('=' .repeat(60));

  // Obtener propiedad
  console.log('\n📥 Obteniendo información de la propiedad...');
  const property = await getProperty(PROPERTY_ID);

  if (!property) {
    console.error('❌ No se pudo obtener la propiedad');
    process.exit(1);
  }

  console.log(`✅ Propiedad encontrada: ${property.title || property.id}`);
  console.log(`   Tipo: ${property.roomType || 'N/A'}`);
  console.log(`   Imágenes actuales: ${(property.images || []).length}`);

  const currentImages = property.images || [];
  const roomType = property.roomType || 'apartment';

  // Validar imágenes
  console.log('\n🔍 Validando imágenes...');
  const validImages: string[] = [];
  const invalidIndices: number[] = [];

  for (let i = 0; i < currentImages.length; i++) {
    const img = currentImages[i];
    
    // Si es Base64, asumimos que es válida
    if (img.startsWith('data:image/')) {
      validImages.push(img);
      console.log(`   ✅ Imagen ${i + 1}: Base64 (válida)`);
    } else if (img.includes('placeholder-property.jpg')) {
      // Placeholder, necesita reemplazo
      invalidIndices.push(i);
      console.log(`   ⚠️ Imagen ${i + 1}: Placeholder (necesita reemplazo)`);
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
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Si hay imágenes inválidas o faltantes, reemplazarlas
  if (invalidIndices.length > 0 || validImages.length < 3) {
    console.log(`\n🔄 Reemplazando ${invalidIndices.length} imágenes inválidas...`);
    
    // Usar imágenes de apartamentos (ya que la propiedad es un apartamento)
    const replacementImages = [...APARTMENT_IMAGES];
    
    // Reemplazar imágenes inválidas
    for (const index of invalidIndices) {
      const replacement = replacementImages.shift() || APARTMENT_IMAGES[0];
      if (validImages[index]) {
        validImages[index] = replacement;
      } else {
        validImages.push(replacement);
      }
      console.log(`   ✅ Reemplazada imagen ${index + 1} con: ${replacement.substring(0, 60)}...`);
    }
    
    // Asegurar que siempre haya al menos 3 imágenes
    while (validImages.length < 3) {
      const newImage = replacementImages.shift() || APARTMENT_IMAGES[validImages.length % APARTMENT_IMAGES.length];
      validImages.push(newImage);
      console.log(`   ✅ Agregada imagen ${validImages.length}: ${newImage.substring(0, 60)}...`);
    }

    // Limitar a máximo 5 imágenes
    const finalImages = validImages.slice(0, 5);

    // Actualizar propiedad
    console.log(`\n💾 Actualizando propiedad con ${finalImages.length} imágenes...`);
    const success = await updateProperty(PROPERTY_ID, finalImages);

    if (success) {
      console.log(`\n✅ Propiedad actualizada exitosamente!`);
      console.log(`   Total de imágenes: ${finalImages.length}`);
      console.log(`\n🔗 Ver en: http://localhost:3001/propiedad/${PROPERTY_ID}`);
    } else {
      console.error(`\n❌ Error al actualizar la propiedad`);
      process.exit(1);
    }
  } else {
    console.log(`\n✅ Todas las imágenes son válidas, no se requiere actualización`);
  }

  console.log('\n' + '='.repeat(60));
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

