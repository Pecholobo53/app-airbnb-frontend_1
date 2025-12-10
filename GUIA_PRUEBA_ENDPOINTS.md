# 🔧 GUÍA PARA PROBAR ENDPOINTS DESDE LA CONSOLA

## 🚀 SCRIPT RÁPIDO PARA PROBAR ACTUALIZAR PERFIL

**Copia y pega esto completo en la consola del navegador (F12):**

```javascript
(async function() {
  console.log('🚀 Probando actualización de perfil...');
  
  // Verificar sesión
  const session = localStorage.getItem('airbnb_mock_session');
  if (!session) {
    console.error('❌ NO HAY SESIÓN - Ve a /login primero');
    return;
  }
  
  const parsed = JSON.parse(session);
  const token = parsed.accessToken;
  
  if (!token) {
    console.error('❌ NO HAY TOKEN');
    return;
  }
  
  console.log('✅ Token encontrado');
  
  // Datos para actualizar
  const updateData = {
    name: 'Nombre Prueba ' + Date.now(),
    phone: '+34 600 000 000'
  };
  
  console.log('📤 Enviando:', updateData);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    console.log('📥 Status:', response.status);
    console.log('📦 Response:', data);
    
    if (response.ok && data.success) {
      console.log('✅ ¡ÉXITO! Perfil actualizado');
    } else {
      console.error('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error de red:', error);
  }
})();
```

**O usa el script completo del archivo `SCRIPT_PRUEBA_PERFIL.js`**

---

## 📋 Pasos para Probar los Endpoints

### 1. **Verificar que tienes sesión activa**

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Verificar sesión
const session = localStorage.getItem('airbnb_mock_session');
if (!session) {
  console.log('❌ NO HAY SESIÓN - Ve a /login e inicia sesión primero');
} else {
  const parsed = JSON.parse(session);
  console.log('✅ Sesión encontrada');
  console.log('Token:', parsed.accessToken ? 'Presente ✅' : 'FALTANTE ❌');
  console.log('Usuario:', parsed.user?.name);
  console.log('Expira:', parsed.expiresAt ? new Date(parsed.expiresAt).toLocaleString('es-ES') : 'No disponible');
}
```

### 2. **Usar la función de debug (Recomendado)**

Si estás en una página que carga el módulo, puedes usar:

```javascript
// Importar el servicio (si estás en un módulo)
import { UserService } from '@/lib/users/user-service';

// O usar directamente desde la consola del navegador
// Primero verifica el token:
UserService.debugGetToken();
```

### 3. **Probar GET /api/auth/me (Perfil del usuario autenticado)**

```javascript
// Obtener token
const session = localStorage.getItem('airbnb_mock_session');
const token = JSON.parse(session).accessToken;

// Probar endpoint
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('Response:', data);
  if (data.success) {
    console.log('✅ Usuario:', data.data.name);
  } else {
    console.error('❌ Error:', data.error);
  }
})
.catch(err => console.error('Error:', err));
```

### 4. **Probar GET /api/users/{userId} (Obtener usuario por ID)**

```javascript
// Obtener token
const session = localStorage.getItem('airbnb_mock_session');
const token = JSON.parse(session).accessToken;

// Reemplaza 'user-123' con un ID real de usuario
const userId = 'user-123';

fetch(`http://localhost:3000/api/users/${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('Response:', data);
  if (data.success) {
    console.log('✅ Usuario encontrado:', data.data.name);
  } else {
    console.error('❌ Error:', data.error);
  }
})
.catch(err => console.error('Error:', err));
```

### 5. **Probar GET /api/users?search=... (Buscar usuarios)**

```javascript
// Obtener token
const session = localStorage.getItem('airbnb_mock_session');
const token = JSON.parse(session).accessToken;

// Buscar usuarios
const query = 'juan';
const limit = 10;
const offset = 0;

fetch(`http://localhost:3000/api/users?search=${query}&limit=${limit}&offset=${offset}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('Response:', data);
  if (data.success) {
    console.log('✅ Usuarios encontrados:', data.data.users.length);
    console.log('Total:', data.data.total);
    data.data.users.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
  } else {
    console.error('❌ Error:', data.error);
  }
})
.catch(err => console.error('Error:', err));
```

### 6. **Probar PUT /api/auth/profile (Actualizar perfil)**

```javascript
// Obtener token
const session = localStorage.getItem('airbnb_mock_session');
const token = JSON.parse(session).accessToken;

// Actualizar perfil
fetch('http://localhost:3000/api/auth/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Nuevo Nombre',
    phone: '+34 600 000 000'
  })
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('Response:', data);
  if (data.success) {
    console.log('✅ Perfil actualizado:', data.data.name);
  } else {
    console.error('❌ Error:', data.error);
  }
})
.catch(err => console.error('Error:', err));
```

## 🔍 Interpretar los Logs en la Consola

Cuando uses los servicios, verás logs como estos:

### ✅ Logs de Éxito:
```
🔑 [USER SERVICE] Sesión en localStorage: Encontrada
🔑 [USER SERVICE] Token extraído: eyJhbGciOiJIUzI1NiIsInR5cCI...
✅ [USER SERVICE] Header Authorization agregado
📤 [USER SERVICE] Enviando request a: http://localhost:3000/api/users/user-123
📥 [USER SERVICE] Response status: 200
✅ [USER SERVICE] Request exitoso
```

### ❌ Logs de Error (Sin Token):
```
🔑 [USER SERVICE] Sesión en localStorage: No encontrada
⚠️ [USER SERVICE] NO HAY TOKEN - Request sin autenticación
📥 [USER SERVICE] Response status: 401
❌ [USER SERVICE] Error en response: { status: 401, error: "Unauthorized" }
```

### ❌ Logs de Error (Token Inválido):
```
🔑 [USER SERVICE] Sesión en localStorage: Encontrada
🔑 [USER SERVICE] Token extraído: token-invalido...
✅ [USER SERVICE] Header Authorization agregado
📥 [USER SERVICE] Response status: 401
❌ [USER SERVICE] Error en response: { status: 401, error: "Token inválido o expirado" }
```

## 🚨 Solución de Problemas

### Error 401: Unauthorized

**Causas posibles:**
1. **No hay sesión**: No has iniciado sesión
   - **Solución**: Ve a `/login` e inicia sesión

2. **Token expirado**: La sesión expiró
   - **Solución**: Cierra sesión y vuelve a iniciar sesión

3. **Token inválido**: El token no es válido para el backend
   - **Solución**: Verifica que el backend esté corriendo y acepte el formato del token

4. **Token no se envía**: El token no se está incluyendo en el header
   - **Solución**: Revisa los logs en la consola para ver si dice "NO HAY TOKEN"

### Verificar el Token Manualmente

```javascript
// Ver estructura completa de la sesión
const session = localStorage.getItem('airbnb_mock_session');
if (session) {
  const parsed = JSON.parse(session);
  console.log('Estructura completa:', parsed);
  console.log('Tiene accessToken?', !!parsed.accessToken);
  console.log('Token completo:', parsed.accessToken);
}
```

## 📝 Notas Importantes

- **Siempre inicia sesión primero** antes de probar los endpoints
- **Los endpoints requieren autenticación** (excepto algunos públicos)
- **El token se obtiene automáticamente** del localStorage cuando usas los servicios
- **Los logs te ayudarán a diagnosticar** qué está pasando

## 🎯 Rutas para Probar Visualmente

1. **`/perfil`** - Prueba automáticamente:
   - `GET /api/auth/me` (al cargar)
   - `PUT /api/auth/profile` (al editar y guardar)

2. **Consola del navegador** - Para probar manualmente:
   - `GET /api/users/{userId}`
   - `GET /api/users?search=...`

