# 🧪 Test Playwright - Módulo de Notificaciones (Milestone 8)

**Fecha:** 31 de Diciembre, 2024  
**Objetivo:** Verificar el flujo completo de notificaciones usando API REST real  
**Estado:** ⚪ PENDIENTE

---

## 📋 CONFIGURACIÓN

- **URL Base:** `http://localhost:3001`
- **Backend API:** `http://localhost:3000`
- **Flujo:** Gestión de Notificaciones (Ver, Marcar Leída, Marcar Todas, Eliminar)
- **Usuario de Prueba:**
  - Email: `lolo@gmail.com`
  - Password: `Pecholobo33`

---

## 🎯 FLUJOS A PROBAR

### FLUJO 1: Ver Contador de Notificaciones No Leídas

**Pasos:**
1. ✅ Navegar a página de login: `http://localhost:3001/login`
2. ✅ Iniciar sesión con credenciales:
   - Email: `lolo@gmail.com`
   - Password: `Pecholobo33`
3. ✅ Verificar redirección a `/buscar` o página principal
4. ✅ Verificar que el icono de notificaciones (campana) está visible en el header
5. ✅ Verificar que el badge de contador muestra el número de no leídas (si hay)
6. ✅ Verificar en consola: `🔔 [NOTIFICATIONS SERVICE] Obteniendo contador de no leídas`
7. ✅ Verificar petición HTTP: `GET /api/notifications/unread-count` con status 200
8. ✅ Verificar que el response contiene: `{ success: true, data: { unreadCount: number } }`
9. ✅ Verificar que el badge se actualiza correctamente:
   - Si `unreadCount > 0`: Badge visible con número
   - Si `unreadCount = 0`: Badge oculto
   - Si `unreadCount > 99`: Badge muestra "99+"

**Verificaciones de Red:**
- ✅ Request: `GET http://localhost:3000/api/notifications/unread-count`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Response: Status 200, `{ success: true, data: { unreadCount: number } }`

**Selectores:**
- Icono de notificaciones: `button[aria-label*="notificaciones"]` o `button:has(svg)` (icono Bell)
- Badge de contador: `span.absolute.-top-1.-right-1` o `span:has-text(/\d+/)`

---

### FLUJO 2: Abrir Menú de Notificaciones y Ver Lista

**Pasos:**
1. ✅ Navegar a página principal (después de login)
2. ✅ Verificar que el icono de notificaciones está visible
3. ✅ Hacer clic en el icono de notificaciones
4. ✅ Verificar que se abre el dropdown/menú de notificaciones
5. ✅ Verificar que el menú muestra:
   - Título: "Notificaciones"
   - Botón "Marcar todas como leídas" (si hay no leídas)
   - Lista de notificaciones agrupadas por fecha (Hoy, Ayer, Esta semana, Más antiguas)
6. ✅ Verificar en consola: `🔔 [NOTIFICATIONS SERVICE] Obteniendo notificaciones`
7. ✅ Verificar petición HTTP: `GET /api/notifications?page=1&limit=20&read=false` con status 200
8. ✅ Verificar que el response contiene: `{ success: true, data: { notifications: Notification[], total: number, page: number, limit: number } }`
9. ✅ Verificar que cada notificación muestra:
   - Icono según tipo
   - Título
   - Mensaje
   - Timestamp (tiempo relativo)
   - Indicador de no leída (punto azul) si `read: false`
   - Estilo diferenciado (fondo azul claro) si no está leída

**Verificaciones de Red:**
- ✅ Request: `GET http://localhost:3000/api/notifications?page=1&limit=20&read=false`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Query params: `page=1`, `limit=20`, `read=false` (opcional)
- ✅ Response: Status 200, `{ success: true, data: { notifications: Notification[], total: number, page: number, limit: number } }`

**Selectores:**
- Botón de notificaciones: `button:has(svg)` (icono Bell) o `[role="button"]`
- Menú dropdown: `[role="menu"]` o `.dropdown-menu-content`
- Título del menú: `text=Notificaciones`
- Lista de notificaciones: `div:has-text("Hoy")` o `div:has-text("Ayer")`
- Item de notificación: `div.cursor-pointer` o `div:has([class*="bg-blue-50"])`

**Verificaciones Adicionales:**
- ✅ Si no hay notificaciones, mostrar estado vacío:
  - Icono de campana grande
  - Mensaje: "No hay notificaciones"
  - Mensaje secundario: "Te notificaremos cuando haya algo nuevo"
- ✅ Si está cargando, mostrar spinner y mensaje: "Cargando notificaciones..."

---

### FLUJO 3: Marcar Notificación como Leída

**Pasos:**
1. ✅ Abrir menú de notificaciones
2. ✅ Verificar que hay al menos una notificación no leída (fondo azul claro, punto azul)
3. ✅ Hacer clic en una notificación no leída
4. ✅ Verificar que la notificación cambia de estilo:
   - Fondo azul claro desaparece
   - Punto azul desaparece
   - Fondo normal (gris claro al hover)
5. ✅ Verificar que el contador de no leídas disminuye en 1
6. ✅ Verificar en consola: `🔔 [NOTIFICATIONS SERVICE] Marcando como leída: {notificationId}`
7. ✅ Verificar petición HTTP: `PUT /api/notifications/{id}/read` con status 200
8. ✅ Verificar que el response contiene: `{ success: true, data: { notification: Notification } }`
9. ✅ Verificar que la notificación tiene `read: true` en el response
10. ✅ Verificar que se navega a la página correspondiente según el tipo de notificación:
    - `booking_confirmed`, `booking_cancelled`, `booking_reminder` → `/mis-reservas`
    - `favorite_price_drop`, `favorite_available` → `/propiedad/{propertyId}` o `/favoritos`
    - `message_received` → `/dashboard`
    - `security_alert` → `/configuracion`
    - `promotion` → `/buscar`
    - O según `notification.link` si existe

**Verificaciones de Red:**
- ✅ Request: `PUT http://localhost:3000/api/notifications/{id}/read`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Path param: `id` (notificationId)
- ✅ Response: Status 200, `{ success: true, data: { notification: { ...read: true } } }`

**Selectores:**
- Notificación no leída: `div:has([class*="bg-blue-50"])` o `div:has([class*="border-blue-500"])`
- Punto azul: `div.w-2.h-2.rounded-full.bg-blue-500`

**Verificaciones Adicionales:**
- ✅ Si la notificación ya está leída, no hacer petición PUT (optimización)
- ✅ Si falla la petición, revertir el cambio visual (optimistic update)

---

### FLUJO 4: Marcar Todas las Notificaciones como Leídas

**Pasos:**
1. ✅ Abrir menú de notificaciones
2. ✅ Verificar que hay notificaciones no leídas (contador > 0)
3. ✅ Verificar que el botón "Marcar todas como leídas" está visible
4. ✅ Hacer clic en "Marcar todas como leídas"
5. ✅ Verificar que todas las notificaciones cambian de estilo:
   - Fondo azul claro desaparece
   - Puntos azules desaparecen
   - Fondo normal (gris claro al hover)
6. ✅ Verificar que el contador de no leídas se actualiza a 0
7. ✅ Verificar que el badge de contador desaparece
8. ✅ Verificar que el botón "Marcar todas como leídas" desaparece
9. ✅ Verificar en consola: `🔔 [NOTIFICATIONS SERVICE] Marcando todas como leídas`
10. ✅ Verificar petición HTTP: `PUT /api/notifications/mark-all-read` con status 200
11. ✅ Verificar que el response contiene: `{ success: true, data: { count: number } }` o `{ success: true }`

**Verificaciones de Red:**
- ✅ Request: `PUT http://localhost:3000/api/notifications/mark-all-read`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Response: Status 200, `{ success: true, data: { count: number } }` o `{ success: true }`

**Selectores:**
- Botón "Marcar todas como leídas": `button:has-text("Marcar todas como leídas")` o `text=Marcar todas como leídas`

**Verificaciones Adicionales:**
- ✅ Si no hay notificaciones no leídas, el botón no debe estar visible
- ✅ Si falla la petición, mostrar mensaje de error y no cambiar el estado

---

### FLUJO 5: Eliminar Notificación

**Pasos:**
1. ✅ Abrir menú de notificaciones
2. ✅ Verificar que hay notificaciones en la lista
3. ✅ Identificar una notificación para eliminar (por título o contenido)
4. ✅ Buscar botón de eliminar (si existe) o acción de eliminar
5. ✅ Hacer clic en eliminar
6. ✅ Verificar que la notificación desaparece de la lista
7. ✅ Verificar que el contador se actualiza (si la notificación no estaba leída)
8. ✅ Verificar en consola: `🔔 [NOTIFICATIONS SERVICE] Eliminando notificación: {notificationId}`
9. ✅ Verificar petición HTTP: `DELETE /api/notifications/{id}` con status 200 o 204
10. ✅ Verificar que el response contiene: `{ success: true }` o status 204 No Content

**Verificaciones de Red:**
- ✅ Request: `DELETE http://localhost:3000/api/notifications/{id}`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Path param: `id` (notificationId)
- ✅ Response: Status 200 `{ success: true }` o Status 204 No Content

**Selectores:**
- Botón eliminar: `button[aria-label*="eliminar"]` o `button:has(svg[class*="trash"])` (si existe)

**Nota:** Si no hay botón de eliminar visible en el UI, este flujo puede requerir implementación adicional o puede ser una funcionalidad futura.

---

### FLUJO 6: Verificar Estados de Carga y Error

**Pasos:**
1. ✅ Abrir menú de notificaciones
2. ✅ Verificar estado de carga:
   - Spinner visible mientras carga
   - Mensaje: "Cargando notificaciones..."
   - Lista de notificaciones oculta durante carga
3. ✅ Verificar estado vacío:
   - Si no hay notificaciones:
     - Icono de campana grande visible
     - Mensaje: "No hay notificaciones"
     - Mensaje secundario: "Te notificaremos cuando haya algo nuevo"
4. ✅ Verificar estado de error:
   - Simular error de red (desconectar backend o usar DevTools)
   - Verificar que se muestra mensaje de error apropiado
   - Verificar que el menú no se rompe
   - Verificar que se puede reintentar

**Verificaciones de Red:**
- ✅ Durante carga: Petición `GET /api/notifications` en progreso
- ✅ Error 401: Redirigir a login o mostrar mensaje
- ✅ Error 404: Mostrar mensaje apropiado
- ✅ Error de red: Mostrar mensaje y permitir reintento

**Selectores:**
- Spinner: `div.animate-spin` o `div:has([class*="spinner"])`
- Mensaje de carga: `text=Cargando notificaciones...`
- Estado vacío: `text=No hay notificaciones`
- Mensaje de error: `text=Error` o `[role="alert"]`

---

### FLUJO 7: Verificar Agrupación por Fechas

**Pasos:**
1. ✅ Abrir menú de notificaciones
2. ✅ Verificar que las notificaciones están agrupadas por fecha:
   - **Hoy**: Notificaciones del día actual
   - **Ayer**: Notificaciones de ayer
   - **Esta semana**: Notificaciones de los últimos 7 días
   - **Más antiguas**: Notificaciones anteriores a 7 días
3. ✅ Verificar que cada grupo tiene:
   - Título del grupo (Hoy, Ayer, Esta semana, Más antiguas)
   - Separador visual entre grupos
   - Notificaciones ordenadas por fecha (más recientes primero)
4. ✅ Verificar que los grupos solo aparecen si tienen notificaciones

**Selectores:**
- Grupo "Hoy": `text=Hoy` o `div:has-text("Hoy")`
- Grupo "Ayer": `text=Ayer` o `div:has-text("Ayer")`
- Grupo "Esta semana": `text=Esta semana` o `div:has-text("Esta semana")`
- Grupo "Más antiguas": `text=Más antiguas` o `div:has-text("Más antiguas")`
- Separador: `[role="separator"]` o `hr` o `div.border-t`

---

### FLUJO 8: Verificar Navegación desde Notificaciones

**Pasos:**
1. ✅ Abrir menú de notificaciones
2. ✅ Hacer clic en diferentes tipos de notificaciones y verificar navegación:
   - **Reserva confirmada** (`booking_confirmed`):
     - Navega a `/mis-reservas`
     - O según `notification.link` si existe
   - **Reserva cancelada** (`booking_cancelled`):
     - Navega a `/mis-reservas`
   - **Recordatorio de reserva** (`booking_reminder`):
     - Navega a `/mis-reservas`
   - **Precio bajó en favorito** (`favorite_price_drop`):
     - Navega a `/propiedad/{propertyId}` si existe `metadata.propertyId`
     - O a `/favoritos` si no existe
   - **Favorito disponible** (`favorite_available`):
     - Navega a `/propiedad/{propertyId}` si existe `metadata.propertyId`
     - O a `/favoritos` si no existe
   - **Mensaje recibido** (`message_received`):
     - Navega a `/dashboard`
   - **Alerta de seguridad** (`security_alert`):
     - Navega a `/configuracion`
   - **Promoción** (`promotion`):
     - Navega a `/buscar`
3. ✅ Verificar que la notificación se marca como leída al hacer clic
4. ✅ Verificar que la navegación funciona correctamente

**Verificaciones de Red:**
- ✅ Petición `PUT /api/notifications/{id}/read` antes de navegar
- ✅ Navegación a la URL correcta según tipo

---

## 🔍 VERIFICACIONES DE RED DETALLADAS

### Endpoint 1: GET /api/notifications

**Request:**
```
GET http://localhost:3000/api/notifications?page=1&limit=20&read=false
Headers:
  Authorization: Bearer {token}
```

**Response Esperado (200 OK):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notification-id-1",
        "userId": "user-id",
        "type": "booking_confirmed",
        "title": "Reserva confirmada",
        "message": "Tu reserva ha sido confirmada",
        "read": false,
        "createdAt": "2024-12-31T12:00:00.000Z",
        "link": "/mis-reservas",
        "metadata": {
          "bookingId": "booking-id",
          "propertyId": "property-id"
        }
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

**Errores Esperados:**
- 401 Unauthorized: Token inválido o expirado
- 429 Too Many Requests: Demasiadas peticiones

---

### Endpoint 2: GET /api/notifications/unread-count

**Request:**
```
GET http://localhost:3000/api/notifications/unread-count
Headers:
  Authorization: Bearer {token}
```

**Response Esperado (200 OK):**
```json
{
  "success": true,
  "data": {
    "unreadCount": 3
  }
}
```

**Errores Esperados:**
- 401 Unauthorized: Token inválido o expirado
- 429 Too Many Requests: Demasiadas peticiones

---

### Endpoint 3: PUT /api/notifications/:id/read

**Request:**
```
PUT http://localhost:3000/api/notifications/{id}/read
Headers:
  Authorization: Bearer {token}
```

**Response Esperado (200 OK):**
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "notification-id",
      "userId": "user-id",
      "type": "booking_confirmed",
      "title": "Reserva confirmada",
      "message": "Tu reserva ha sido confirmada",
      "read": true,
      "createdAt": "2024-12-31T12:00:00.000Z",
      "link": "/mis-reservas"
    }
  }
}
```

**Errores Esperados:**
- 401 Unauthorized: Token inválido o expirado
- 404 Not Found: Notificación no encontrada
- 429 Too Many Requests: Demasiadas peticiones

---

### Endpoint 4: PUT /api/notifications/mark-all-read

**Request:**
```
PUT http://localhost:3000/api/notifications/mark-all-read
Headers:
  Authorization: Bearer {token}
```

**Response Esperado (200 OK):**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

O simplemente:
```json
{
  "success": true
}
```

**Errores Esperados:**
- 401 Unauthorized: Token inválido o expirado
- 429 Too Many Requests: Demasiadas peticiones

---

### Endpoint 5: DELETE /api/notifications/:id

**Request:**
```
DELETE http://localhost:3000/api/notifications/{id}
Headers:
  Authorization: Bearer {token}
```

**Response Esperado (200 OK):**
```json
{
  "success": true
}
```

O Status 204 No Content (sin body).

**Errores Esperados:**
- 401 Unauthorized: Token inválido o expirado
- 404 Not Found: Notificación no encontrada
- 429 Too Many Requests: Demasiadas peticiones

---

## ✅ CHECKLIST DE VALIDACIÓN

### Funcionalidad Básica
- [ ] Contador de no leídas se muestra correctamente
- [ ] Menú de notificaciones se abre correctamente
- [ ] Lista de notificaciones se carga correctamente
- [ ] Marcar como leída funciona correctamente
- [ ] Marcar todas como leídas funciona correctamente
- [ ] Eliminar notificación funciona correctamente (si está implementado)
- [ ] Navegación desde notificaciones funciona correctamente

### Manejo de Errores
- [ ] Error 401 (Unauthorized) - Redirigir a login o mostrar mensaje
- [ ] Error 404 (Not Found) - Mostrar mensaje apropiado
- [ ] Error de red - Mostrar mensaje y permitir reintento
- [ ] Optimistic updates se revierten si falla la petición

### Estados Visuales
- [ ] Loading state mientras carga notificaciones
- [ ] Loading state mientras procesa acción
- [ ] Empty state cuando no hay notificaciones
- [ ] Error state cuando falla la carga
- [ ] Badge con contador de no leídas visible y actualizado
- [ ] Agrupación por fechas correcta

### Consola y Red
- [ ] Sin errores de consola (console.error)
- [ ] Sin advertencias de React (hydration)
- [ ] Todas las peticiones HTTP tienen status 2xx (excepto errores esperados)
- [ ] Headers de autenticación presentes en todas las peticiones
- [ ] Logs de debugging presentes y claros

---

## 📝 REPORTE DE PRUEBAS

### Resultados Esperados

Después de ejecutar todas las pruebas, se debe generar un reporte con:

1. **Resumen de Pruebas:**
   - Total de pruebas ejecutadas
   - Pruebas exitosas
   - Pruebas fallidas
   - Tasa de éxito

2. **Problemas Encontrados:**
   - Errores de consola
   - Errores de red (4xx, 5xx)
   - Problemas de UI/UX
   - Problemas de funcionalidad

3. **Recomendaciones:**
   - Mejoras sugeridas
   - Bugs a corregir
   - Optimizaciones posibles

---

## 🚀 ORDEN DE EJECUCIÓN

1. **FLUJO 1** - Ver Contador de Notificaciones No Leídas
2. **FLUJO 2** - Abrir Menú de Notificaciones y Ver Lista
3. **FLUJO 3** - Marcar Notificación como Leída
4. **FLUJO 4** - Marcar Todas las Notificaciones como Leídas
5. **FLUJO 5** - Eliminar Notificación (si está implementado)
6. **FLUJO 6** - Verificar Estados de Carga y Error
7. **FLUJO 7** - Verificar Agrupación por Fechas
8. **FLUJO 8** - Verificar Navegación desde Notificaciones

---

## 📚 REFERENCIAS

### Archivos del Frontend
- `lib/notifications/notifications-service.ts` - Servicio API (a crear)
- `hooks/useNotifications.ts` - Hook personalizado
- `components/notifications/NotificationsMenu.tsx` - Menú de notificaciones
- `components/notifications/NotificationItem.tsx` - Item individual
- `components/notifications/NotificationIcon.tsx` - Icono según tipo
- `types/notifications.ts` - Tipos TypeScript

### Documentación Backend
- `docs/API_Rest_documentation.json` (líneas 2321-2532)
- Endpoints esperados:
  - GET /api/notifications?page={page}&limit={limit}&read={read}
  - GET /api/notifications/unread-count
  - PUT /api/notifications/:id/read
  - PUT /api/notifications/mark-all-read
  - DELETE /api/notifications/:id

---

**Última actualización:** 31 de Diciembre, 2024  
**Estado:** ⚪ PENDIENTE DE EJECUCIÓN

