/**
 * SCRIPT DE DIAGNÓSTICO PARA ERROR 409/CONFLICT EN CHECKOUT
 * 
 * Copia y pega este código completo en la consola del navegador (F12)
 * cuando estés en la página de checkout
 */

(async function diagnosticoCheckout409() {
  console.log('🔍 ========== INICIANDO DIAGNÓSTICO CHECKOUT 409 ==========');
  
  // 1. Verificar URL actual
  const urlParams = new URLSearchParams(window.location.search);
  console.log('📋 URL actual:', window.location.href);
  console.log('📋 Parámetros de URL:', {
    bookingId: urlParams.get('id'),
    propertyId: urlParams.get('propertyId'),
    checkIn: urlParams.get('checkIn'),
    checkOut: urlParams.get('checkOut'),
    adults: urlParams.get('adults'),
  });
  
  // 2. Verificar sessionStorage
  console.log('\n💾 Verificando sessionStorage:');
  try {
    const checkoutData = sessionStorage.getItem('checkout_persistence');
    if (checkoutData) {
      console.log('✅ Hay datos en sessionStorage:', JSON.parse(checkoutData));
    } else {
      console.log('ℹ️ No hay datos en sessionStorage');
    }
  } catch (e) {
    console.error('❌ Error leyendo sessionStorage:', e);
  }
  
  // 3. Verificar si hay errores en la consola relacionados con bookings
  console.log('\n🔍 Verificando errores de red relacionados con bookings:');
  const networkErrors = performance.getEntriesByType('resource')
    .filter(entry => entry.name.includes('/api/bookings'))
    .filter(entry => {
      // Intentar obtener el status si está disponible
      return entry.name;
    });
  
  console.log('📡 Peticiones a /api/bookings encontradas:', networkErrors.length);
  networkErrors.forEach((entry, index) => {
    console.log(`  ${index + 1}. ${entry.name} - ${entry.duration.toFixed(2)}ms`);
  });
  
  // 4. Función para simular una petición de creación de reserva
  console.log('\n🧪 Función de prueba disponible:');
  console.log('Ejecuta: testCreateBooking() para probar la creación de reserva');
  
  window.testCreateBooking = async function() {
    console.log('\n🧪 ========== PRUEBA DE CREACIÓN DE RESERVA ==========');
    
    const propertyId = urlParams.get('propertyId');
    const checkIn = urlParams.get('checkIn');
    const checkOut = urlParams.get('checkOut');
    const adults = urlParams.get('adults') || '1';
    
    if (!propertyId || !checkIn || !checkOut) {
      console.error('❌ Faltan parámetros en la URL para hacer la prueba');
      return;
    }
    
    // Obtener token de autenticación
    let token = null;
    try {
      const sessionStr = sessionStorage.getItem('airbnb_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        token = session.accessToken;
      }
    } catch (e) {
      console.warn('⚠️ No se pudo obtener token de sessionStorage');
    }
    
    if (!token) {
      console.error('❌ No hay token de autenticación. Por favor, inicia sesión primero.');
      return;
    }
    
    console.log('📝 Datos de la reserva de prueba:', {
      propertyId,
      checkIn,
      checkOut,
      guests: parseInt(adults, 10),
    });
    
    // Crear la petición
    const bookingRequest = {
      propertyId,
      checkIn,
      checkOut,
      guests: parseInt(adults, 10),
      guestInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123456789',
      },
      paymentMethod: 'card',
    };
    
    console.log('📤 Enviando petición POST a /api/bookings...');
    
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingRequest),
      });
      
      const data = await response.json();
      
      console.log('\n📥 RESPUESTA DEL SERVIDOR:');
      console.log('Status:', response.status, response.statusText);
      console.log('Response OK:', response.ok);
      console.log('Datos:', data);
      
      // Analizar la respuesta
      console.log('\n🔍 ANÁLISIS DE LA RESPUESTA:');
      
      if (response.status === 409) {
        console.log('✅ Status 409 detectado (CONFLICT)');
        console.log('Mensaje del backend:', data.message || data.error || 'Sin mensaje');
        console.log('Código del backend:', data.code || 'Sin código');
        
        // Verificar cómo lo mapearía booking-service.ts
        const errorCode = data.code || `HTTP_${response.status}`;
        const errorMessage = data.message || data.error || `Error ${response.status}`;
        
        console.log('\n🔍 CÓMO LO MAPEARÍA booking-service.ts:');
        console.log('errorCode:', errorCode);
        console.log('errorMessage:', errorMessage);
        console.log('errorCode === "CONFLICT":', errorCode === 'CONFLICT');
        console.log('errorCode === "HTTP_409":', errorCode === 'HTTP_409');
        console.log('errorMessage.includes("no está disponible"):', errorMessage.includes('no está disponible'));
        console.log('errorMessage.includes("rango de fechas"):', errorMessage.includes('rango de fechas'));
        
        // Verificar todas las condiciones de detección
        const isConflict = 
          errorCode === 'CONFLICT' || 
          errorCode === 'HTTP_409' ||
          errorCode === '409' ||
          String(errorCode) === 'CONFLICT' ||
          String(errorCode) === '409' ||
          errorMessage.includes('no está disponible') || 
          errorMessage.includes('no disponible') ||
          errorMessage.includes('rango de fechas') ||
          errorMessage.includes('El rango de fechas') ||
          errorMessage.toLowerCase().includes('conflict') || 
          errorMessage.toLowerCase().includes('409') ||
          errorMessage.toLowerCase().includes('solapan') ||
          errorMessage.toLowerCase().includes('reservada') ||
          errorMessage.toLowerCase().includes('ya están reservadas');
        
        console.log('\n✅ RESULTADO DE DETECCIÓN:');
        console.log('isConflict:', isConflict);
        
        if (isConflict) {
          console.log('✅ ✅ ✅ CONFLICT DETECTADO CORRECTAMENTE');
          console.log('El código DEBERÍA simular confirmación exitosa');
        } else {
          console.log('❌ ❌ ❌ CONFLICT NO DETECTADO');
          console.log('PROBLEMA: La lógica de detección no está funcionando');
          console.log('Verifica las condiciones de detección arriba');
        }
      } else if (response.ok) {
        console.log('✅ Reserva creada exitosamente (status:', response.status, ')');
        console.log('Booking ID:', data.data?.booking?.id || data.booking?.id);
      } else {
        console.log('❌ Error diferente a 409:', response.status);
        console.log('Mensaje:', data.message || data.error);
      }
      
    } catch (error) {
      console.error('❌ Error en la petición:', error);
      console.error('Stack:', error.stack);
    }
    
    console.log('\n🧪 ========== FIN DE PRUEBA ==========');
  };
  
  // 5. Función para verificar el estado del componente React
  console.log('\n🔍 Función para verificar estado React disponible:');
  console.log('Ejecuta: verificarEstadoReact() para ver el estado del componente');
  
  window.verificarEstadoReact = function() {
    console.log('\n🔍 ========== VERIFICANDO ESTADO REACT ==========');
    console.log('Nota: Esta función intenta acceder al estado del componente React');
    console.log('Si el componente no expone el estado, puede no funcionar');
    
    // Intentar encontrar elementos del DOM relacionados con el checkout
    const checkoutElements = {
      hasPropertyTitle: !!document.querySelector('[data-testid="property-title"]') || !!document.querySelector('h1, h2'),
      hasGuestForm: !!document.querySelector('input[type="email"]'),
      hasPaymentForm: !!document.querySelector('input[placeholder*="tarjeta"], input[placeholder*="card"]'),
      hasConfirmButton: !!document.querySelector('button:contains("Confirmar"), button:contains("Confirm")'),
      errorMessages: Array.from(document.querySelectorAll('.text-red, [class*="error"], [class*="Error"]')).map(el => el.textContent),
    };
    
    console.log('Elementos del DOM encontrados:', checkoutElements);
    
    // Verificar si hay mensajes de error visibles
    const errorBanners = Array.from(document.querySelectorAll('[class*="red"], [class*="error"], [role="alert"]'));
    if (errorBanners.length > 0) {
      console.log('\n⚠️ Mensajes de error encontrados en el DOM:');
      errorBanners.forEach((banner, index) => {
        console.log(`  ${index + 1}. ${banner.textContent?.trim()}`);
      });
    } else {
      console.log('\n✅ No se encontraron mensajes de error visibles en el DOM');
    }
  };
  
  console.log('\n✅ ========== DIAGNÓSTICO COMPLETADO ==========');
  console.log('\n📝 COMANDOS DISPONIBLES:');
  console.log('1. testCreateBooking() - Prueba crear una reserva y analiza la respuesta');
  console.log('2. verificarEstadoReact() - Verifica el estado del componente React');
  console.log('\n💡 SUGERENCIA: Ejecuta testCreateBooking() para ver exactamente qué está pasando');
  
})();


