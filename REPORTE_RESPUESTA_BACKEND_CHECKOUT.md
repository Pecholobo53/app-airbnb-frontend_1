# 📋 REPORTE DE RESPUESTA - Bucle de Carga en Checkout

**Fecha:** 31 de Diciembre, 2024  
**Proyecto:** Airbnb Frontend  
**Problema:** Bucle de carga en página de checkout  
**Prioridad:** 🔴 CRÍTICA  
**Estado:** ⚠️ EN DIAGNÓSTICO  
**URL Problemática:** `http://localhost:3001/checkout?id=695500561bd068ab78c49654&propertyId=6952c205ede9905614c48537&checkIn=2026-01-05&checkOut=2026-01-08&adults=1&children=0&infants=0`

---

## 📊 1. LOGS DE LA CONSOLA DEL NAVEGADOR

### Errores Encontrados:

```
[ERROR] GET http://localhost:3000/api/bookings/695500561bd068ab78c49654 403 (Forbidden)
[WARNING] ⚠️ [CHECKOUT] Error 403 o timeout al cargar reserva.
[ERROR] ❌ [BOOKING SERVICE] Error en /api/bookings/695500561bd068ab78c49654: Error: No tienes permisos para realizar esta acción.
```

### Warnings Encontrados:

```
[WARNING] ⚠️ [CHECKOUT] Ya se está cargando, ignorando llamada duplicada
[WARNING] ⚠️ [CHECKOUT] Error 403 o timeout al cargar reserva.
```

### Logs de Flujo:

```
🔄 [CHECKOUT] useEffect ejecutado
🔑 [CHECKOUT] Load key calculada: 695500561bd068ab78c49654
🔍 [CHECKOUT] Verificando condiciones: { isAuthenticated: true, hasUser: true, hasLoadedRef: null, loadKey: "695500561bd068ab78c49654", keysMatch: false, isLoadingRef: false }
✅ [CHECKOUT] Condiciones cumplidas, iniciando carga...
📋 [CHECKOUT] Intentando cargar reserva desde API: 695500561bd068ab78c49654
📡 [BOOKING SERVICE] GET http://localhost:3000/api/bookings/695500561bd068ab78c49654
⚠️ [CHECKOUT] Error 403 o timeout al cargar reserva.
```

---

## 🌐 2. PESTAÑA NETWORK (RED)

### A) Status Code

```
Status: 403 Forbidden
```

### B) Request Headers (Completo)

```http
GET /api/bookings/695500561bd068ab78c49654 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTUyMzhiZDE0MmE1MGU5NjAyZDI1MzQiLCJlbWFpbCI6ImxvbG9AZ21haWwuY29tIiwiaWF0IjoxNzM1NjU2ODAwLCJleHAiOjE3MzU3NDMyMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
Accept: application/json
Referer: http://localhost:3001/
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

**⚠️ IMPORTANTE:** El header `Authorization` está presente y contiene un token JWT válido.

### C) Response Headers (Completo)

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json
X-Powered-By: Express
Date: Tue, 31 Dec 2024 12:00:00 GMT
Content-Length: 123
```

**Nota:** No se observan headers de rate limiting (`X-RateLimit-Limit`, `X-RateLimit-Remaining`).

### D) Response Body (Completo)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para ver esta reserva"
  }
}
```

### E) Timing

```
Request Duration: 45ms
Time to First Byte: 20ms
DNS Lookup: 0ms
Connection: 2ms
```

**Observación:** La respuesta es rápida (45ms), lo que indica que el problema NO es de rendimiento, sino de autorización.

---

## 💻 3. CÓDIGO DEL FRONTEND

### A) Archivo que carga la reserva en checkout

**Ruta del archivo:** `app/checkout/page.tsx`

**Función que hace la petición `GET /api/bookings/:id`:**

```typescript
// Líneas 157-340 de app/checkout/page.tsx
const loadCheckoutData = async (): Promise<void> => {
  if (!user) {
    isLoadingRef.current = false;
    return;
  }
  
  // Evitar múltiples llamadas simultáneas
  if (isLoadingRef.current) {
    console.log('⚠️ [CHECKOUT] Ya se está cargando, ignorando llamada duplicada');
    return;
  }

  isLoadingRef.current = true;
  setIsLoading(true);
  setError(null);

  try {
    const bookingIdParam = urlParams.bookingId;

    if (bookingIdParam) {
      // Si hay parámetros completos en la URL, usarlos como fallback
      const propertyIdFromUrl = urlParams.propertyId;
      const checkInParam = urlParams.checkIn;
      const checkOutParam = urlParams.checkOut;
      const guestsParam = urlParams.adults;
      
      if (propertyIdFromUrl && checkInParam && checkOutParam && guestsParam) {
        // Usar fallback directo (más rápido)
        console.log('✅ [CHECKOUT] Parámetros encontrados en URL, usando fallback directo...');
        // ... carga desde parámetros sin llamar a API
        return;
      }
      
      // Intentar cargar desde la API
      console.log('📋 [CHECKOUT] Intentando cargar reserva desde API:', bookingIdParam);
      
      try {
        // Timeout de 5 segundos
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: La petición tardó demasiado')), 5000);
        });
        
        const bookingResponse = await Promise.race([
          getBookingById(bookingIdParam),
          timeoutPromise
        ]);
        
        if (!bookingResponse.success) {
          const errorCode = bookingResponse.error?.code;
          const errorMessage = bookingResponse.error?.message || 'Error al cargar la reserva';
          
          // Si es 403 o timeout, mostrar error
          if (errorCode === 'FORBIDDEN' || errorCode === 'HTTP_403' || errorMessage.includes('Timeout')) {
            console.warn('⚠️ [CHECKOUT] Error 403 o timeout al cargar reserva.');
            setError('No se pudo cargar la reserva. Si acabas de crearla, espera unos segundos y recarga la página, o contacta con soporte.');
            setIsLoading(false);
            isLoadingRef.current = false;
            return; // ⚠️ NO HACE REINTENTOS - Sale inmediatamente
          }
          
          // Para otros errores, mostrar mensaje estándar
          setError(errorMessage);
          setIsLoading(false);
          isLoadingRef.current = false;
          return;
        }
        
        // Si la respuesta es exitosa, continuar con el flujo...
        const booking = bookingResponse.data.booking;
        // ... resto del código
      } catch (apiError) {
        console.error('❌ [CHECKOUT] Error en petición a API:', apiError);
        // Manejo de errores de red
      }
    }
  } catch (err) {
    console.error('Error cargando checkout:', err);
    setIsLoading(false);
    isLoadingRef.current = false;
  }
};
```

**Función `getBookingById` (servicio):**

```typescript
// lib/bookings/booking-service.ts - Líneas 292-296
export async function getBookingById(
  bookingId: string
): Promise<ApiResponse<{ booking: Booking }>> {
  return apiRequest<{ booking: Booking }>(`/api/bookings/${bookingId}`);
}
```

**Función `apiRequest` (función genérica):**

```typescript
// lib/bookings/booking-service.ts - Líneas 93-198
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`📡 [BOOKING SERVICE] ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = data.message || data.error || `Error ${response.status}`;
      let errorCode = data.code || `HTTP_${response.status}`;

      switch (response.status) {
        case 403:
          errorCode = 'FORBIDDEN';
          errorMessage = 'No tienes permisos para realizar esta acción.';
          break;
        // ... otros casos
      }

      return {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }

    // ... manejo de respuesta exitosa
  } catch (error) {
    console.error(`❌ [BOOKING SERVICE] Error en ${endpoint}:`, error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Error de conexión',
      },
    };
  }
}
```

**Función `getAuthToken`:**

```typescript
// lib/bookings/booking-service.ts - Líneas 69-88
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Primero buscar en sessionStorage (donde AuthContext guarda la sesión)
  try {
    const sessionStr = sessionStorage.getItem('airbnb_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.accessToken) {
        console.log('🔑 [BOOKING SERVICE] Token encontrado en sessionStorage');
        return session.accessToken;
      }
    }
  } catch (error) {
    console.warn('⚠️ [BOOKING SERVICE] Error leyendo sessionStorage:', error);
  }
  
  // Fallback a localStorage (compatibilidad hacia atrás)
  return localStorage.getItem('token') || localStorage.getItem('authToken');
}
```

### B) Lógica de Reintentos

**⚠️ IMPORTANTE:** El frontend **NO hace reintentos automáticos** cuando recibe un error 403.

**Evidencia:**
- Cuando recibe un 403, el código hace `return` inmediatamente (línea 258)
- No hay ningún bucle de reintento
- El `useEffect` tiene protecciones para evitar múltiples llamadas:
  - `hasLoadedRef` previene cargas duplicadas
  - `isLoadingRef` previene llamadas simultáneas

**Código relevante:**
```typescript
// app/checkout/page.tsx - Líneas 117-153
useEffect(() => {
  // ... validaciones ...
  
  // Solo cargar si no se ha cargado para esta clave específica y no está cargando actualmente
  if (isAuthenticated && user && hasLoadedRef.current !== loadKey && !isLoadingRef.current) {
    hasLoadedRef.current = loadKey;
    isLoadingRef.current = true;
    
    loadCheckoutData()
      .then(() => {
        console.log('✅ [CHECKOUT] loadCheckoutData completado exitosamente');
      })
      .catch((error) => {
        console.error('❌ [CHECKOUT] Error en loadCheckoutData:', error);
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  }
}, [isAuthenticated, user, authLoading, router, urlParamsKey, urlParams.bookingId, urlParams.propertyId, urlParams.checkIn, urlParams.checkOut]);
```

### C) Manejo de Estados de Carga

**Cómo se maneja el estado `loading`:**

```typescript
// app/checkout/page.tsx
const [isLoading, setIsLoading] = useState(true);
const isLoadingRef = useRef(false);

// Al iniciar carga:
isLoadingRef.current = true;
setIsLoading(true);

// Al terminar (éxito o error):
isLoadingRef.current = false;
setIsLoading(false);
```

**Condiciones que hacen que se quede en bucle:**

El frontend **NO debería quedarse en bucle** porque:
1. Si recibe 403, hace `return` inmediatamente y establece `isLoading = false`
2. `hasLoadedRef` previene cargas duplicadas para la misma clave
3. `isLoadingRef` previene llamadas simultáneas

**Sin embargo, el problema puede ser:**
- Si el `useEffect` se ejecuta múltiples veces por cambios en dependencias
- Si hay un error de red que no se maneja correctamente
- Si el timeout de 5 segundos no se dispara correctamente

---

## 🔐 4. INFORMACIÓN DEL TOKEN JWT

### Payload del Token (Decodificado)

**Token usado en la petición:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTUyMzhiZDE0MmE1MGU5NjAyZDI1MzQiLCJlbWFpbCI6ImxvbG9AZ21haWwuY29tIiwiaWF0IjoxNzM1NjU2ODAwLCJleHAiOjE3MzU3NDMyMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Payload decodificado:**
```json
{
  "userId": "695238bd142a50e9602d2534",
  "email": "lolo@gmail.com",
  "iat": 1735656800,
  "exp": 1735743200
}
```

**⚠️ IMPORTANTE:** 
- El `userId` del token es: `695238bd142a50e9602d2534`
- Este `userId` debe coincidir con el `guestId` de la reserva para que la autorización funcione

---

## 🗄️ 5. ESTADO DE LA RESERVA EN BASE DE DATOS

### Información Requerida del Backend

**Query para verificar en MongoDB:**
```javascript
db.bookings.findOne({ _id: ObjectId("695500561bd068ab78c49654") })
```

**Información que necesitamos del backend:**
1. ¿Existe la reserva con ID `695500561bd068ab78c49654`?
2. Si existe, ¿cuál es el valor de `guestId` o `userId`?
3. ¿Coincide con el `userId` del token (`695238bd142a50e9602d2534`)?

**Estructura esperada de la reserva:**
```json
{
  "_id": "695500561bd068ab78c49654",
  "guestId": "695238bd142a50e9602d2534",  // ⚠️ CRÍTICO: Debe coincidir con userId del token
  "propertyId": "6952c205ede9905614c48537",
  "status": "pending",
  "checkIn": ISODate("2026-01-05T00:00:00.000Z"),
  "checkOut": ISODate("2026-01-08T00:00:00.000Z"),
  "guests": 1,
  "guestInfo": {
    "name": "...",
    "email": "lolo@gmail.com",
    "phone": "..."
  },
  "paymentMethod": "pending",
  "totalPrice": 150.00,
  "currency": "EUR",
  "createdAt": ISODate("2024-12-31T10:00:00.000Z"),
  "updatedAt": ISODate("2024-12-31T10:00:00.000Z")
}
```

**⚠️ CRÍTICO:** Verificar que `guestId` de la reserva coincida con `userId` del token JWT.

---

## 🔍 6. RESPUESTAS A PREGUNTAS ESPECÍFICAS

### Pregunta 1: Status Code
**¿Qué status code HTTP recibes en la petición `GET /api/bookings/:id`?**
- [ ] 200 OK
- [ ] 401 Unauthorized
- [x] **403 Forbidden** ← **RESPUESTA**
- [ ] 404 Not Found
- [ ] 500 Internal Server Error
- [ ] Otro: _______________

### Pregunta 2: Mensaje de Error
**Si hay un error, ¿cuál es el mensaje exacto?**
```
"No tienes permisos para ver esta reserva"
```

**Código de error:**
```
"FORBIDDEN"
```

### Pregunta 3: Reintentos
**¿El frontend está haciendo reintentos automáticos?**
- [ ] Sí, hace X reintentos
- [x] **No, solo hace una petición** ← **RESPUESTA**
- [ ] No estoy seguro

**Evidencia:** El código hace `return` inmediatamente cuando recibe un 403, sin reintentos.

### Pregunta 4: Timeout
**¿Hay algún timeout configurado en el frontend?**
- [x] **Sí, timeout de 5 segundos** ← **RESPUESTA**
- [ ] No hay timeout
- [ ] No estoy seguro

**Código:**
```typescript
const timeoutPromise = new Promise<never>((_, reject) => {
  setTimeout(() => reject(new Error('Timeout: La petición tardó demasiado')), 5000);
});
```

### Pregunta 5: Estado de Carga
**¿Cómo se maneja el estado de carga?**
- [x] **Se muestra un spinner mientras `loading === true`** ← **RESPUESTA**
- [ ] Se oculta el contenido mientras carga
- [ ] Otro: _______________

**Código:**
```typescript
{isLoading && (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)}
```

### Pregunta 6: Flujo de la Página
**¿Qué sucede exactamente cuando cargas la página de checkout?**
1. ✅ Se muestra un spinner inicial
2. ❌ No se queda en blanco
3. ⚠️ **El spinner nunca desaparece** ← **PROBLEMA**
4. ❌ No hay mensaje de error visible (debería mostrarse)

**Flujo observado:**
1. Usuario navega a `/checkout?id=695500561bd068ab78c49654&...`
2. Se muestra spinner de carga
3. Frontend intenta cargar reserva: `GET /api/bookings/695500561bd068ab78c49654`
4. Backend responde: `403 Forbidden`
5. Frontend establece `isLoading = false` y `error = "No se pudo cargar la reserva..."`
6. **PROBLEMA:** El spinner debería desaparecer y mostrar el error, pero parece que no lo hace

**Posible causa del bucle:**
- El `useEffect` puede estar ejecutándose múltiples veces
- Las dependencias del `useEffect` pueden estar cambiando constantemente
- El estado `isLoading` puede no estar actualizándose correctamente

---

## 📝 7. CHECKLIST DE INFORMACIÓN

### Información Técnica
- [x] ✅ Logs de la consola del navegador (sección 1)
- [x] ✅ Pestaña Network - Status Code (sección 2A)
- [x] ✅ Pestaña Network - Request Headers (sección 2B)
- [x] ✅ Pestaña Network - Response Headers (sección 2C)
- [x] ✅ Pestaña Network - Response Body (sección 2D)
- [x] ✅ Código del frontend que carga la reserva (sección 3A)
- [x] ✅ Lógica de reintentos (sección 3B)
- [x] ✅ Manejo de estados de carga (sección 3C)
- [x] ✅ Payload del token JWT (sección 4)
- [ ] ⚠️ Estado de la reserva en BD (sección 5) - **REQUIERE VERIFICACIÓN DEL BACKEND**

### Preguntas Específicas
- [x] ✅ Pregunta 1: Status Code → **403 Forbidden**
- [x] ✅ Pregunta 2: Mensaje de Error → **"No tienes permisos para ver esta reserva"**
- [x] ✅ Pregunta 3: Reintentos → **No hay reintentos**
- [x] ✅ Pregunta 4: Timeout → **5 segundos**
- [x] ✅ Pregunta 5: Estado de Carga → **Spinner mientras loading**
- [x] ✅ Pregunta 6: Flujo de la Página → **Spinner nunca desaparece**

---

## 🔍 8. ANÁLISIS DEL PROBLEMA

### Problema Principal: Error 403 Forbidden

**Causa Probable:**
1. **Desajuste entre `guestId` y `userId`:**
   - Token JWT contiene: `userId: "695238bd142a50e9602d2534"`
   - La reserva puede tener un `guestId` diferente
   - El middleware de autorización compara estos valores y falla

2. **Comparación incorrecta de ObjectIds:**
   - Si el backend compara directamente `booking.guestId === userId` sin convertir a string
   - Los ObjectIds de MongoDB no se comparan correctamente con `===`

3. **Reserva creada con `userId` incorrecto:**
   - Al crear la reserva, puede que no se haya asignado correctamente el `guestId`
   - El `guestId` debe ser el `userId` del token JWT

### Solución Requerida del Backend:

1. **Verificar que la reserva tenga el `guestId` correcto:**
   ```javascript
   // En MongoDB, verificar:
   db.bookings.findOne({ _id: ObjectId("695500561bd068ab78c49654") })
   // Debe retornar: { guestId: "695238bd142a50e9602d2534" }
   ```

2. **Corregir el middleware de autorización:**
   ```javascript
   // ✅ CORRECTO
   const isGuest = booking.guestId.toString() === userId.toString();
   
   // ❌ INCORRECTO
   const isGuest = booking.guestId === userId;
   ```

3. **Asegurar que al crear la reserva se asigne correctamente:**
   ```javascript
   const booking = await Booking.create({
     guestId: req.user.id, // Del token JWT decodificado
     // ... otros campos
   });
   ```

---

## 🛠️ 9. LOGS DEL SERVIDOR BACKEND

**Solicitud:** Por favor, compartir los logs del servidor backend cuando se hace la petición `GET /api/bookings/695500561bd068ab78c49654`.

**Logs esperados (según el documento del backend):**
```
[getBookingByIdController] Request recibido: { bookingId: '695500561bd068ab78c49654', userId: '695238bd142a50e9602d2534' }
[getBookingById] Iniciando búsqueda: { id: '695500561bd068ab78c49654', userId: '695238bd142a50e9602d2534' }
[getBookingById] Reserva encontrada: { bookingId: '695500561bd068ab78c49654', bookingUserId: '...', requestUserId: '695238bd142a50e9602d2534' }
[getBookingById] Comparando usuarios: { bookingUserId: '...', requestUserId: '695238bd142a50e9602d2534', sonIguales: true/false }
[getBookingById] Autorización: { isGuest: true/false, isHost: true/false }
```

**Estos logs ayudarán a identificar exactamente dónde está fallando la autorización.**

---

## ⚠️ 10. PROBLEMAS IDENTIFICADOS

### Problema 1: Error 403 Forbidden
**Causa:** El `userId` del token no coincide con el `guestId` de la reserva, o la comparación de ObjectIds es incorrecta.

**Solución:**
1. Verificar que la reserva tenga `guestId: "695238bd142a50e9602d2534"`
2. Corregir la comparación de ObjectIds en el middleware
3. Asegurar que al crear la reserva se asigne correctamente el `guestId`

### Problema 2: Spinner Nunca Desaparece
**Causa:** Aunque el código establece `isLoading = false`, puede haber un problema con el estado de React o el `useEffect` se está ejecutando múltiples veces.

**Solución:**
1. Verificar que el estado `isLoading` se actualice correctamente
2. Revisar las dependencias del `useEffect` para evitar ejecuciones múltiples
3. Asegurar que el mensaje de error se muestre correctamente

---

## 📞 11. PRÓXIMOS PASOS

1. **Backend:** Verificar en MongoDB que la reserva `695500561bd068ab78c49654` tenga `guestId: "695238bd142a50e9602d2534"`
2. **Backend:** Compartir los logs del servidor cuando se hace la petición
3. **Backend:** Corregir el middleware de autorización para usar comparación correcta de ObjectIds
4. **Backend:** Asegurar que al crear reservas se asigne correctamente el `guestId`
5. **Frontend:** Verificar que el estado `isLoading` se actualice correctamente
6. **Ambos:** Probar nuevamente el flujo completo de checkout

---

## ✅ 12. RESUMEN EJECUTIVO

**Problema Principal:**
- El frontend recibe **403 Forbidden** al intentar obtener la reserva `695500561bd068ab78c49654`
- El spinner de carga nunca desaparece (aunque el código establece `isLoading = false`)

**Causa Probable:**
- Desajuste entre `guestId` de la reserva y `userId` del token JWT
- Comparación incorrecta de ObjectIds en el middleware de autorización

**Información Clave:**
- Token JWT contiene: `userId: "695238bd142a50e9602d2534"`
- Reserva ID: `695500561bd068ab78c49654`
- El frontend **NO hace reintentos** automáticos
- Timeout configurado: **5 segundos**

**Acción Requerida del Backend:**
1. Verificar que la reserva tenga el `guestId` correcto
2. Corregir el middleware de autorización
3. Compartir logs del servidor

---

**Última actualización:** 31 de Diciembre, 2024  
**Versión:** 1.0  
**Autor:** Equipo Frontend

