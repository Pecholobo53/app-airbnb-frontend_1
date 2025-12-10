# 📋 PLAN DE INTEGRACIÓN - MÓDULO USUARIOS

> **Fecha**: 2025-01-XX  
> **Módulo**: Usuarios (USERS)  
> **Estado**: 🔄 EN PLANIFICACIÓN  
> **Tipo**: Integración Frontend-Backend API REST

---

## 🎯 FASE: MÓDULO USUARIOS

### **1. AUDITORÍA (SIMULACRO REAL)**

#### Archivos Identificados:

**Servicios y Contextos:**
- ✅ `lib/auth/auth-service.ts` - Ya tiene `getProfile()` y `updateProfile()` integrados
- ⚠️ `lib/auth/mock-users-db-stub.ts` - **STUB TEMPORAL** usado por otros módulos mock
- ✅ `lib/auth/auth-context.tsx` - Usa `AuthService` (ya integrado)

**Componentes:**
- ✅ `app/perfil/page.tsx` - Página de perfil de usuario (usa `useAuth()`)
- ✅ `components/auth/UserAvatar.tsx` - Avatar de usuario
- ✅ `components/auth/UserMenu.tsx` - Menú de usuario

**Tipos:**
- ✅ `types/auth.ts` - Define `User`, `UpdateProfileData`, etc.

**Módulos que Dependen del Stub:**
- ⚠️ `lib/notifications/mock-notifications-db.ts` - Usa `MOCK_USERS`
- ⚠️ `lib/notifications/mock-notifications-service.ts` - Usa `findUserById()`
- ⚠️ `lib/favorites/mock-favorites-db.ts` - Usa `MOCK_USERS`
- ⚠️ `lib/favorites/mock-favorites-service.ts` - Usa `findUserById()`
- ⚠️ `lib/dashboard/mock-dashboard-service.ts` - Usa `MOCK_USERS`
- ⚠️ `lib/dashboard/mock-bookings-db.ts` - Usa `MOCK_USERS`

#### Mapa de Estados UI:

**Página de Perfil (`app/perfil/page.tsx`):**
- ✅ **Loading**: Muestra `AuthGuard` con loading state
- ✅ **Success**: Muestra datos del usuario (nombre, email, teléfono, avatar)
- ✅ **Editing**: Modo edición con formulario
- ✅ **Error**: Maneja errores de `updateUser()` con toast
- ⚠️ **Empty**: No maneja caso de usuario no encontrado (debería redirigir)

**Componentes:**
- ✅ `UserAvatar`: Maneja avatar o iniciales
- ✅ `UserMenu`: Muestra menú desplegable con opciones

#### Inyección de Mock:

**Fuente de Datos Mock:**
- `lib/auth/mock-users-db-stub.ts` exporta `MOCK_USERS` y `findUserById()`
- Usado por módulos: notifications, favorites, dashboard, bookings

**Forma de Inyección:**
- Import directo: `import { MOCK_USERS, findUserById } from '@/lib/auth/mock-users-db-stub'`
- Búsqueda en array: `MOCK_USERS.find(u => u.id === id)`

**Estados Vacíos/Errores:**
- ⚠️ No hay manejo de errores cuando `findUserById()` retorna `undefined`
- ⚠️ Los módulos mock asumen que el usuario siempre existe

---

### **2. POSTMAN → CONTRATO**

#### Endpoints Identificados:

Basado en el patrón del módulo AUTH y la estructura existente:

**1. GET /api/auth/me** (Ya implementado en AuthService)
- **Método**: GET
- **Ruta**: `/api/auth/me`
- **Autenticación**: ✅ Requiere JWT (Bearer token)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success: true, data: User }`

**2. PUT /api/auth/profile** (Ya implementado en AuthService)
- **Método**: PUT
- **Ruta**: `/api/auth/profile`
- **Autenticación**: ✅ Requiere JWT
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**: `{ name?: string, phone?: string, avatar?: string }`
- **Response**: `{ success: true, data: User }`

**3. GET /api/users/{userId}** (Nuevo - para obtener otros usuarios)
- **Método**: GET
- **Ruta**: `/api/users/{userId}`
- **Autenticación**: ✅ Requiere JWT (opcional, según política)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success: true, data: User }`

**4. GET /api/users** (Nuevo - para búsqueda/listado)
- **Método**: GET
- **Ruta**: `/api/users?search=...&limit=...&offset=...`
- **Autenticación**: ✅ Requiere JWT (admin o según política)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success: true, data: User[], total: number }`

#### Contratos Request/Response:

**GET /api/users/{userId}**
```typescript
// Request
GET /api/users/user-123
Headers: { Authorization: 'Bearer <token>' }

// Response Success
{
  success: true,
  data: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    phone?: string;
    emailVerified: boolean;
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
    provider: 'email' | 'google' | 'facebook';
    favorites: string[];
  }
}

// Response Error
{
  success: false,
  error: {
    code: 'USER_NOT_FOUND' | 'UNAUTHORIZED' | 'NETWORK_ERROR',
    message: string
  }
}
```

**PUT /api/auth/profile** (Ya existe, pero mejorar)
```typescript
// Request
PUT /api/auth/profile
Headers: {
  Authorization: 'Bearer <token>',
  'Content-Type': 'application/json'
}
Body: {
  name?: string;
  phone?: string;
  avatar?: string; // URL o base64
}

// Response
{
  success: true,
  data: User
}
```

#### Códigos de Error:

- `USER_NOT_FOUND` - Usuario no existe
- `UNAUTHORIZED` - Token inválido o expirado
- `FORBIDDEN` - No tienes permisos para acceder
- `VALIDATION_ERROR` - Datos inválidos
- `NETWORK_ERROR` - Error de conexión

#### Riesgos Identificados:

- ⚠️ **Rate Limiting**: No implementado
- ⚠️ **Paginación**: No necesaria para perfil individual
- ⚠️ **Filtros**: No aplicable para perfil
- ⚠️ **Timeouts**: Usar timeout de 10s para requests
- ⚠️ **Caché**: Considerar caché de perfil del usuario actual

---

### **3. PLAN DE INTEGRACIÓN**

#### Flujo de Datos:

```
┌─────────────────┐
│   Componente    │
│  (app/perfil)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   useAuth()     │
│  (AuthContext)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UserService    │ ◄─── NUEVO
│  (user-service) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   apiRequest()  │
│  (helper HTTP)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│  /api/users/*   │
└─────────────────┘
```

#### Configuración del Cliente:

**Decisión Técnica:**
- ✅ Usar `fetch` nativo (ya usado en `AuthService`)
- ✅ Reutilizar helper `apiRequest` de `AuthService` o crear uno genérico
- ❌ NO usar React Query/SWR (no está en stack permitido)
- ✅ Manejo de errores con try/catch y `AuthResponse<T>`

**Estructura:**
```typescript
// lib/users/user-service.ts
export class UserService {
  static async getUserById(userId: string): Promise<AuthResponse<User>>
  static async searchUsers(query: string): Promise<AuthResponse<User[]>>
  static async updateProfile(data: Partial<User>): Promise<AuthResponse<User>>
}
```

#### Esquemas Zod/TS Propuestos:

**Ya existen en `types/auth.ts`:**
- ✅ `User` interface
- ✅ `UpdateProfileData` interface
- ✅ `AuthResponse<T>` interface

**Validación en `lib/auth/validators.ts`:**
- ✅ `updateProfileSchema` (ya existe)

**Nuevos esquemas (si necesario):**
```typescript
// lib/users/validators.ts
import { z } from 'zod';

export const getUserByIdSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
});

export const searchUsersSchema = z.object({
  query: z.string().min(1, 'Búsqueda requerida'),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});
```

#### Errores/Reintento/Estados Vacíos:

**Estrategia de Errores:**
- ✅ Toast notifications con `sonner` (ya implementado)
- ✅ Mensajes de error claros y específicos
- ✅ Logging en consola para debugging
- ✅ Fallback a valores por defecto cuando sea posible

**Reintentos:**
- ❌ NO implementar reintentos automáticos (simplicidad)
- ✅ Mostrar botón "Reintentar" en UI si falla

**Estados Vacíos:**
- ✅ Loading skeleton mientras carga
- ✅ Mensaje "Usuario no encontrado" si `getUserById` falla
- ✅ Redirección a `/login` si token expirado

#### Banderas/Conmutadores:

- ❌ NO usar flags para alternar mock/real (eliminar mock completamente)
- ✅ Eliminar `mock-users-db-stub.ts` después de migrar dependencias

---

### **4. IMPLEMENTACIÓN (TAREAS)**

#### Tareas Concretas:

- [ ] **Crear `lib/users/user-service.ts`**
  - Método `getUserById(userId: string)`
  - Método `searchUsers(query: string, limit?: number, offset?: number)`
  - Reutilizar `apiRequest` helper o crear uno genérico
  - Incluir JWT en headers automáticamente

- [ ] **Actualizar `lib/auth/auth-service.ts`**
  - Verificar que `updateProfile` incluye `phone` en el body
  - Mejorar manejo de errores

- [ ] **Actualizar `lib/auth/auth-context.tsx`**
  - Agregar método `getUserById(userId: string)` al contexto (opcional)
  - O usar `UserService` directamente en componentes

- [ ] **Actualizar `app/perfil/page.tsx`**
  - Verificar que usa `useAuth()` correctamente (ya lo hace)
  - Mejorar manejo de errores
  - Agregar estado de "usuario no encontrado"

- [ ] **Crear hook `hooks/useUser.ts`** (opcional)
  - Hook para obtener usuario por ID
  - Manejo de loading/error states

- [ ] **Actualizar módulos que usan stub:**
  - ⚠️ **NO hacer ahora** - Estos módulos se integrarán después
  - ⚠️ Mantener stub temporalmente para compatibilidad
  - ⚠️ Documentar dependencias en reporte

- [ ] **Eliminar código mock:**
  - ⚠️ **NO eliminar `mock-users-db-stub.ts` todavía** (otros módulos lo usan)
  - ⚠️ Eliminar cuando se integren notifications, favorites, dashboard

- [ ] **Actualizar `lib/constants.ts`**
  - Agregar endpoints de usuarios a `API_ENDPOINTS`

- [ ] **Telemetría/Logging:**
  - Agregar `console.log` para debugging (como en auth-context)
  - Log de requests/responses en desarrollo

---

### **5. LISTA DE VERIFICACIÓN DoD (DEFINITION OF DONE)**

- [ ] ✅ Sin usos de mock en código activo del módulo USUARIOS
  - ⚠️ Stub temporal mantenido para otros módulos (documentado)
- [ ] ✅ Contratos tipados y validados (Zod/TS) con opcionalidad correcta
- [ ] ✅ Estados de UI completos (cargando/vacío/error/éxito)
- [ ] ✅ Errores manejados con mensajes útiles y trazabilidad mínima
- [ ] ❌ Banderas/alternativas para alternar simulado ↔ real (NO necesario)
- [ ] ✅ Documentación `reporte-usuarios.md` generada y clara
- [ ] ✅ Telemetría mínima habilitada (latencia, estado, endpoint)
- [ ] ✅ JWT implementado en Header para rutas protegidas
- [ ] ✅ Tests manuales completados (login, ver perfil, editar perfil)

---

### **6. REPORTE-USUARIOS.MD (CONTENIDO PROPUESTO)**

```markdown
# 📋 REPORTE DE INTEGRACIÓN - MÓDULO USUARIOS

> **Fecha**: 2025-01-XX  
> **Módulo**: Usuarios (USERS)  
> **Estado**: ✅ INTEGRACIÓN COMPLETADA  
> **Tipo**: Integración Frontend-Backend API REST

## 📊 RESUMEN

Se ha completado la integración del módulo de usuarios del frontend con la API REST del backend.
El módulo permite obtener y actualizar información de perfil de usuario.

## 🔍 ENDPOINTS USADOS

### 1. GET /api/auth/me
- Obtener perfil del usuario autenticado
- Autenticación: JWT requerido

### 2. PUT /api/auth/profile
- Actualizar perfil de usuario
- Autenticación: JWT requerido
- Body: { name?, phone?, avatar? }

### 3. GET /api/users/{userId} (Opcional)
- Obtener información de otro usuario
- Autenticación: JWT requerido

## 📝 CAMBIOS EN FRONTEND

### Archivos Creados:
- `lib/users/user-service.ts` - Servicio de API REST para usuarios

### Archivos Actualizados:
- `lib/auth/auth-service.ts` - Mejoras en updateProfile
- `lib/constants.ts` - Agregados endpoints de usuarios
- `app/perfil/page.tsx` - Mejoras en manejo de errores

### Archivos Eliminados:
- ⚠️ `lib/auth/mock-users-db-stub.ts` - **NO eliminado** (otros módulos lo usan)

## 🔧 TIPOS/VALIDACIONES

- `User` interface (types/auth.ts)
- `UpdateProfileData` interface (types/auth.ts)
- `updateProfileSchema` (lib/auth/validators.ts)

## 🚨 ESTRATEGIA DE ERRORES

- Toast notifications para errores
- Redirección a /login si token expirado
- Mensajes de error claros y específicos

## 📊 OBSERVABILIDAD

- Console logs para debugging en desarrollo
- Logs de requests/responses
- Tracking de errores en consola

## ⚠️ RIESGOS Y PRÓXIMOS PASOS

### Dependencias Pendientes:
- `mock-users-db-stub.ts` aún usado por:
  - lib/notifications/*
  - lib/favorites/*
  - lib/dashboard/*
- Eliminar stub cuando se integren esos módulos

### Próximos Pasos:
1. Integrar módulo NOTIFICATIONS
2. Integrar módulo FAVORITES
3. Integrar módulo DASHBOARD
4. Eliminar `mock-users-db-stub.ts` completamente
```

---

## 🚀 SIGUIENTE PASO

**Implementar las tareas del paso 4** siguiendo este plan.


