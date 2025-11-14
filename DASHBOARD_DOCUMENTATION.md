# 👤 Documentación Técnica - Dashboard de Usuario

## 📋 Índice

1. [Introducción](#introducción)
2. [Arquitectura](#arquitectura)
3. [Tipos y Modelos](#tipos-y-modelos)
4. [Servicios Mock](#servicios-mock)
5. [Context API](#context-api)
6. [Componentes](#componentes)
7. [Flujos de Usuario](#flujos-de-usuario)
8. [Testing](#testing)
9. [Migración a Backend](#migración-a-backend)

---

## 🎯 Introducción

El **Dashboard de Usuario** es un sistema dual que permite a los usuarios gestionar su experiencia como:
- **🏠 Huésped (Viajero)**: Ver viajes, reservas y favoritos
- **🏡 Anfitrión (Host)**: Gestionar propiedades, solicitudes y estadísticas

### ✨ Características Principales

**Modo Huésped:**
- Ver próximos viajes con detalles completos
- Historial de viajes pasados
- Estadísticas anuales (viajes, gasto)
- Acceso rápido a favoritos

**Modo Anfitrión:**
- Dashboard con métricas de ingresos y ocupación
- Gestión de solicitudes pendientes (aceptar/rechazar)
- Lista de propiedades con estadísticas
- Datos mensuales y tendencias

**General:**
- Switch instantáneo entre modos
- Persistencia de preferencia en localStorage
- Totalmente MOCK (sin backend real)
- Integración con módulo de Auth

---

## 🏗️ Arquitectura

```
lib/dashboard/
├── mock-bookings-db.ts           # 8 reservas + estadísticas
├── mock-dashboard-service.ts     # Servicio de búsqueda/gestión
└── dashboard-context.tsx         # Context API global

components/dashboard/
├── ModeSwitcher.tsx              # Toggle guest/host
├── shared/
│   └── StatCard.tsx              # Card de métrica reutilizable
├── guest/
│   ├── GuestDashboard.tsx        # Dashboard de huésped
│   └── TripCard.tsx              # Card de viaje individual
└── host/
    ├── HostDashboard.tsx         # Dashboard de anfitrión
    └── PendingRequestCard.tsx    # Card de solicitud

app/dashboard/
└── page.tsx                      # Página principal

types/
└── dashboard.ts                  # Interfaces TypeScript
```

---

## 📦 Tipos y Modelos

### Booking (Reserva)

```typescript
interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  guestId: string;
  guest: User;
  hostId: string;
  host: User;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: { adults: number; children: number; infants: number };
  pricing: {
    basePrice: number;
    nightsTotal: number;
    cleaningFee: number;
    serviceFee: number;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'active';
  createdAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  guestReviewGiven?: boolean;
  hostReviewGiven?: boolean;
}
```

### GuestStats

```typescript
interface GuestStats {
  guestId: string;
  currentYear: number;
  upcomingTrips: number;
  activeBookings: number;
  favoritesCount: number;
  completedTrips: number;
  totalSpentThisYear: number;
  averageTripCost: number;
  reviewsGiven: number;
  averageRatingGiven: number;
}
```

### HostStats

```typescript
interface HostStats {
  hostId: string;
  period: 'current_month' | 'last_month' | 'year';
  totalRevenue: number;
  revenueTrend: number; // % cambio
  activeProperties: number;
  totalBookings: number;
  pendingRequests: number;
  upcomingArrivals: number;
  occupancyRate: number; // 0-100
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  responseTime: string;
  propertyStats: PropertyStats[];
}
```

---

## 🔧 Servicios Mock

### MockDashboardService

**Ubicación**: `lib/dashboard/mock-dashboard-service.ts`

#### Métodos Principales

```typescript
// Obtener estadísticas de huésped
static async getGuestStats(guestId: string): Promise<DashboardResponse<GuestStats>>

// Obtener estadísticas de anfitrión
static async getHostStats(hostId: string): Promise<DashboardResponse<HostStats>>

// Obtener próximos viajes
static async getUpcomingTrips(guestId: string): Promise<DashboardResponse<Booking[]>>

// Obtener historial
static async getPastTrips(guestId: string): Promise<DashboardResponse<Booking[]>>

// Obtener solicitudes pendientes
static async getPendingRequests(hostId: string): Promise<DashboardResponse<Booking[]>>

// Gestionar reserva (aceptar, rechazar, cancelar)
static async handleBookingAction(
  bookingId: string,
  action: 'accept' | 'reject' | 'cancel'
): Promise<DashboardResponse<Booking>>
```

#### Ejemplo de Uso

```typescript
// Obtener próximos viajes
const response = await MockDashboardService.getUpcomingTrips('user-001');
if (response.success) {
  console.log('Próximos viajes:', response.data);
}

// Aceptar una reserva
const acceptResponse = await MockDashboardService.handleBookingAction(
  'booking-004',
  'accept'
);
if (acceptResponse.success) {
  console.log('Reserva aceptada!');
}
```

---

## 🌐 Context API

### DashboardProvider

**Ubicación**: `lib/dashboard/dashboard-context.tsx`

#### Estado

```typescript
interface DashboardState {
  mode: 'guest' | 'host';
  guestStats: GuestStats | null;
  hostStats: HostStats | null;
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  pendingRequests: Booking[];
  confirmedBookings: Booking[];
  monthlyData: MonthlyData[];
  isLoading: boolean;
  error: string | null;
}
```

#### Métodos

```typescript
interface DashboardContextType extends DashboardState {
  switchMode: (mode: DashboardMode) => void;
  refreshData: () => Promise<void>;
  acceptBooking: (bookingId: string) => Promise<boolean>;
  rejectBooking: (bookingId: string) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}
```

#### Uso

```typescript
import { useDashboard } from '@/lib/dashboard/dashboard-context';

function MyComponent() {
  const {
    mode,
    guestStats,
    upcomingBookings,
    switchMode,
    acceptBooking
  } = useDashboard();

  // Cambiar modo
  const handleSwitch = () => {
    switchMode(mode === 'guest' ? 'host' : 'guest');
  };

  // Aceptar reserva
  const handleAccept = async (bookingId: string) => {
    const success = await acceptBooking(bookingId);
    if (success) {
      console.log('Reserva aceptada!');
    }
  };
}
```

---

## 🎨 Componentes

### 1. ModeSwitcher

**Archivo**: `components/dashboard/ModeSwitcher.tsx`

Toggle para cambiar entre modo huésped y anfitrión.

**Props**: Ninguna (usa `useDashboard()`)

**Ubicación**: Se muestra en el header del dashboard

---

### 2. StatCard

**Archivo**: `components/dashboard/shared/StatCard.tsx`

Card reutilizable para mostrar métricas.

**Props**:
```typescript
{
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;      // Ej: "+15%"
  trendUp?: boolean;   // true = verde, false = rojo
}
```

---

### 3. TripCard

**Archivo**: `components/dashboard/guest/TripCard.tsx`

Card de viaje individual para el modo huésped.

**Props**:
```typescript
{
  booking: Booking;
  onViewDetails?: () => void;
}
```

**Características**:
- Muestra imagen de la propiedad
- Fechas de check-in/check-out
- Estado visual (confirmada, pendiente, etc.)
- Precio total
- Botón "Ver detalles"

---

### 4. GuestDashboard

**Archivo**: `components/dashboard/guest/GuestDashboard.tsx`

Dashboard completo para modo huésped.

**Secciones**:
- Saludo personalizado
- 4 Stats Cards (viajes, favoritos, gasto)
- Próximos viajes (lista de TripCard)
- Historial de viajes pasados
- Estado vacío si no hay viajes

---

### 5. HostDashboard

**Archivo**: `components/dashboard/host/HostDashboard.tsx`

Dashboard completo para modo anfitrión.

**Secciones**:
- Saludo "Panel de Anfitrión"
- 4 Stats Cards (ingresos, propiedades, ocupación, solicitudes)
- Solicitudes pendientes (lista de PendingRequestCard)
- Mis propiedades (grid con estadísticas)
- Datos mensuales (futuro)

---

### 6. PendingRequestCard

**Archivo**: `components/dashboard/host/PendingRequestCard.tsx`

Card de solicitud de reserva pendiente.

**Props**:
```typescript
{
  booking: Booking;
}
```

**Características**:
- Info del huésped (foto, nombre)
- Detalles de la reserva (fechas, huéspedes, precio)
- Botones "Aceptar" y "Rechazar"
- Estado de procesamiento (disabled durante acción)
- Toasts de feedback

---

## 🔄 Flujos de Usuario

### Flujo 1: Huésped revisa próximo viaje

```
1. Login → UserMenu → Click "Dashboard"
2. Dashboard carga en modo "guest" (por defecto)
3. Ve card "3 Próximos viajes"
4. Sección "Próximos Viajes" muestra sus reservas
5. Ve detalles (fechas, precio, propiedad)
6. Click "Ver detalles" (futuro: página de detalle)
```

### Flujo 2: Anfitrión acepta reserva

```
1. Login → UserMenu → Click "Dashboard"
2. Si guardó preferencia, carga en modo "host"
3. Si no, usa ModeSwitcher para cambiar
4. Ve notificación "2 solicitudes pendientes"
5. Sección "Solicitudes Pendientes" destacada
6. Lee solicitud de Laura M. (fechas, precio, huéspedes)
7. Click "✅ Aceptar"
8. Confirmación toast: "Reserva aceptada correctamente"
9. Dashboard se refresca automáticamente
10. Solicitud desaparece de pendientes
11. Laura recibe notificación (futuro)
```

### Flujo 3: Usuario dual cambia de modo

```
1. Login → Dashboard (modo guest)
2. Revisa sus próximos viajes
3. Click en ModeSwitcher dropdown
4. Select "Modo Anfitrión"
5. Toast: "Modo Anfitrión activado"
6. Dashboard cambia instantáneamente
7. Ve panel con propiedades y solicitudes
8. Gestiona reservas pendientes
9. Click ModeSwitcher → "Modo Viajero"
10. Vuelve a vista de huésped
11. Preferencia guardada en localStorage
```

---

## 🧪 Testing Manual

### Test 1: Dashboard de Huésped

**Pasos**:
1. Login con `demo@airbnb.com` / `Demo1234!`
2. Click "Dashboard" en UserMenu
3. Verifica que muestra:
   - Saludo "Hola, Juan"
   - 4 Stats Cards con números correctos
   - Sección "Próximos Viajes" con 2 viajes
   - Cada TripCard muestra info completa

**Resultado esperado**:
- ✅ Stats: 2 próximos, 3 favoritos, 8 viajes 2024
- ✅ Viajes: Barcelona (Ene 15-20) y Lisboa (Feb 1-7)
- ✅ Historial: Madrid (Oct 10-15) completado

### Test 2: Switch a Modo Anfitrión

**Pasos**:
1. En dashboard de huésped
2. Click ModeSwitcher dropdown (esquina superior derecha)
3. Select "Modo Anfitrión"
4. Verifica cambio instantáneo

**Resultado esperado**:
- ✅ Toast: "Modo Anfitrión activado"
- ✅ Dashboard cambia a HostDashboard
- ✅ Muestra "Panel de Anfitrión"
- ✅ Stats: €2,450, 2 propiedades, 75% ocupación
- ✅ 2 solicitudes pendientes visibles

### Test 3: Aceptar Solicitud de Reserva

**Pasos**:
1. En modo anfitrión
2. Ve sección "Solicitudes Pendientes (2)"
3. Primera solicitud: Laura M.
4. Click botón "✅ Aceptar"
5. Espera procesamiento

**Resultado esperado**:
- ✅ Botones se deshabilitan durante proceso
- ✅ Toast: "Reserva aceptada correctamente"
- ✅ Solicitud desaparece de la lista
- ✅ Contador actualiza a "(1)"
- ✅ Dashboard se refresca

### Test 4: Persistencia de Modo

**Pasos**:
1. Cambia a modo anfitrión
2. Refresh página (F5)
3. Verifica que mantiene modo anfitrión

**Resultado esperado**:
- ✅ Modo persiste en localStorage
- ✅ Dashboard carga directamente en modo anfitrión
- ✅ No vuelve a modo huésped

---

## 📊 Datos Mock

### Reservas (8 total)

**Usuario demo como HUÉSPED** (3 reservas):
1. `booking-001`: Barcelona, Ene 15-20 (CONFIRMADA) - Próximo viaje
2. `booking-002`: Madrid, Oct 10-15 (COMPLETADA) - Pasado
3. `booking-003`: Lisboa, Feb 1-7 (CONFIRMADA) - Futuro

**Usuario demo como ANFITRIÓN** (4 reservas en sus propiedades):
4. `booking-004`: Laura M. solicita Villa (PENDIENTE)
5. `booking-005`: Carlos R. solicita Loft (PENDIENTE)
6. `booking-006`: Sofia L. en Villa (CONFIRMADA)
7. `booking-007`: Pablo G. en Loft (COMPLETADA)

### Estadísticas Mock

**Guest Stats**:
- Próximos viajes: 2
- Viajes en 2024: 8
- Gasto total: €3,200
- Favoritos: 3

**Host Stats**:
- Ingresos mes: €2,450 (+15%)
- Propiedades: 2
- Ocupación: 75%
- Solicitudes: 2

---

## 🚀 Migración a Backend Real

### Paso 1: API Endpoints

```typescript
// app/api/dashboard/guest/route.ts
export async function GET(request: Request) {
  const userId = getUserIdFromAuth();
  
  const stats = await db.booking.aggregate({
    where: { guestId: userId },
    // ... calcular stats
  });

  return Response.json({ success: true, data: stats });
}

// app/api/dashboard/host/route.ts
export async function GET(request: Request) {
  const userId = getUserIdFromAuth();
  
  const stats = await db.booking.aggregate({
    where: { hostId: userId },
    // ... calcular stats
  });

  return Response.json({ success: true, data: stats });
}

// app/api/bookings/[id]/accept/route.ts
export async function POST(request: Request) {
  const { bookingId } = await request.json();
  
  const booking = await db.booking.update({
    where: { id: bookingId },
    data: {
      status: 'confirmed',
      confirmedAt: new Date()
    }
  });

  // Enviar notificación al huésped
  await sendBookingConfirmation(booking);

  return Response.json({ success: true, data: booking });
}
```

### Paso 2: Actualizar Servicio

```typescript
// Reemplazar MockDashboardService con DashboardService
export class DashboardService {
  static async getGuestStats(guestId: string) {
    const response = await fetch(`/api/dashboard/guest?userId=${guestId}`);
    return response.json();
  }

  static async acceptBooking(bookingId: string) {
    const response = await fetch(`/api/bookings/${bookingId}/accept`, {
      method: 'POST'
    });
    return response.json();
  }
}
```

### Paso 3: Base de Datos (Prisma)

```prisma
model Booking {
  id            String   @id @default(cuid())
  propertyId    String
  property      Property @relation(fields: [propertyId], references: [id])
  guestId       String
  guest         User     @relation("GuestBookings", fields: [guestId], references: [id])
  hostId        String
  host          User     @relation("HostBookings", fields: [hostId], references: [id])
  checkIn       DateTime
  checkOut      DateTime
  nights        Int
  guestAdults   Int
  guestChildren Int
  guestInfants  Int
  basePrice     Float
  total         Float
  status        BookingStatus
  createdAt     DateTime @default(now())
  confirmedAt   DateTime?
  cancelledAt   DateTime?
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  ACTIVE
}
```

---

## ✅ Checklist de Implementación

- [x] Tipos TypeScript definidos
- [x] Datos MOCK (8 reservas)
- [x] Servicio MOCK completo
- [x] Dashboard Context API
- [x] ModeSwitcher componente
- [x] StatCard reutilizable
- [x] TripCard para huésped
- [x] GuestDashboard completo
- [x] PendingRequestCard para anfitrión
- [x] HostDashboard completo
- [x] Página /dashboard
- [x] Integración en UserMenu
- [x] Persistencia en localStorage
- [x] 0 errores de linting
- [x] Documentación técnica completa

---

**Última actualización**: 14 Noviembre 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción (MOCK)

