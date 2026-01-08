// scripts/update-test-properties.ts
/**
 * Script para actualizar propiedades con títulos de prueba
 * Reescribe títulos y descripciones de propiedades que contengan "test", "stripe", etc.
 * 
 * Ejecutar desde la consola del navegador (copiar y pegar) o con: npx tsx scripts/update-test-properties.ts
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Palabras clave para identificar propiedades de prueba
const TEST_KEYWORDS = ['test', 'stripe', 'prueba', 'demo', 'ejemplo'];

// Plantillas de propiedades profesionales basadas en el ejemplo proporcionado
const PROFESSIONAL_PROPERTIES = [
  {
    title: 'Villa con Piscina Privada en Maspalomas',
    description: `Lujosa villa en Maspalomas, Canarias, diseñada para ofrecerte una experiencia de alojamiento excepcional. Este espacio exclusivo combina elegancia, confort y privacidad en un entorno privilegiado. La villa cuenta con amplias estancias, diseño contemporáneo y acabados de alta calidad. Disfruta de espacios exteriores privados, áreas de descanso y entretenimiento, y todas las comodidades que esperarías de un alojamiento de lujo. Ubicada en una de las mejores zonas de Maspalomas, podrás disfrutar de la tranquilidad y privacidad mientras tienes fácil acceso a playas, restaurantes de alta cocina, y actividades exclusivas. El entorno es perfecto para desconectar y relajarse. Las comodidades premium incluyen piscina privada, WiFi de alta velocidad, aire acondicionado en todas las estancias, cocina gourmet completamente equipada, y espacios diseñados para el máximo confort. Ideal para familias, grupos de amigos o quienes buscan una experiencia de lujo. Desde la villa podrás disfrutar de Maspalomas con el máximo confort y privacidad. Cada detalle ha sido cuidadosamente pensado para que tu estancia sea inolvidable.`,
    location: { city: 'Maspalomas', country: 'España', region: 'Canarias' },
  },
  {
    title: 'Apartamento Moderno con Vista al Mar en Las Palmas',
    description: `Elegante apartamento completamente renovado en el corazón de Las Palmas de Gran Canaria, con vistas espectaculares al océano Atlántico. Este espacio contemporáneo combina diseño moderno con comodidades de primera clase. Ubicado en una zona privilegiada, tendrás acceso directo a las mejores playas de la ciudad, restaurantes de renombre y vida nocturna vibrante. El apartamento cuenta con amplias terrazas donde podrás disfrutar de desayunos con vistas al mar y atardeceres inolvidables. Interiormente, encontrarás espacios luminosos, decoración cuidadosamente seleccionada y todas las amenidades necesarias para una estancia perfecta. Perfecto para parejas o familias pequeñas que buscan combinar relax y aventura. La ubicación estratégica te permite explorar la rica cultura canaria, disfrutar de deportes acuáticos, y descubrir la gastronomía local. Cada rincón ha sido pensado para ofrecerte el máximo confort y una experiencia auténtica de las Islas Canarias.`,
    location: { city: 'Las Palmas de Gran Canaria', country: 'España', region: 'Canarias' },
  },
  {
    title: 'Casa Tradicional Canaria con Encanto en Teguise',
    description: `Hermosa casa tradicional canaria restaurada con mimo, ubicada en el histórico pueblo de Teguise, Lanzarote. Esta propiedad única combina el encanto arquitectónico canario con todas las comodidades modernas. La casa mantiene elementos originales como muros de piedra volcánica, techos de madera y patios interiores, creando una atmósfera auténtica y acogedora. Ubicada en una de las zonas más pintorescas de la isla, podrás disfrutar de la tranquilidad de un pueblo tradicional mientras tienes fácil acceso a las playas más hermosas de Lanzarote. El espacio exterior incluye un patio privado perfecto para relajarse y disfrutar del clima canario. Ideal para quienes buscan una experiencia auténtica, lejos del bullicio turístico, pero con todas las comodidades necesarias. La casa está equipada con WiFi, cocina completa, y espacios cómodos para descansar después de explorar la isla. Descubre la verdadera esencia de Lanzarote desde este alojamiento único y lleno de carácter.`,
    location: { city: 'Teguise', country: 'España', region: 'Canarias' },
  },
  {
    title: 'Villa de Lujo con Piscina Infinita en Costa Teguise',
    description: `Excepcional villa de diseño contemporáneo en Costa Teguise, Lanzarote, con piscina infinita y vistas panorámicas al océano. Esta propiedad de lujo ha sido diseñada para ofrecer la máxima privacidad y confort. La villa cuenta con amplios espacios interiores y exteriores, decoración de alta gama y acabados de primera calidad. La piscina infinita es el punto focal del espacio exterior, creando una experiencia visual única mientras disfrutas del clima privilegiado de las Canarias. Ubicada en una zona residencial exclusiva, la villa ofrece tranquilidad absoluta mientras mantiene proximidad a playas, campos de golf y restaurantes de alta cocina. Perfecta para familias o grupos que buscan una experiencia de lujo y relajación. Las comodidades incluyen piscina privada, WiFi de alta velocidad, aire acondicionado en todas las estancias, cocina gourmet completamente equipada, y espacios de entretenimiento. Cada detalle ha sido cuidadosamente seleccionado para crear una estancia memorable en uno de los destinos más exclusivos de Lanzarote.`,
    location: { city: 'Costa Teguise', country: 'España', region: 'Canarias' },
  },
  {
    title: 'Apartamento Acogedor en el Centro Histórico de Arrecife',
    description: `Encantador apartamento completamente renovado en el corazón histórico de Arrecife, capital de Lanzarote. Este espacio acogedor combina el encanto de un edificio tradicional canario con todas las comodidades modernas. Ubicado en una zona peatonal, podrás disfrutar de la auténtica vida local, con cafeterías, restaurantes y tiendas a pocos pasos. El apartamento cuenta con espacios luminosos, decoración cuidadosa y un ambiente cálido que te hará sentir como en casa. Perfecto para parejas o viajeros solos que buscan una base cómoda para explorar la isla. Desde aquí podrás acceder fácilmente a todas las atracciones principales de Lanzarote, incluyendo los famosos Jameos del Agua, el Mirador del Río y las playas más hermosas. El apartamento está equipado con WiFi, cocina completa, y todas las amenidades necesarias para una estancia confortable. Disfruta de la autenticidad de Arrecife mientras te alojas en un espacio moderno y bien equipado.`,
    location: { city: 'Arrecife', country: 'España', region: 'Canarias' },
  },
];

/**
 * Función para detectar si un título es de prueba
 */
function isTestProperty(title: string): boolean {
  const lowerTitle = title.toLowerCase();
  return TEST_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
}

/**
 * Función para obtener una propiedad profesional aleatoria
 */
function getRandomProfessionalProperty() {
  return PROFESSIONAL_PROPERTIES[
    Math.floor(Math.random() * PROFESSIONAL_PROPERTIES.length)
  ];
}

/**
 * Función principal para actualizar propiedades
 */
async function updateTestProperties(tokenOverride?: string) {
  let token: string | null = null;

  // Si se pasa un token como parámetro, usarlo (útil para Node.js)
  if (tokenOverride) {
    token = tokenOverride;
  } else if (typeof window !== 'undefined') {
    // En el navegador, obtener token del sessionStorage
    const session = sessionStorage.getItem('airbnb_session');
    
    if (!session) {
      throw new Error('No hay sesión. Por favor, inicia sesión primero.');
    }

    try {
      const parsed = JSON.parse(session);
      token = parsed.accessToken || parsed.token || parsed.access_token;
    } catch (error) {
      throw new Error('Error al parsear la sesión');
    }
  } else {
    // En Node.js, intentar obtener de variable de entorno
    token = process.env.AIRBNB_TOKEN || null;
    
    if (!token) {
      throw new Error(
        'No se encontró el token de autenticación.\n' +
        'Opciones:\n' +
        '1. Ejecuta este script desde la consola del navegador (recomendado)\n' +
        '2. O establece la variable de entorno: AIRBNB_TOKEN=tu_token\n' +
        '3. O pasa el token como parámetro: updateTestProperties("tu_token")'
      );
    }
  }

  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  console.log('🔍 Buscando propiedades con títulos de prueba...');

  // Buscar todas las propiedades
  try {
    const searchResponse = await fetch(`${API_BASE_URL}/api/properties/search?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      throw new Error(`Error al buscar propiedades: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const properties = searchData.data?.properties || searchData.properties || [];

    console.log(`📋 Encontradas ${properties.length} propiedades`);

    // Filtrar propiedades de prueba
    const testProperties = properties.filter((prop: any) => 
      isTestProperty(prop.title || '')
    );

    console.log(`🎯 Encontradas ${testProperties.length} propiedades con títulos de prueba`);

    if (testProperties.length === 0) {
      console.log('✅ No se encontraron propiedades de prueba para actualizar');
      return;
    }

    // Actualizar cada propiedad
    const results = [];
    for (const property of testProperties) {
      const professional = getRandomProfessionalProperty();
      
      console.log(`\n🔄 Actualizando: "${property.title}"`);
      console.log(`   Nuevo título: "${professional.title}"`);

      try {
        const updateResponse = await fetch(`${API_BASE_URL}/api/properties/${property.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: professional.title,
            description: professional.description,
            // Mantener la ubicación original si existe, o usar la de la plantilla
            location: property.location || professional.location,
          }),
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error(`   ❌ Error: ${errorData.error?.message || updateResponse.statusText}`);
          results.push({ id: property.id, title: property.title, success: false, error: errorData.error?.message });
        } else {
          const updatedData = await updateResponse.json();
          console.log(`   ✅ Actualizada exitosamente`);
          results.push({ id: property.id, oldTitle: property.title, newTitle: professional.title, success: true });
        }
      } catch (error) {
        console.error(`   ❌ Error al actualizar:`, error);
        results.push({ id: property.id, title: property.title, success: false, error: String(error) });
      }

      // Pequeña pausa entre actualizaciones para no sobrecargar el servidor
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Resumen
    console.log('\n📊 RESUMEN DE ACTUALIZACIONES:');
    console.log('=' .repeat(50));
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`✅ Exitosas: ${successful}`);
    console.log(`❌ Fallidas: ${failed}`);
    console.log('\nDetalles:');
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`${index + 1}. ✅ "${result.oldTitle}" → "${result.newTitle}"`);
      } else {
        console.log(`${index + 1}. ❌ "${result.title}": ${result.error}`);
      }
    });

  } catch (error) {
    console.error('❌ Error general:', error);
    throw error;
  }
}

// Si se ejecuta desde Node.js
if (typeof window === 'undefined') {
  // Intentar obtener token de variable de entorno o argumentos
  const tokenFromEnv = process.env.AIRBNB_TOKEN;
  const tokenFromArgs = process.argv[2]; // Primer argumento después del nombre del script
  
  if (tokenFromEnv || tokenFromArgs) {
    updateTestProperties(tokenFromEnv || tokenFromArgs || undefined).catch(console.error);
  } else {
    console.error('❌ Error: No se encontró el token de autenticación.');
    console.log('\n📝 Opciones para ejecutar este script:');
    console.log('1. Desde el navegador (recomendado):');
    console.log('   - Abre la consola del navegador (F12)');
    console.log('   - Copia y pega el contenido de: scripts/update-test-properties-browser.js');
    console.log('\n2. Desde Node.js con variable de entorno:');
    console.log('   AIRBNB_TOKEN=tu_token npx tsx scripts/update-test-properties.ts');
    console.log('\n3. Desde Node.js pasando el token como argumento:');
    console.log('   npx tsx scripts/update-test-properties.ts tu_token');
    console.log('\n💡 Para obtener tu token:');
    console.log('   - Inicia sesión en http://localhost:3001/login');
    console.log('   - Abre la consola del navegador (F12)');
    console.log('   - Ejecuta: JSON.parse(sessionStorage.getItem("airbnb_session")).accessToken');
    process.exit(1);
  }
}

// Exportar para uso en consola del navegador
if (typeof window !== 'undefined') {
  (window as any).updateTestProperties = updateTestProperties;
  console.log('✅ Script cargado. Ejecuta: updateTestProperties()');
}

export { updateTestProperties };
