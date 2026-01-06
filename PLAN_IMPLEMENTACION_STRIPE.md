# 💳 Plan de Implementación - Stripe.js en Checkout

## 📋 Resumen

Implementar Stripe.js para procesar pagos reales en el componente de checkout, reemplazando el sistema de pagos simulado actual.

**Clave pública de Stripe**: `pk_test_51PVczcHSn92jbutJKwfjfNMNlCyFfOePl1BD4P1w0ida3TL0fulscoj1GPE1ZIw1fg9wsPtv3jrNsNRn7Mu3uqWh00eSOqQBnw`

---

## 🎯 Objetivos

1. ✅ Instalar y configurar Stripe.js
2. ✅ Crear servicio de pago para endpoints del backend
3. ✅ Integrar Stripe Elements en PaymentSection
4. ✅ Modificar flujo de checkout para usar pagos reales
5. ✅ Mantener formulario de dirección de facturación
6. ✅ Manejar errores y estados de carga
7. ✅ Mantener diseño responsive

---

## 📦 Fase 1: Instalación y Configuración

### 1.1 Instalar dependencias

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 1.2 Configurar variables de entorno

Crear/actualizar `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51PVczcHSn92jbutJKwfjfNMNlCyFfOePl1BD4P1w0ida3TL0fulscoj1GPE1ZIw1fg9wsPtv3jrNsNRn7Mu3uqWh00eSOqQBnw
```

### 1.3 Crear utilidad para inicializar Stripe

**Archivo**: `lib/stripe/stripe-client.ts`
- Función para inicializar Stripe con la clave pública
- Singleton pattern para evitar múltiples inicializaciones

---

## 🔧 Fase 2: Servicio de Pago

### 2.1 Crear servicio de pago

**Archivo**: `lib/payments/payment-service.ts`

**Funciones a implementar**:

1. **`createPaymentIntent(bookingId: string)`**
   - Endpoint: `POST /api/bookings/:id/payment/create-intent`
   - Headers: `Authorization: Bearer {token}`
   - Retorna: `{ clientSecret: string, paymentIntentId: string }`
   - Manejo de errores: 404 (reserva no encontrada), 400 (ya pagada), etc.

2. **`confirmPayment(bookingId: string, paymentIntentId: string)`**
   - Endpoint: `POST /api/bookings/:id/payment/confirm`
   - Headers: `Authorization: Bearer {token}`
   - Body: `{ paymentIntentId: string }`
   - Retorna: `{ booking: Booking }`
   - Manejo de errores: 400 (pago no exitoso), 404, etc.

**Estructura**:
```typescript
// lib/payments/payment-service.ts
import { getAuthToken } from '@/lib/auth/auth-context';
import { API_CONFIG } from '@/lib/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function createPaymentIntent(
  bookingId: string
): Promise<ApiResponse<CreatePaymentIntentResponse>> {
  // Implementación
}

export async function confirmPayment(
  bookingId: string,
  paymentIntentId: string
): Promise<ApiResponse<{ booking: any }>> {
  // Implementación
}
```

---

## 🎨 Fase 3: Componente Stripe Payment

### 3.1 Crear componente StripePaymentForm

**Archivo**: `components/checkout/StripePaymentForm.tsx`

**Características**:
- Usa `@stripe/react-stripe-js` (Elements, CardElement, useStripe, useElements)
- Integra Stripe Elements para captura segura de tarjeta
- Mantiene formulario de dirección de facturación
- Estados de carga y error
- Validación antes de procesar

**Props**:
```typescript
interface StripePaymentFormProps {
  bookingId: string;
  clientSecret: string;
  billingAddress?: BillingAddress;
  onBillingAddressSubmit: (address: BillingAddress) => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isLoading?: boolean;
}
```

**Flujo**:
1. Renderizar Stripe Elements (CardElement)
2. Renderizar BillingAddressForm
3. Al enviar:
   - Validar dirección de facturación
   - Confirmar pago con Stripe (`stripe.confirmCardPayment`)
   - Si éxito, llamar `onPaymentSuccess`
   - Si error, llamar `onPaymentError`

---

## 🔄 Fase 4: Modificar Flujo de Checkout

### 4.1 Actualizar `app/checkout/page.tsx`

**Cambios en `handleConfirmBooking`**:

**Flujo actual**:
```
1. Validar datos
2. Crear reserva con paymentMethod: 'card'
3. Mostrar confirmación
```

**Flujo nuevo**:
```
1. Validar datos (guestInfo, billingAddress)
2. Crear reserva con paymentMethod: 'pending'
3. Obtener bookingId de la reserva creada
4. Llamar createPaymentIntent(bookingId) → obtener clientSecret
5. Mostrar StripePaymentForm con clientSecret
6. Usuario completa pago en Stripe
7. Al éxito: llamar confirmPayment(bookingId, paymentIntentId)
8. Mostrar confirmación
```

**Modificaciones**:
- Cambiar `paymentMethod: 'card'` → `paymentMethod: 'pending'` al crear reserva
- Después de crear reserva, no mostrar confirmación inmediatamente
- Pasar a un nuevo paso intermedio de pago con Stripe
- Solo mostrar confirmación después de confirmar pago exitoso

### 4.2 Actualizar `PaymentSection.tsx`

**Opción A**: Reemplazar completamente con StripePaymentForm
**Opción B**: Mantener como wrapper que decide si usar Stripe o simulación

**Recomendación**: Opción A - Reemplazar completamente

**Cambios**:
- Eliminar formulario de tarjeta manual
- Integrar StripePaymentForm
- Mantener BillingAddressForm
- Actualizar props para recibir `bookingId` y `clientSecret`

---

## 📝 Fase 5: Estados y Manejo de Errores

### 5.1 Estados adicionales en checkout/page.tsx

```typescript
const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
const [clientSecret, setClientSecret] = useState<string | null>(null);
const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
const [paymentError, setPaymentError] = useState<string | null>(null);
```

### 5.2 Manejo de errores

**Errores a manejar**:
- Error al crear Payment Intent (404, 400, etc.)
- Error al procesar pago con Stripe (tarjeta rechazada, etc.)
- Error al confirmar pago en backend
- Errores de red
- Timeouts

**Mensajes de error amigables**:
- "No se pudo iniciar el proceso de pago. Intenta de nuevo."
- "Tu tarjeta fue rechazada. Verifica los datos o usa otra tarjeta."
- "El pago se procesó pero no se pudo confirmar. Contacta soporte."
- "Error de conexión. Verifica tu internet e intenta de nuevo."

---

## 🎨 Fase 6: UI/UX y Responsive

### 6.1 Diseño de StripePaymentForm

- Mantener estilo consistente con el resto del checkout
- Stripe Elements se estiliza automáticamente, pero podemos personalizar
- Loading states claros
- Mensajes de error visibles
- Botón de "Pagar" deshabilitado mientras procesa

### 6.2 Responsive

- Asegurar que Stripe Elements se vea bien en móvil
- Formulario de dirección responsive (ya existe)
- Botones accesibles en pantallas pequeñas

---

## 🧪 Fase 7: Testing y Validación

### 7.1 Tarjetas de prueba de Stripe

Usar tarjetas de prueba según documentación de Stripe:
- Éxito: `4242 4242 4242 4242`
- Rechazo: `4000 0000 0000 0002`
- Requiere autenticación: `4000 0025 0000 3155`

### 7.2 Flujos a probar

1. ✅ Flujo completo exitoso
2. ✅ Tarjeta rechazada
3. ✅ Error al crear Payment Intent
4. ✅ Error al confirmar pago
5. ✅ Timeout de red
6. ✅ Usuario cancela pago
7. ✅ Responsive en móvil/tablet/desktop

---

## 📁 Estructura de Archivos

```
/lib
  /stripe
    stripe-client.ts          # Inicialización de Stripe
  /payments
    payment-service.ts        # Servicios de API de pago

/components
  /checkout
    PaymentSection.tsx        # Reemplazado con Stripe
    StripePaymentForm.tsx     # Nuevo componente Stripe
    BillingAddressForm.tsx    # Mantener (ya existe)

/app
  /checkout
    page.tsx                  # Modificar flujo
```

---

## 🔄 Flujo Completo Detallado

### Paso 1: Usuario completa información
- Usuario completa GuestInfoForm ✅ (ya existe)
- Usuario completa BillingAddressForm ✅ (ya existe)

### Paso 2: Usuario hace clic en "Confirmar reserva"
- Validar guestInfo y billingAddress
- Crear reserva con `paymentMethod: 'pending'`
- Obtener `bookingId` de la respuesta

### Paso 3: Crear Payment Intent
- Llamar `createPaymentIntent(bookingId)`
- Obtener `clientSecret` y `paymentIntentId`
- Guardar en estado

### Paso 4: Mostrar formulario de pago Stripe
- Renderizar `StripePaymentForm` con:
  - `bookingId`
  - `clientSecret`
  - `billingAddress` (ya completado)
- Usuario completa datos de tarjeta en Stripe Elements

### Paso 5: Procesar pago
- Usuario hace clic en "Pagar"
- Validar que billingAddress esté completo
- Llamar `stripe.confirmCardPayment(clientSecret, { payment_method: {...} })`
- Mostrar loading mientras procesa

### Paso 6: Confirmar pago en backend
- Si Stripe retorna éxito:
  - Llamar `confirmPayment(bookingId, paymentIntentId)`
  - Si éxito: mostrar confirmación
  - Si error: mostrar error
- Si Stripe retorna error:
  - Mostrar mensaje de error específico
  - Permitir reintentar

---

## ⚠️ Consideraciones Importantes

### Seguridad
- ✅ Nunca exponer clave secreta de Stripe en frontend
- ✅ Usar solo clave pública (`pk_test_...`)
- ✅ Validar todos los datos en backend
- ✅ Usar HTTPS en producción

### Manejo de Estados
- ✅ No permitir múltiples intentos simultáneos
- ✅ Limpiar estados al cambiar de paso
- ✅ Guardar progreso en caso de error

### UX
- ✅ Mostrar loading states claros
- ✅ Mensajes de error específicos y accionables
- ✅ Permitir cancelar y volver atrás
- ✅ No perder datos si hay error

### Compatibilidad
- ✅ Verificar que Stripe.js funcione en todos los navegadores
- ✅ Fallback si Stripe no carga
- ✅ Manejar casos edge (sin internet, etc.)

---

## 📊 Checklist de Implementación

### Fase 1: Configuración
- [ ] Instalar `@stripe/stripe-js` y `@stripe/react-stripe-js`
- [ ] Agregar variable de entorno `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Crear `lib/stripe/stripe-client.ts`

### Fase 2: Servicio de Pago
- [ ] Crear `lib/payments/payment-service.ts`
- [ ] Implementar `createPaymentIntent()`
- [ ] Implementar `confirmPayment()`
- [ ] Manejar errores correctamente

### Fase 3: Componente Stripe
- [ ] Crear `components/checkout/StripePaymentForm.tsx`
- [ ] Integrar Stripe Elements
- [ ] Integrar BillingAddressForm
- [ ] Manejar estados de carga y error

### Fase 4: Flujo de Checkout
- [ ] Modificar `handleConfirmBooking` en `app/checkout/page.tsx`
- [ ] Cambiar `paymentMethod: 'pending'` al crear reserva
- [ ] Agregar paso de pago con Stripe
- [ ] Actualizar `PaymentSection.tsx` o reemplazarlo

### Fase 5: Errores y Estados
- [ ] Agregar estados de pago
- [ ] Implementar manejo de errores completo
- [ ] Mensajes de error amigables

### Fase 6: UI/UX
- [ ] Verificar diseño responsive
- [ ] Asegurar accesibilidad
- [ ] Probar en diferentes dispositivos

### Fase 7: Testing
- [ ] Probar flujo completo exitoso
- [ ] Probar tarjeta rechazada
- [ ] Probar errores de red
- [ ] Probar responsive

---

## 🚀 Orden de Implementación Recomendado

1. **Fase 1** - Configuración básica (30 min)
2. **Fase 2** - Servicio de pago (1 hora)
3. **Fase 3** - Componente Stripe (2 horas)
4. **Fase 4** - Integración en checkout (2 horas)
5. **Fase 5** - Manejo de errores (1 hora)
6. **Fase 6** - Ajustes UI/UX (30 min)
7. **Fase 7** - Testing (1 hora)

**Tiempo estimado total**: ~8 horas

---

## 📚 Referencias

- [Stripe.js Documentation](https://stripe.com/docs/stripe-js)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Testing Cards](https://stripe.com/docs/testing)
- [PAYMENT_ENDPOINTS_POSTMAN.md](./docs/PAYMENT_ENDPOINTS_POSTMAN.md)

---

## ✅ Criterios de Éxito

- ✅ Pagos se procesan correctamente con Stripe
- ✅ Reservas se crean con `paymentMethod: 'pending'` y se confirman después del pago
- ✅ Errores se manejan gracefully
- ✅ UI es responsive y accesible
- ✅ No se pierden datos en caso de error
- ✅ Flujo es intuitivo para el usuario

