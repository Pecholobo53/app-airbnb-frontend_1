// ============================================
// SCRIPT PARA PROBAR ACTUALIZAR PERFIL
// Copia y pega esto en la consola del navegador (F12)
// ============================================

(async function() {
  console.log('🚀 Iniciando prueba de actualización de perfil...\n');

  // 1. Verificar sesión
  console.log('📋 Paso 1: Verificando sesión...');
  const session = localStorage.getItem('airbnb_mock_session');
  
  if (!session) {
    console.error('❌ NO HAY SESIÓN');
    console.log('💡 Ve a /login e inicia sesión primero');
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(session);
    console.log('✅ Sesión encontrada');
    console.log('👤 Usuario:', parsed.user?.name);
    console.log('📧 Email:', parsed.user?.email);
  } catch (error) {
    console.error('❌ Error parseando sesión:', error);
    return;
  }

  // 2. Obtener token
  console.log('\n📋 Paso 2: Obteniendo token...');
  const token = parsed.accessToken;
  
  if (!token) {
    console.error('❌ NO HAY TOKEN en la sesión');
    console.log('📋 Estructura de sesión:', Object.keys(parsed));
    return;
  }

  console.log('✅ Token encontrado:', token.substring(0, 30) + '...');
  console.log('🔑 Token completo:', token);

  // 3. Preparar datos para actualizar
  console.log('\n📋 Paso 3: Preparando datos para actualizar...');
  const updateData = {
    name: 'Nombre Actualizado ' + new Date().getTime(), // Nombre único para probar
    phone: '+34 600 000 000',
    // avatar: 'https://example.com/avatar.jpg' // Opcional
  };

  console.log('📤 Datos a enviar:', updateData);

  // 4. Hacer request
  console.log('\n📋 Paso 4: Enviando request a /api/auth/profile...');
  console.log('🌐 URL: http://localhost:3000/api/auth/profile');
  console.log('📤 Método: PUT');
  console.log('🔑 Headers:', {
    'Authorization': 'Bearer ***',
    'Content-Type': 'application/json'
  });

  try {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    console.log('\n📥 Respuesta recibida:');
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    console.log('📊 OK:', response.ok);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('\n📦 Datos de respuesta:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('\n✅ ¡ÉXITO! Perfil actualizado correctamente');
      console.log('👤 Nuevo nombre:', data.data?.name);
      console.log('📞 Nuevo teléfono:', data.data?.phone);
      
      // Verificar que se actualizó en localStorage
      console.log('\n📋 Verificando actualización en localStorage...');
      const updatedSession = localStorage.getItem('airbnb_mock_session');
      if (updatedSession) {
        const updatedParsed = JSON.parse(updatedSession);
        console.log('👤 Usuario en localStorage:', updatedParsed.user?.name);
        console.log('📞 Teléfono en localStorage:', updatedParsed.user?.phone);
      }
    } else {
      console.error('\n❌ ERROR en la respuesta');
      console.error('Código:', data.error?.code);
      console.error('Mensaje:', data.error?.message);
      console.error('Respuesta completa:', data);
      
      if (response.status === 401) {
        console.log('\n💡 SOLUCIÓN: Token inválido o expirado');
        console.log('   - Cierra sesión y vuelve a iniciar sesión');
        console.log('   - Verifica que el backend esté corriendo');
      } else if (response.status === 400) {
        console.log('\n💡 SOLUCIÓN: Datos inválidos');
        console.log('   - Verifica el formato de los datos');
        console.log('   - Revisa la validación en el backend');
      } else if (response.status === 404) {
        console.log('\n💡 SOLUCIÓN: Endpoint no encontrado');
        console.log('   - Verifica que el backend tenga el endpoint /api/auth/profile');
      }
    }

  } catch (error) {
    console.error('\n❌ ERROR DE RED:', error);
    console.error('Tipo:', error.name);
    console.error('Mensaje:', error.message);
    console.log('\n💡 SOLUCIÓN:');
    console.log('   - Verifica que el backend esté corriendo en http://localhost:3000');
    console.log('   - Verifica tu conexión a internet');
    console.log('   - Revisa la consola del backend para ver errores');
  }

  console.log('\n✨ Prueba completada');
})();

