// scripts/update-property-by-id.js
// Uso: node scripts/update-property-by-id.js TU_TOKEN ID_PROPERTY1 ID_PROPERTY2 ...

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const PROFESSIONAL_PROPERTIES = [
  {
    title: 'Villa con Piscina Privada en Maspalomas',
    description: `Lujosa villa en Maspalomas, Canarias, diseñada para ofrecerte una experiencia de alojamiento excepcional. Este espacio exclusivo combina elegancia, confort y privacidad en un entorno privilegiado. La villa cuenta con amplias estancias, diseño contemporáneo y acabados de alta calidad. Disfruta de espacios exteriores privados, áreas de descanso y entretenimiento, y todas las comodidades que esperarías de un alojamiento de lujo. Ubicada en una de las mejores zonas de Maspalomas, podrás disfrutar de la tranquilidad y privacidad mientras tienes fácil acceso a playas, restaurantes de alta cocina, y actividades exclusivas. El entorno es perfecto para desconectar y relajarse. Las comodidades premium incluyen piscina privada, WiFi de alta velocidad, aire acondicionado en todas las estancias, cocina gourmet completamente equipada, y espacios diseñados para el máximo confort. Ideal para familias, grupos de amigos o quienes buscan una experiencia de lujo. Desde la villa podrás disfrutar de Maspalomas con el máximo confort y privacidad. Cada detalle ha sido cuidadosamente pensado para que tu estancia sea inolvidable.`,
  },
  {
    title: 'Apartamento Moderno con Vista al Mar en Las Palmas',
    description: `Elegante apartamento completamente renovado en el corazón de Las Palmas de Gran Canaria, con vistas espectaculares al océano Atlántico. Este espacio contemporáneo combina diseño moderno con comodidades de primera clase. Ubicado en una zona privilegiada, tendrás acceso directo a las mejores playas de la ciudad, restaurantes de renombre y vida nocturna vibrante. El apartamento cuenta con amplias terrazas donde podrás disfrutar de desayunos con vistas al mar y atardeceres inolvidables. Interiormente, encontrarás espacios luminosos, decoración cuidadosamente seleccionada y todas las amenidades necesarias para una estancia perfecta. Perfecto para parejas o familias pequeñas que buscan combinar relax y aventura. La ubicación estratégica te permite explorar la rica cultura canaria, disfrutar de deportes acuáticos, y descubrir la gastronomía local. Cada rincón ha sido pensado para ofrecerte el máximo confort y una experiencia auténtica de las Islas Canarias.`,
  },
  {
    title: 'Casa Tradicional Canaria con Encanto en Teguise',
    description: `Hermosa casa tradicional canaria restaurada con mimo, ubicada en el histórico pueblo de Teguise, Lanzarote. Esta propiedad única combina el encanto arquitectónico canario con todas las comodidades modernas. La casa mantiene elementos originales como muros de piedra volcánica, techos de madera y patios interiores, creando una atmósfera auténtica y acogedora. Ubicada en una de las zonas más pintorescas de la isla, podrás disfrutar de la tranquilidad de un pueblo tradicional mientras tienes fácil acceso a las playas más hermosas de Lanzarote. El espacio exterior incluye un patio privado perfecto para relajarse y disfrutar del clima canario. Ideal para quienes buscan una experiencia auténtica, lejos del bullicio turístico, pero con todas las comodidades necesarias. La casa está equipada con WiFi, cocina completa, y espacios cómodos para descansar después de explorar la isla. Descubre la verdadera esencia de Lanzarote desde este alojamiento único y lleno de carácter.`,
  },
  {
    title: 'Villa de Lujo con Piscina Infinita en Costa Teguise',
    description: `Excepcional villa de diseño contemporáneo en Costa Teguise, Lanzarote, con piscina infinita y vistas panorámicas al océano. Esta propiedad de lujo ha sido diseñada para ofrecer la máxima privacidad y confort. La villa cuenta con amplios espacios interiores y exteriores, decoración de alta gama y acabados de primera calidad. La piscina infinita es el punto focal del espacio exterior, creando una experiencia visual única mientras disfrutas del clima privilegiado de las Canarias. Ubicada en una zona residencial exclusiva, la villa ofrece tranquilidad absoluta mientras mantiene proximidad a playas, campos de golf y restaurantes de alta cocina. Perfecta para familias o grupos que buscan una experiencia de lujo y relajación. Las comodidades incluyen piscina privada, WiFi de alta velocidad, aire acondicionado en todas las estancias, cocina gourmet completamente equipada, y espacios de entretenimiento. Cada detalle ha sido cuidadosamente seleccionado para crear una estancia memorable en uno de los destinos más exclusivos de Lanzarote.`,
  },
  {
    title: 'Apartamento Acogedor en el Centro Histórico de Arrecife',
    description: `Encantador apartamento completamente renovado en el corazón histórico de Arrecife, capital de Lanzarote. Este espacio acogedor combina el encanto de un edificio tradicional canario con todas las comodidades modernas. Ubicado en una zona peatonal, podrás disfrutar de la auténtica vida local, con cafeterías, restaurantes y tiendas a pocos pasos. El apartamento cuenta con espacios luminosos, decoración cuidadosa y un ambiente cálido que te hará sentir como en casa. Perfecto para parejas o viajeros solos que buscan una base cómoda para explorar la isla. Desde aquí podrás acceder fácilmente a todas las atracciones principales de Lanzarote, incluyendo los famosos Jameos del Agua, el Mirador del Río y las playas más hermosas. El apartamento está equipado con WiFi, cocina completa, y todas las amenidades necesarias para una estancia confortable. Disfruta de la autenticidad de Arrecife mientras te alojas en un espacio moderno y bien equipado.`,
  },
];

function getRandomProfessionalProperty() {
  return PROFESSIONAL_PROPERTIES[
    Math.floor(Math.random() * PROFESSIONAL_PROPERTIES.length)
  ];
}

async function updatePropertyById(token, propertyId) {
  try {
    // Primero obtener la propiedad para mantener su ubicación
    const getResponse = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      throw new Error(`Error al obtener propiedad: ${getResponse.status}`);
    }

    const propertyData = await getResponse.json();
    const property = propertyData.data || propertyData;

    const professional = getRandomProfessionalProperty();

    console.log(`🔄 Actualizando propiedad: "${property.title || 'Sin título'}"`);
    console.log(`   ID: ${propertyId}`);
    console.log(`   Nuevo título: "${professional.title}"`);

    const updateResponse = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: professional.title,
        description: professional.description,
        // Mantener la ubicación original
        location: property.location,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || updateResponse.statusText);
    }

    console.log(`   ✅ Actualizada exitosamente\n`);
    return { success: true, oldTitle: property.title, newTitle: professional.title };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

async function main() {
  const token = process.argv[2];
  const propertyIds = process.argv.slice(3);

  if (!token) {
    console.error('❌ Error: Se requiere un token de autenticación');
    console.log('\n📝 Para obtener el token:');
    console.log('1. Abre http://localhost:3001/login en el navegador');
    console.log('2. Inicia sesión como administrador');
    console.log('3. Abre la consola del navegador (F12)');
    console.log('4. Ejecuta: JSON.parse(sessionStorage.getItem("airbnb_session")).accessToken');
    console.log('\n💡 Uso: node scripts/update-property-by-id.js TU_TOKEN ID1 ID2 ID3 ...');
    process.exit(1);
  }

  if (propertyIds.length === 0) {
    console.error('❌ Error: Se requiere al menos un ID de propiedad');
    console.log('\n💡 Uso: node scripts/update-property-by-id.js TU_TOKEN ID1 ID2 ID3 ...');
    console.log('\n💡 Ejemplo para actualizar la propiedad con título raro:');
    console.log('   node scripts/update-property-by-id.js TU_TOKEN 69516f1e4b5909c20d892451');
    process.exit(1);
  }

  console.log(`📋 Actualizando ${propertyIds.length} propiedad(es)...\n`);

  const results = [];
  for (const propertyId of propertyIds) {
    const result = await updatePropertyById(token, propertyId);
    results.push({ id: propertyId, ...result });
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 RESUMEN:');
  console.log('='.repeat(60));
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`✅ Exitosas: ${successful}`);
  console.log(`❌ Fallidas: ${failed}`);

  if (results.length > 0) {
    console.log('\nDetalles:');
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`${index + 1}. ✅ "${result.oldTitle}" → "${result.newTitle}"`);
      } else {
        console.log(`${index + 1}. ❌ ID ${result.id}: ${result.error}`);
      }
    });
  }
}

main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
