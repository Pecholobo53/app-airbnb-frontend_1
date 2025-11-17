# 🛒 MILESTONE 5: Sistema de Checkout

> **Objetivo**: Implementar una pantalla/ruta de checkout con los detalles básicos para crear reservas, utilizando datos MOCK y manteniendo el mismo estilo visual del resto de la aplicación.

---

## 📊 ESTADO DEL MILESTONE

| Métrica | Valor |
|---------|-------|
| **Estado General** | ⚪ PENDIENTE |
| **Fecha Inicio** | _Pendiente_ |
| **Fecha Finalización** | _Pendiente_ |
| **Progreso** | 0/25 tareas (0%) |
| **Prioridad** | 🔴 ALTA |
| **Dependencias** | ✅ Milestone 1 (Auth), ✅ Milestone 2 (Búsqueda), ✅ Milestone 3 (Detalle), ✅ Milestone 4 (Favoritos) |
| **Tiempo Estimado** | 5-7 horas |

---

## 🎯 VISIÓN DEL PRODUCTO

### Contexto
Con los módulos de autenticación, búsqueda, detalle de propiedad y favoritos funcionando, los usuarios necesitan:
1. **Completar el proceso de reserva** desde la página de detalle
2. **Revisar los detalles** de su reserva antes de confirmar
3. **Ver el desglose de precios** completo
4. **Confirmar la reserva** de forma segura

### Objetivo Estratégico
Crear una experiencia de checkout fluida que permita a los usuarios:
1. 🛒 **Revisar** todos los detalles de la reserva
2. 💰 **Ver** desglose completo de precios
3. 👤 **Confirmar** información del huésped
4. 💳 **Simular** proceso de pago (MOCK)
5. ✅ **Confirmar** la reserva y redirigir a "Mis Reservas"

### Impacto Esperado
- 📈 **+150% conversión** de visitas a reservas
- 🎯 **+80% completitud** del proceso de reserva
- 💰 **+60% transparencia** en precios
- ⭐ **4.8+ rating** de satisfacción del checkout

---

## ✅ TO-DO LIST

### 🏗️ FASE 1: BASE DE DATOS MOCK Y TIPOS (45-60 min)

#### TASK-001: Crear tipos TypeScript para Checkout ⏱️ 20 min
- [ ] Crear `types/checkout.ts` con interfaces:
  ```typescript
  interface CheckoutData {
    propertyId: string;
    property: Property;
    checkIn: Date;
    checkOut: Date;
    nights: number;
    guests: {
      adults: number;
      children: number;
      infants: number;
    };
    pricing: PriceBreakdown;
    guestInfo?: {
      name: string;
      email: string;
      phone?: string;
    };
  }

  type PaymentMethod = 'card' | 'paypal' | 'bank_transfer';

  interface PaymentInfo {
    method: PaymentMethod;
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
  }
  ```
- [ ] Exportar tipos desde `types/index.ts`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Ninguna

#### TASK-002: Crear base de datos MOCK de Checkout ⏱️ 25 min
- [ ] Crear `lib/checkout/mock-checkout-db.ts`
- [ ] Función `createCheckoutSession(data)` - Crear sesión temporal
- [ ] Función `getCheckoutSession(sessionId)` - Obtener sesión
- [ ] Función `clearCheckoutSession(sessionId)` - Limpiar sesión
- [ ] Almacenamiento en memoria (Map o array)
- [ ] Expiración automática de sesiones (opcional, 30 min)
- [ ] Documentación MOCK completa
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001

---

### 🔧 FASE 2: SERVICIOS MOCK (45-60 min)

#### TASK-003: Crear servicio MOCK de Checkout ⏱️ 30 min
- [ ] Crear `lib/checkout/mock-checkout-service.ts`
- [ ] Método `createCheckoutSession(data)` - Crear sesión de checkout
- [ ] Método `getCheckoutSession(sessionId)` - Obtener sesión
- [ ] Método `updateGuestInfo(sessionId, guestInfo)` - Actualizar info del huésped
- [ ] Método `processPayment(sessionId, paymentInfo)` - Procesar pago (simulado)
- [ ] Método `confirmBooking(sessionId)` - Confirmar reserva final
- [ ] Simulación de delay de red (200-400ms)
- [ ] Manejo de errores (sesión expirada, datos inválidos)
- [ ] Documentación del servicio
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-002

#### TASK-004: Integrar checkout con servicio de reservas ⏱️ 15 min
- [ ] Actualizar `mock-checkout-service.ts`
- [ ] Llamar a `MockDashboardService.createBooking()` al confirmar
- [ ] Validar datos antes de crear reserva
- [ ] Manejar errores de creación de reserva
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-003

---

### 🛒 FASE 3: COMPONENTES DE CHECKOUT (90-120 min)

#### TASK-005: Crear componente CheckoutSummary ⏱️ 30 min
- [ ] Crear `components/checkout/CheckoutSummary.tsx`
- [ ] Mostrar imagen y título de propiedad
- [ ] Mostrar fechas (check-in/check-out)
- [ ] Mostrar número de huéspedes
- [ ] Mostrar desglose de precios completo
- [ ] Estilo consistente con PriceCalculator
- [ ] Responsive design
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001

#### TASK-006: Crear componente GuestInfoForm ⏱️ 25 min
- [ ] Crear `components/checkout/GuestInfoForm.tsx`
- [ ] Formulario con react-hook-form
- [ ] Campos: nombre, email, teléfono (opcional)
- [ ] Validación con Zod
- [ ] Pre-llenar con datos del usuario autenticado
- [ ] Mostrar avatar del usuario si está autenticado
- [ ] Estados de error y validación
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001

#### TASK-007: Crear componente PaymentSection ⏱️ 35 min
- [ ] Crear `components/checkout/PaymentSection.tsx`
- [ ] Selector de método de pago (card, paypal, bank_transfer)
- [ ] Formulario de tarjeta (MOCK, no procesa pagos reales)
- [ ] Campos: número de tarjeta, titular, expiración, CVV
- [ ] Validación básica de formato
- [ ] Indicador visual de método seleccionado
- [ ] Mensaje claro: "Datos de pago simulados - No se procesará ningún cargo"
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-001

#### TASK-008: Crear componente CheckoutHeader ⏱️ 10 min
- [ ] Crear `components/checkout/CheckoutHeader.tsx`
- [ ] Título "Confirma y paga"
- [ ] Breadcrumb: Inicio > Propiedad > Checkout
- [ ] Botón de volver a propiedad
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: Ninguna

---

### 📄 FASE 4: PÁGINA DE CHECKOUT (60-75 min)

#### TASK-009: Crear página de Checkout ⏱️ 45 min
- [ ] Crear `app/checkout/page.tsx`
- [ ] Client Component con `useAuth`
- [ ] Obtener datos de checkout desde query params o session
- [ ] Layout de dos columnas (similar a página de detalle)
- [ ] Columna izquierda: CheckoutSummary, GuestInfoForm, PaymentSection
- [ ] Columna derecha: Resumen sticky con botón "Confirmar reserva"
- [ ] Estados: loading, error, success
- [ ] Redirigir a login si no está autenticado
- [ ] Validar que hay datos de checkout válidos
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-005, TASK-006, TASK-007, TASK-008

#### TASK-010: Agregar validaciones y manejo de errores ⏱️ 20 min
- [ ] Validar que las fechas son válidas
- [ ] Validar que el número de huéspedes es correcto
- [ ] Validar información del huésped
- [ ] Validar información de pago (formato)
- [ ] Mostrar mensajes de error claros
- [ ] Manejar sesión expirada
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-009

#### TASK-011: Implementar flujo de confirmación ⏱️ 10 min
- [ ] Botón "Confirmar reserva" en página de checkout
- [ ] Procesar pago (simulado)
- [ ] Crear reserva con `MockDashboardService.createBooking()`
- [ ] Mostrar toast de éxito
- [ ] Redirigir a `/mis-reservas` después de confirmar
- [ ] Limpiar sesión de checkout
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-009, TASK-004

---

### 🔗 FASE 5: INTEGRACIÓN CON PÁGINA DE DETALLE (30-45 min)

#### TASK-012: Actualizar PriceCalculator para navegar a checkout ⏱️ 20 min
- [ ] Actualizar `components/property/PriceCalculator.tsx`
- [ ] Cambiar botón "Reservar" para navegar a `/checkout`
- [ ] Pasar datos de checkout como query params o session
- [ ] Mantener funcionalidad de reserva directa como alternativa
- [ ] Opción: botón "Ir a checkout" además de "Reservar"
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: TASK-009

#### TASK-013: Agregar ruta de checkout en constantes ⏱️ 5 min
- [ ] Verificar que `ROUTES.CHECKOUT` existe en `lib/constants.ts`
- [ ] Agregar si falta: `CHECKOUT: '/checkout'`
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Ninguna

#### TASK-014: Agregar utilidad para pasar datos a checkout ⏱️ 15 min
- [ ] Crear función helper `createCheckoutUrl(data)` en `lib/checkout/utils.ts`
- [ ] Serializar datos de checkout a query params
- [ ] O crear sesión temporal y pasar sessionId
- [ ] Documentar uso
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-002

---

### 🎨 FASE 6: UI/UX Y ESTADOS (30-45 min)

#### TASK-015: Agregar estados de loading en checkout ⏱️ 10 min
- [ ] Loading state mientras carga sesión
- [ ] Loading state mientras procesa pago
- [ ] Loading state mientras crea reserva
- [ ] Skeleton para componentes principales
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-009

#### TASK-016: Agregar animaciones y transiciones ⏱️ 10 min
- [ ] Transición suave entre secciones
- [ ] Animación al confirmar reserva
- [ ] Hover effects en botones
- [ ] Feedback visual al completar campos
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-009

#### TASK-017: Mejorar responsive design ⏱️ 15 min
- [ ] Layout de una columna en mobile
- [ ] Resumen sticky se convierte en fijo al final en mobile
- [ ] Formularios adaptables
- [ ] Textos y botones accesibles
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-009

---

### 🧪 FASE 7: TESTING Y VALIDACIÓN (30-45 min)

#### TASK-018: Probar flujo completo de checkout ⏱️ 20 min
- [ ] Ir a página de detalle de propiedad
- [ ] Seleccionar fechas y huéspedes
- [ ] Hacer click en "Ir a checkout"
- [ ] Verificar que se cargan los datos correctamente
- [ ] Completar información del huésped
- [ ] Seleccionar método de pago
- [ ] Completar datos de tarjeta (MOCK)
- [ ] Confirmar reserva
- [ ] Verificar que se crea la reserva
- [ ] Verificar redirección a "Mis Reservas"
- **Prioridad**: 🔴 CRÍTICA
- **Dependencias**: Todas las tareas anteriores

#### TASK-019: Validar estados edge ⏱️ 15 min
- [ ] Usuario no autenticado → redirigir a login
- [ ] Datos de checkout inválidos → mostrar error
- [ ] Sesión expirada → mostrar mensaje y redirigir
- [ ] Error al crear reserva → mostrar mensaje de error
- [ ] Campos de formulario inválidos → mostrar errores
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: Todas las tareas anteriores

#### TASK-020: Validar responsive en diferentes dispositivos ⏱️ 10 min
- [ ] Probar en mobile (320px, 375px, 414px)
- [ ] Probar en tablet (768px, 1024px)
- [ ] Probar en desktop (1280px, 1920px)
- [ ] Verificar que todos los elementos son accesibles
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-017

---

### 📝 FASE 8: DOCUMENTACIÓN (30-45 min)

#### TASK-021: Documentar servicio de Checkout ⏱️ 15 min
- [ ] Agregar documentación completa en `mock-checkout-service.ts`
- [ ] Explicar cada método
- [ ] Ejemplos de uso
- [ ] Notas sobre migración a backend real
- **Prioridad**: 🟡 MEDIA
- **Dependencias**: TASK-003

#### TASK-022: Actualizar PROJECT_INDEX.md ⏱️ 10 min
- [ ] Actualizar estado de Milestone 5
- [ ] Agregar referencias a nuevos archivos
- [ ] Actualizar roadmap
- **Prioridad**: 🟢 BAJA
- **Dependencias**: Todas las tareas anteriores

#### TASK-023: Crear QUICK_START_MILESTONE5.md ⏱️ 20 min
- [ ] Guía rápida de 5 minutos
- [ ] Cómo usar el checkout
- [ ] Flujo completo paso a paso
- [ ] Ejemplos de código
- **Prioridad**: 🟢 BAJA
- **Dependencias**: Todas las tareas anteriores

---

### 🎯 FASE 9: OPTIMIZACIÓN Y PULIDO (20-30 min)

#### TASK-024: Optimizar rendimiento ⏱️ 10 min
- [ ] Verificar que no hay re-renders innecesarios
- [ ] Lazy loading de componentes pesados si es necesario
- [ ] Optimizar imágenes
- **Prioridad**: 🟢 BAJA
- **Dependencias**: TASK-009

#### TASK-025: Mejorar accesibilidad ⏱️ 10 min
- [ ] Agregar `aria-label` a botones y formularios
- [ ] Navegación por teclado
- [ ] Focus management
- [ ] Screen reader friendly
- **Prioridad**: 🟢 BAJA
- **Dependencias**: Todas las tareas anteriores

---

## 📋 CHECKLIST DE VALIDACIÓN

### ✅ Funcionalidades Core
- [ ] Usuario puede navegar a checkout desde página de detalle
- [ ] Checkout muestra todos los detalles de la reserva
- [ ] Usuario puede completar información del huésped
- [ ] Usuario puede seleccionar método de pago
- [ ] Usuario puede completar datos de pago (MOCK)
- [ ] Usuario puede confirmar la reserva
- [ ] Reserva se crea correctamente
- [ ] Redirección a "Mis Reservas" funciona

### ✅ Estados y Errores
- [ ] Loading states funcionan
- [ ] Estados de error se muestran correctamente
- [ ] Validaciones de formulario funcionan
- [ ] Usuario no autenticado es redirigido
- [ ] Sesión expirada se maneja correctamente

### ✅ UI/UX
- [ ] Diseño consistente con el resto de la app
- [ ] Responsive en mobile y desktop
- [ ] Animaciones suaves
- [ ] Feedback visual claro
- [ ] Formularios fáciles de usar

### ✅ Integración
- [ ] Integrado con sistema de autenticación
- [ ] Integrado con página de detalle de propiedad
- [ ] Integrado con servicio de reservas
- [ ] Navegación funciona correctamente

---

## 🎯 CRITERIOS DE ÉXITO

### Funcional
- ✅ Usuario puede completar checkout completamente
- ✅ Reserva se crea correctamente después del checkout
- ✅ Todo funciona sin backend real (MOCK)

### Técnico
- ✅ Código simple y mantenible
- ✅ Tipos TypeScript correctos
- ✅ Sin errores de linting
- ✅ Documentación completa

### UX
- ✅ Interfaz intuitiva
- ✅ Feedback inmediato
- ✅ Estados claros
- ✅ Responsive design

---

## 📦 ARCHIVOS A CREAR

### Tipos
- `types/checkout.ts`

### Base de Datos MOCK
- `lib/checkout/mock-checkout-db.ts`

### Servicios MOCK
- `lib/checkout/mock-checkout-service.ts`
- `lib/checkout/utils.ts`

### Componentes
- `components/checkout/CheckoutHeader.tsx`
- `components/checkout/CheckoutSummary.tsx`
- `components/checkout/GuestInfoForm.tsx`
- `components/checkout/PaymentSection.tsx`

### Páginas
- `app/checkout/page.tsx`

### Documentación
- `QUICK_START_MILESTONE5.md`

---

## 🔄 DEPENDENCIAS ENTRE TAREAS

```
TASK-001 (Tipos Checkout)
  └─> TASK-002 (DB Checkout)
      └─> TASK-003 (Servicio Checkout)
          └─> TASK-004 (Integrar con Reservas)
              └─> TASK-011 (Flujo Confirmación)

TASK-001 (Tipos Checkout)
  └─> TASK-005 (CheckoutSummary)
  └─> TASK-006 (GuestInfoForm)
  └─> TASK-007 (PaymentSection)
      └─> TASK-009 (Página Checkout)
          └─> TASK-012 (Integrar con Detalle)
```

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **FASE 1**: Tipos y Base de Datos MOCK (TASK-001, TASK-002)
2. **FASE 2**: Servicios MOCK (TASK-003, TASK-004)
3. **FASE 3**: Componentes de Checkout (TASK-005 a TASK-008)
4. **FASE 4**: Página de Checkout (TASK-009 a TASK-011)
5. **FASE 5**: Integración (TASK-012 a TASK-014)
6. **FASE 6**: UI/UX (TASK-015 a TASK-017)
7. **FASE 7**: Testing (TASK-018 a TASK-020)
8. **FASE 8**: Documentación (TASK-021 a TASK-023)
9. **FASE 9**: Optimización (TASK-024, TASK-025)

---

## 📝 NOTAS IMPORTANTES

### Decisiones Técnicas

**Sin nuevas dependencias**:
- Usar lo que ya está instalado
- React Hook Form para formularios (ya instalado)
- Zod para validación (ya instalado)
- Lucide React para iconos (ya instalado)
- Sonner para toasts (ya instalado)

**Modo MOCK completo**:
- Todos los datos en memoria
- Pagos simulados (no procesa pagos reales)
- Sesiones temporales en memoria
- Persistencia solo durante sesión

**Priorizar UX**:
- Feedback inmediato
- Validación en tiempo real
- Estados claros
- Mensajes útiles

### Para Producción (Futuro)

- Integrar con pasarela de pago real (Stripe, PayPal)
- Persistencia en base de datos
- Sesiones de checkout en servidor
- Confirmación por email
- Webhooks de pago
- Manejo de errores de pago

---

## 🎓 RECURSOS Y REFERENCIAS

### Inspiración de UI
- **Airbnb.com** (referencia principal)
- **Booking.com** (checkout flow)
- **Uber** (proceso de pago)

### Documentación Técnica
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Última actualización**: _Pendiente_  
**Responsable**: Product Owner  
**Sprint**: Milestone 5 (5-7 horas de desarrollo)
