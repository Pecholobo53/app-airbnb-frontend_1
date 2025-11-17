# ⚡ Quick Start - Milestone 5: Sistema de Checkout

> 5 minutos para entender el sistema de checkout implementado

---

## 🎯 ¿Qué es el Milestone 5?

**Sistema completo de checkout** que permite a los usuarios:
1. Revisar detalles de su reserva
2. Completar información del huésped
3. Seleccionar método de pago
4. Confirmar y crear la reserva

---

## 🚀 Flujo Completo

### 1. Desde Página de Detalle
```
Usuario en /propiedad/[id]
  ↓
Selecciona fechas y huéspedes en PriceCalculator
  ↓
Click en "Ir a checkout"
  ↓
Navega a /checkout?propertyId=...&checkIn=...&checkOut=...
```

### 2. En Página de Checkout
```
Usuario en /checkout
  ↓
Ve resumen de propiedad, fechas, precios
  ↓
Completa información del huésped
  ↓
Selecciona método de pago (card/paypal/bank_transfer)
  ↓
Completa datos de pago (MOCK - no procesa pagos reales)
  ↓
Click en "Confirmar reserva"
  ↓
Reserva creada → Redirige a /mis-reservas
```

---

## 📁 Archivos Principales

### Tipos
- `types/checkout.ts` - Interfaces TypeScript

### Base de Datos MOCK
- `lib/checkout/mock-checkout-db.ts` - Almacenamiento en memoria

### Servicios
- `lib/checkout/mock-checkout-service.ts` - Lógica de negocio
- `lib/checkout/utils.ts` - Utilidades (URLs, parsing)

### Componentes
- `components/checkout/CheckoutHeader.tsx` - Header con breadcrumb
- `components/checkout/CheckoutSummary.tsx` - Resumen de reserva
- `components/checkout/GuestInfoForm.tsx` - Formulario de huésped
- `components/checkout/PaymentSection.tsx` - Selección de pago

### Páginas
- `app/checkout/page.tsx` - Página principal de checkout

---

## 🔧 Uso Básico

### Navegar a Checkout desde PriceCalculator

```tsx
// components/property/PriceCalculator.tsx
const handleReserve = () => {
  const checkoutUrl = `/checkout?propertyId=${property.id}&checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}&adults=${guests}&children=0&infants=0`;
  router.push(checkoutUrl);
};
```

### Crear Sesión de Checkout

```typescript
import { MockCheckoutService } from '@/lib/checkout/mock-checkout-service';

const sessionResponse = await MockCheckoutService.createSession(
  userId,
  {
    propertyId: 'prop-001',
    property: propertyData,
    checkIn: new Date('2025-01-15'),
    checkOut: new Date('2025-01-20'),
    nights: 5,
    guests: { adults: 2, children: 0, infants: 0 },
    pricing: priceBreakdown,
  }
);
```

### Actualizar Información del Huésped

```typescript
const updateResponse = await MockCheckoutService.updateGuestInfo(
  sessionId,
  {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+34 612 345 678',
  }
);
```

### Procesar Pago (Simulado)

```typescript
const paymentResponse = await MockCheckoutService.processPayment(
  sessionId,
  {
    method: 'card',
    cardNumber: '1234567890123456',
    cardHolder: 'Juan Pérez',
    expiryDate: '12/25',
    cvv: '123',
  }
);
```

### Confirmar Reserva

```typescript
const confirmResponse = await MockCheckoutService.confirmBooking(sessionId);

if (confirmResponse.success) {
  // Reserva creada exitosamente
  router.push('/mis-reservas');
}
```

---

## 🎨 Componentes Reutilizables

### CheckoutSummary
```tsx
<CheckoutSummary
  property={property}
  checkIn={checkIn}
  checkOut={checkOut}
  nights={5}
  guests={{ adults: 2, children: 0, infants: 0 }}
  pricing={priceBreakdown}
/>
```

### GuestInfoForm
```tsx
<GuestInfoForm
  initialData={guestInfo}
  onSubmit={(data) => {
    // Guardar información del huésped
  }}
  isLoading={false}
/>
```

### PaymentSection
```tsx
<PaymentSection
  initialMethod="card"
  initialData={paymentInfo}
  onSubmit={(data) => {
    // Procesar pago
  }}
  isLoading={false}
/>
```

---

## ⚠️ Notas Importantes

### Pagos Simulados
- **TODOS los pagos son simulados**
- No se procesan pagos reales
- Los datos de tarjeta son solo para demostración
- En producción, integrar con Stripe/PayPal

### Sesiones Temporales
- Las sesiones de checkout expiran después de 30 minutos
- Se almacenan en memoria (no persisten entre reinicios)
- En producción, usar Redis o base de datos

### Validaciones
- Fechas deben ser válidas (check-out > check-in)
- Información del huésped requerida (nombre, email)
- Método de pago debe estar completo
- Todos los campos validados antes de confirmar

---

## 🐛 Troubleshooting

### Error: "Sesión no encontrada o expirada"
- La sesión expiró (30 minutos)
- Volver a la propiedad y crear nueva sesión

### Error: "Datos de checkout incompletos"
- Faltan parámetros en la URL
- Asegurarse de pasar: propertyId, checkIn, checkOut, adults

### Error: "Usuario no autenticado"
- Usuario debe estar logueado
- Redirige automáticamente a /login

---

## 📚 Próximos Pasos

1. **Probar el flujo completo**:
   - Ir a una propiedad
   - Seleccionar fechas
   - Ir a checkout
   - Completar información
   - Confirmar reserva

2. **Revisar código**:
   - Leer `MILESTONE_5.md` para detalles completos
   - Explorar componentes en `components/checkout/`
   - Ver servicios en `lib/checkout/`

3. **Personalizar**:
   - Agregar más métodos de pago
   - Mejorar validaciones
   - Agregar más información en resumen

---

**¿Listo para usar?** 🚀

1. Ve a cualquier propiedad: `/propiedad/[id]`
2. Selecciona fechas y huéspedes
3. Click en "Ir a checkout"
4. ¡Completa el proceso!

---

**Última actualización**: Milestone 5 completado  
**Tiempo estimado de lectura**: 5 minutos

