# 🧪 Test Playwright - Módulo de Favoritos (Milestone 7)

**Fecha:** 31 de Diciembre, 2024  
**Objetivo:** Verificar el flujo completo de favoritos usando API REST real  
**Estado:** ⚪ PENDIENTE

---

## 📋 CONFIGURACIÓN

- **URL Base:** `http://localhost:3001`
- **Backend API:** `http://localhost:3000`
- **Flujo:** Gestión de Favoritos (Añadir, Verificar, Listar, Eliminar)
- **Usuario de Prueba:**
  - Email: `lolo@gmail.com`
  - Password: `Pecholobo33`

---

## 🎯 FLUJOS A PROBAR

### FLUJO 1: Añadir Propiedad a Favoritos

**Pasos:**
1. ✅ Navegar a página de login: `http://localhost:3001/login`
2. ✅ Iniciar sesión con credenciales:
   - Email: `lolo@gmail.com`
   - Password: `Pecholobo33`
3. ✅ Verificar redirección a `/buscar` o página principal
4. ✅ Navegar a página de detalle de propiedad: `/propiedad/{propertyId}`
5. ✅ Verificar que el botón de favorito está visible
6. ✅ Hacer clic en el botón de favorito (corazón)
7. ✅ Verificar que el botón cambia a estado "favorito" (corazón lleno)
8. ✅ Verificar toast de éxito: "Propiedad añadida a favoritos"
9. ✅ Verificar en consola: `✅ [FAVORITES SERVICE] Favorito añadido`
10. ✅ Verificar petición HTTP: `POST /api/favorites` con status 201
11. ✅ Verificar que el body contiene: `{ propertyId: "..." }`
12. ✅ Verificar que el response contiene: `{ success: true, data: { favorite: {...} } }`

**Verificaciones de Red:**
- ✅ Request: `POST http://localhost:3000/api/favorites`
- ✅ Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- ✅ Body: `{ "propertyId": "..." }`
- ✅ Response: Status 201, `{ success: true, data: { favorite: { id, userId, propertyId, addedAt } } }`

---

### FLUJO 2: Verificar Estado de Favorito

**Pasos:**
1. ✅ Navegar a página de detalle de propiedad que ya está en favoritos
2. ✅ Verificar que el botón de favorito muestra estado "favorito" (corazón lleno)
3. ✅ Verificar en consola: `❤️ [FAVORITES SERVICE] Verificando si es favorito`
4. ✅ Verificar petición HTTP: `GET /api/favorites/{propertyId}` con status 200
5. ✅ Verificar que el response contiene: `{ success: true, data: { favorite: {...} } }`

**Verificaciones de Red:**
- ✅ Request: `GET http://localhost:3000/api/favorites/{propertyId}`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Response: Status 200 (si existe) o 404 (si no existe)

---

### FLUJO 3: Ver Lista de Favoritos

**Pasos:**
1. ✅ Navegar a página de favoritos: `http://localhost:3001/favoritos`
2. ✅ Verificar que la página carga correctamente
3. ✅ Verificar título: "Mis Favoritos"
4. ✅ Verificar que se muestran las propiedades favoritas
5. ✅ Verificar en consola: `❤️ [FAVORITES SERVICE] Obteniendo propiedades favoritas completas`
6. ✅ Verificar petición HTTP: `GET /api/favorites?page=1&limit=20` con status 200
7. ✅ Verificar que el response contiene: `{ success: true, data: { favorites: [...] } }`
8. ✅ Verificar que cada propiedad muestra:
   - Imagen
   - Título
   - Ubicación
   - Precio
   - Botón de favorito (debe estar marcado)

**Verificaciones de Red:**
- ✅ Request: `GET http://localhost:3000/api/favorites?page=1&limit=20`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Response: Status 200, `{ success: true, data: { favorites: Favorite[] } }`

**Verificaciones Adicionales:**
- ✅ Si no hay favoritos, mostrar estado vacío con mensaje: "No tienes favoritos aún"
- ✅ Botón "Explorar propiedades" visible y funcional

---

### FLUJO 4: Eliminar Propiedad de Favoritos

**Pasos:**
1. ✅ Navegar a página de detalle de propiedad que está en favoritos
2. ✅ Verificar que el botón de favorito muestra estado "favorito" (corazón lleno)
3. ✅ Hacer clic en el botón de favorito
4. ✅ Verificar que el botón cambia a estado "no favorito" (corazón vacío)
5. ✅ Verificar toast de éxito: "Propiedad eliminada de favoritos"
6. ✅ Verificar en consola: `✅ [FAVORITES SERVICE] Favorito eliminado`
7. ✅ Verificar petición HTTP: `DELETE /api/favorites/{propertyId}` con status 200 o 204
8. ✅ Navegar a `/favoritos` y verificar que la propiedad ya no aparece en la lista

**Verificaciones de Red:**
- ✅ Request: `DELETE http://localhost:3000/api/favorites/{propertyId}`
- ✅ Headers: `Authorization: Bearer {token}`
- ✅ Response: Status 200 o 204 No Content

---

### FLUJO 5: Manejo de Errores

**5.1. Error 401 (Unauthorized) - Token Expirado**

**Pasos:**
1. ✅ Simular token expirado (eliminar token de sessionStorage)
2. ✅ Intentar añadir favorito
3. ✅ Verificar toast de error: "Tu sesión expiró. Por favor, inicia sesión de nuevo."
4. ✅ Verificar redirección a `/login` (opcional, según implementación)

**5.2. Error 409 (Conflict) - Ya está en Favoritos**

**Pasos:**
1. ✅ Intentar añadir favorito que ya existe
2. ✅ Verificar toast de error: "La propiedad ya está en favoritos."
3. ✅ Verificar que el estado del botón se actualiza correctamente

**5.3. Error 404 (Not Found) - Propiedad No Existe**

**Pasos:**
1. ✅ Intentar añadir favorito con propertyId inválido
2. ✅ Verificar toast de error apropiado
3. ✅ Verificar que el estado no cambia

**5.4. Error de Red**

**Pasos:**
1. ✅ Simular error de red (desconectar backend)
2. ✅ Intentar añadir/eliminar favorito
3. ✅ Verificar toast de error: "Error de conexión"
4. ✅ Verificar que el estado se revierte (optimistic update)

---

## 🔍 VERIFICACIONES DE CONSOLA

### Logs Esperados (Sin Errores)

**Al añadir favorito:**
```
❤️ [FAVORITES SERVICE] Añadiendo favorito: {propertyId}
📡 [FAVORITES SERVICE] POST http://localhost:3000/api/favorites
✅ [FAVORITES SERVICE] Favorito añadido: {favoriteId}
```

**Al verificar favorito:**
```
❤️ [FAVORITES SERVICE] Verificando si es favorito: {propertyId}
📡 [FAVORITES SERVICE] GET http://localhost:3000/api/favorites/{propertyId}
```

**Al obtener favoritos:**
```
❤️ [FAVORITES SERVICE] Obteniendo propiedades favoritas completas
❤️ [FAVORITES SERVICE] Obteniendo favoritos { page: 1, limit: 20 }
📡 [FAVORITES SERVICE] GET http://localhost:3000/api/favorites?page=1&limit=20
✅ [FAVORITES SERVICE] Encontrados {count} favoritos
✅ [FAVORITES SERVICE] Cargadas {count} propiedades favoritas
```

**Al eliminar favorito:**
```
❤️ [FAVORITES SERVICE] Eliminando favorito: {propertyId}
📡 [FAVORITES SERVICE] DELETE http://localhost:3000/api/favorites/{propertyId}
✅ [FAVORITES SERVICE] Favorito eliminado
```

### Errores a Detectar

- ❌ `❌ [FAVORITES SERVICE] Error en ...` (errores de red o API)
- ❌ `⚠️ [FAVORITES SERVICE] ...` (advertencias)
- ❌ Errores de React (hydration, setState después de unmount)
- ❌ Errores de consola del navegador (JavaScript)

---

## 📊 VERIFICACIONES DE RED

### Endpoints a Verificar

1. **POST /api/favorites**
   - ✅ Status: 201 Created
   - ✅ Body Request: `{ propertyId: string }`
   - ✅ Body Response: `{ success: true, data: { favorite: Favorite } }`
   - ✅ Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`

2. **GET /api/favorites?page={page}&limit={limit}**
   - ✅ Status: 200 OK
   - ✅ Body Response: `{ success: true, data: { favorites: Favorite[] } }`
   - ✅ Headers: `Authorization: Bearer {token}`

3. **GET /api/favorites/:propertyId**
   - ✅ Status: 200 OK (si existe) o 404 Not Found (si no existe)
   - ✅ Body Response: `{ success: true, data: { favorite: Favorite } }` o error 404
   - ✅ Headers: `Authorization: Bearer {token}`

4. **DELETE /api/favorites/:propertyId**
   - ✅ Status: 200 OK o 204 No Content
   - ✅ Body Response: `{ success: true }` o sin body (204)
   - ✅ Headers: `Authorization: Bearer {token}`

### Errores HTTP a Verificar

- ❌ 401 Unauthorized - Token inválido o expirado
- ❌ 403 Forbidden - Sin permisos
- ❌ 404 Not Found - Recurso no encontrado
- ❌ 409 Conflict - Ya está en favoritos
- ❌ 422 Validation Error - Datos inválidos
- ❌ 429 Too Many Requests - Rate limit
- ❌ 500 Server Error - Error del servidor

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Funcionalidad Básica
- [ ] Añadir favorito funciona correctamente
- [ ] Eliminar favorito funciona correctamente
- [ ] Ver lista de favoritos funciona correctamente
- [ ] Verificar estado de favorito funciona correctamente
- [ ] Persistencia entre recargas de página

### Manejo de Errores
- [ ] Error 401 redirige a login o muestra mensaje apropiado
- [ ] Error 409 muestra mensaje "Ya está en favoritos"
- [ ] Error 404 muestra mensaje apropiado
- [ ] Error de red muestra mensaje y permite reintento
- [ ] Optimistic updates se revierten si falla la petición

### Estados Visuales
- [ ] Loading state mientras verifica estado inicial
- [ ] Loading state mientras procesa acción
- [ ] Empty state cuando no hay favoritos
- [ ] Error state cuando falla la carga
- [ ] Feedback visual al añadir/eliminar (toast + animación)

### Consola y Red
- [ ] Sin errores de consola (console.error)
- [ ] Sin advertencias de React (hydration)
- [ ] Todas las peticiones HTTP tienen status 2xx (excepto errores esperados)
- [ ] Headers de autenticación presentes en todas las peticiones
- [ ] Logs de debugging presentes y claros

---

## 📝 REPORTE DE RESULTADOS

### Resumen Ejecutivo

**Estado:** ⚠️ IMPLEMENTACIÓN COMPLETA CON PROBLEMAS POTENCIALES  
**Fecha de Análisis:** 31 de Diciembre, 2024  
**Método:** Análisis de Código + Documentación API  
**Entorno:** Desarrollo (localhost:3001)  
**Backend:** Desarrollo (localhost:3000)

### Cobertura

- **Código Analizado:** 100%
- **Endpoints Verificados:** 4/4
- **Problemas Detectados:** 8
- **Problemas Críticos:** 2
- **Implementaciones Recomendadas:** 7

### Hallazgos

| ID | Severidad | Tipo | Descripción | Pasos de Reproducción | Impacto |
|----|-----------|------|-------------|----------------------|---------|
| PROBLEMA-001 | 🔴 ALTA | Compatibilidad API | Estructura de respuesta del backend no validada correctamente | Ver `REPORTE_TEST_PLAYWRIGHT_FAVORITOS.md` | La página de favoritos puede no mostrar favoritos correctamente |
| PROBLEMA-002 | 🟡 MEDIA | Lógica | Falta caché local para `isFavorited` | Múltiples `FavoriteButton` en la misma página hacen múltiples llamadas | Puede causar rate limiting (429) |
| PROBLEMA-003 | 🟡 MEDIA | UX/Estado | Falta sincronización entre componentes | Añadir favorito desde un botón no actualiza otros botones | UX inconsistente |
| PROBLEMA-004 | 🟡 MEDIA | UX | Falta actualización automática en página de favoritos | Añadir favorito desde otra página no actualiza `/favoritos` | Requiere recarga manual |
| PROBLEMA-005 | 🟢 BAJA | Manejo de Errores | Falta manejo de error en verificación inicial | Error de red en `isFavorited` no se muestra al usuario | Impacto mínimo |
| PROBLEMA-006 | 🟢 BAJA | Resiliencia | Falta retry logic para errores de red | Error de red temporal requiere reintento manual | Impacto mínimo |
| PROBLEMA-007 | 🟢 BAJA | Funcionalidad | Falta paginación en página de favoritos | No se pueden ver más de 20 favoritos | Solo afecta si hay >20 favoritos |
| PROBLEMA-008 | 🟢 BAJA | Lógica | Manejo de 404 en `isFavorited` puede ser ambiguo | Si backend retorna 404 por propiedad inexistente, retorna false | Impacto mínimo |

### Recomendaciones

**Inmediatas (≤24h):**
1. ✅ Implementar validación robusta de estructura de respuesta en `getFavorites()`
2. ✅ Implementar sincronización entre componentes usando eventos personalizados
3. ✅ Mejorar manejo de errores en verificación inicial de `FavoriteButton`

**Medio Plazo (≤2 sprints):**
4. ✅ Implementar caché local para `isFavorited` en `FavoriteButton`
5. ✅ Implementar actualización automática en página de favoritos
6. ✅ Agregar tests unitarios para el servicio

**Largo Plazo:**
7. ✅ Implementar retry logic con exponential backoff
8. ✅ Implementar paginación o scroll infinito en página de favoritos
9. ✅ Agregar tests E2E completos con Playwright MCP

**Ver reporte detallado:** `REPORTE_TEST_PLAYWRIGHT_FAVORITOS.md`

---

## 🚀 INSTRUCCIONES DE EJECUCIÓN

1. **Preparar entorno:**
   ```bash
   # Asegurar que el backend está corriendo en localhost:3000
   # Asegurar que el frontend está corriendo en localhost:3001
   ```

2. **Ejecutar test con Playwright MCP:**
   - Usar las credenciales: `lolo@gmail.com` / `Pecholobo33`
   - Seguir los flujos en orden
   - Capturar screenshots y logs en cada paso

3. **Verificar resultados:**
   - Revisar consola del navegador
   - Revisar Network tab en DevTools
   - Verificar que todas las peticiones tienen status 2xx
   - Verificar que no hay errores de consola

4. **Generar reporte:**
   - Documentar todos los hallazgos
   - Incluir screenshots de errores
   - Incluir logs de consola y red
   - Actualizar este documento con resultados

---

**Última actualización:** 31 de Diciembre, 2024  
**Estado:** ⚠️ ANÁLISIS COMPLETADO - Ver `REPORTE_TEST_PLAYWRIGHT_FAVORITOS.md` para detalles

