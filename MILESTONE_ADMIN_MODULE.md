# 🎯 MILESTONE: Módulo de Administración (/admin)

**Fecha de Inicio:** 25 de Diciembre, 2025  
**Estado:** 🚧 EN PROGRESO  
**Criterios:** @.cursor/rules/milestone-rules.mdc

---

## 📋 OBJETIVO

Implementar un módulo completo de administración (`/admin`) exclusivo para administradores que permita gestionar usuarios utilizando todas las funcionalidades disponibles en el backend.

---

## ✅ CHECKLIST DE TAREAS

### FASE 1: Configuración y Protección

- [x] **Tarea 1.1:** Crear milestone y plan de implementación
- [ ] **Tarea 1.2:** Verificar y agregar campo `role` o `isAdmin` en tipos `User` si es necesario
- [ ] **Tarea 1.3:** Crear componente `AdminGuard` para proteger rutas de admin
- [ ] **Tarea 1.4:** Agregar ruta `/admin` en `lib/constants.ts`

### FASE 2: Estructura del Módulo

- [ ] **Tarea 2.1:** Crear carpeta `/app/admin` con layout
- [ ] **Tarea 2.2:** Crear layout de admin con sidebar de navegación
- [ ] **Tarea 2.3:** Crear página principal `/admin` (dashboard de admin)

### FASE 3: Gestión de Usuarios

- [ ] **Tarea 3.1:** Crear página `/admin/users` - Lista de usuarios
  - [ ] Implementar tabla de usuarios con paginación
  - [ ] Implementar búsqueda de usuarios
  - [ ] Implementar filtros (opcional)
  - [ ] Mostrar acciones: Ver, Editar, Eliminar

- [ ] **Tarea 3.2:** Crear página `/admin/users/[id]` - Detalles de usuario
  - [ ] Mostrar información completa del usuario
  - [ ] Formulario de edición inline
  - [ ] Botón para eliminar usuario

- [ ] **Tarea 3.3:** Crear componente `UserForm` reutilizable
  - [ ] Formulario para crear nuevo usuario
  - [ ] Formulario para editar usuario existente
  - [ ] Validación con Zod
  - [ ] Manejo de errores

- [ ] **Tarea 3.4:** Crear componente `UserTable` para lista de usuarios
  - [ ] Tabla responsive
  - [ ] Paginación
  - [ ] Búsqueda integrada
  - [ ] Acciones por fila

- [ ] **Tarea 3.5:** Implementar funcionalidad de eliminar usuario
  - [ ] Diálogo de confirmación
  - [ ] Llamada a `UserService.deleteUser()`
  - [ ] Actualizar lista después de eliminar
  - [ ] Notificación de éxito/error

### FASE 4: Integración con Backend

- [ ] **Tarea 4.1:** Verificar y corregir `getUserById` para manejar estructura anidada
- [ ] **Tarea 4.2:** Verificar y corregir `updateUser` (usar PATCH si PUT falla)
- [ ] **Tarea 4.3:** Agregar método `createUser` en `UserService` si el backend lo soporta
- [ ] **Tarea 4.4:** Manejar errores específicos del backend (400, 401, 403, 404)

### FASE 5: UI/UX

- [ ] **Tarea 5.1:** Diseñar sidebar de navegación admin
- [ ] **Tarea 5.2:** Agregar estados de loading en todas las operaciones
- [ ] **Tarea 5.3:** Agregar mensajes de error claros
- [ ] **Tarea 5.4:** Hacer responsive todas las páginas admin
- [ ] **Tarea 5.5:** Agregar iconos con Lucide React

### FASE 6: Testing con Playwright

- [ ] **Tarea 6.1:** Probar login como admin
- [ ] **Tarea 6.2:** Probar acceso a `/admin` (debe redirigir si no es admin)
- [ ] **Tarea 6.3:** Probar lista de usuarios
- [ ] **Tarea 6.4:** Probar búsqueda de usuarios
- [ ] **Tarea 6.5:** Probar ver detalles de usuario
- [ ] **Tarea 6.6:** Probar editar usuario (PUT/PATCH)
- [ ] **Tarea 6.7:** Probar eliminar usuario
- [ ] **Tarea 6.8:** Probar crear usuario (si está disponible)
- [ ] **Tarea 6.9:** Generar reporte completo de pruebas

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
/app
  /admin
    /layout.tsx              # Layout con sidebar de admin
    /page.tsx                # Dashboard principal de admin
    /users
      /page.tsx              # Lista de usuarios
      /[id]
        /page.tsx            # Detalles y edición de usuario

/components
  /admin
    /AdminGuard.tsx          # Guard para proteger rutas admin
    /AdminSidebar.tsx        # Sidebar de navegación
    /UserTable.tsx           # Tabla de usuarios
    /UserForm.tsx            # Formulario crear/editar usuario
    /DeleteUserDialog.tsx    # Diálogo de confirmación

/lib
  /users
    /user-service.ts         # Ya existe, verificar métodos
```

---

## 🔧 FUNCIONALIDADES A IMPLEMENTAR

### 1. Lista de Usuarios (`/admin/users`)
- ✅ Listar usuarios con paginación
- ✅ Búsqueda de usuarios
- ✅ Ver detalles de usuario
- ✅ Editar usuario
- ✅ Eliminar usuario

### 2. Detalles de Usuario (`/admin/users/[id]`)
- ✅ Ver información completa
- ✅ Editar información
- ✅ Eliminar usuario

### 3. Protección de Rutas
- ✅ Verificar que solo admins puedan acceder
- ✅ Redirigir a `/dashboard` si no es admin
- ✅ Mostrar mensaje de error si intenta acceder sin permisos

---

## 🧪 TESTING

Seguir las reglas de `@.cursor/rules/playwrigth-test.mdc`:

### Datos de Prueba:
- **Admin:** juan@example.com / Password123
- **Usuario Regular:** armando@yahoo.es / Pecholobo33,,

### Flujos a Probar:
1. Login como admin → Acceso a `/admin`
2. Login como usuario regular → Intentar acceder a `/admin` (debe redirigir)
3. Lista de usuarios → Verificar paginación
4. Búsqueda de usuarios → Verificar resultados
5. Ver detalles de usuario → Verificar información
6. Editar usuario → Verificar actualización
7. Eliminar usuario → Verificar eliminación

---

## 📝 NOTAS

- El backend ya tiene implementados los endpoints de usuarios
- Usar `UserService` existente para todas las operaciones
- Manejar errores gracefully (no romper la UI)
- Seguir el patrón de diseño existente (Tailwind, Radix UI)
- Mantener código simple y reutilizable

---

**Siguiente paso:** Comenzar con FASE 1 - Configuración y Protección

