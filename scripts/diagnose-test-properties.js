// Script de diagnóstico - Ver qué propiedades hay y cuáles son de prueba
(async function diagnoseProperties() {
  const API_BASE_URL = 'http://localhost:3000';
  
  const TEST_KEYWORDS = ['test', 'stripe', 'prueba', 'demo', 'ejemplo'];
  
  function isTestProperty(title) {
    if (!title) return false;
    const lowerTitle = title.toLowerCase();
    return TEST_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
  }

  // Obtener token
  const session = sessionStorage.getItem('airbnb_session');
  if (!session) {
    console.error('❌ No hay sesión. Por favor, inicia sesión primero.');
    return;
  }

  let token = null;
  try {
    const parsed = JSON.parse(session);
    token = parsed.accessToken || parsed.token || parsed.access_token;
  } catch (error) {
    console.error('❌ Error al parsear la sesión:', error);
    return;
  }

  if (!token) {
    console.error('❌ No se encontró el token de autenticación');
    return;
  }

  console.log('🔍 Buscando todas las propiedades...\n');

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

    console.log(`📋 Total de propiedades encontradas: ${properties.length}\n`);

    if (properties.length === 0) {
      console.log('⚠️ No se encontraron propiedades');
      return;
    }

    // Mostrar todas las propiedades con sus títulos
    console.log('📝 TODAS LAS PROPIEDADES:');
    console.log('='.repeat(60));
    properties.forEach((prop, index) => {
      const isTest = isTestProperty(prop.title);
      const marker = isTest ? '🎯' : '  ';
      console.log(`${marker} ${index + 1}. "${prop.title || 'Sin título'}" (ID: ${prop.id})`);
    });

    // Filtrar propiedades de prueba
    const testProperties = properties.filter(prop => isTestProperty(prop.title || ''));

    console.log('\n🎯 PROPIEDADES DE PRUEBA ENCONTRADAS:');
    console.log('='.repeat(60));
    
    if (testProperties.length === 0) {
      console.log('✅ No se encontraron propiedades con títulos de prueba');
      console.log('\n💡 Las palabras clave que busca el script son:');
      TEST_KEYWORDS.forEach(keyword => console.log(`   - "${keyword}"`));
      console.log('\n💡 Si tus propiedades tienen otros nombres, puedes:');
      console.log('   1. Modificar el array TEST_KEYWORDS en el script');
      console.log('   2. O actualizar manualmente los títulos desde el panel de admin');
    } else {
      console.log(`Encontradas ${testProperties.length} propiedades de prueba:\n`);
      testProperties.forEach((prop, index) => {
        console.log(`${index + 1}. "${prop.title}"`);
        console.log(`   ID: ${prop.id}`);
        console.log(`   Ubicación: ${prop.location?.city || 'N/A'}, ${prop.location?.country || 'N/A'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
})();
