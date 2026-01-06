# 🔄 Solución: Problema al Cambiar Entre Diferentes Perfiles

## ❌ Problema Identificado

El sistema no permitía cambiar entre diferentes perfiles de usuario porque:
1. El logout no limpiaba explícitamente el `localStorage`
2. El login no limpiaba sesiones anteriores antes de crear una nueva
3. Había conflictos entre el estado de React y el `localStorage`

## ✅ Solución Implementada

### 1. **Logout Mejorado** (`lib/auth/auth-context.tsx`)

**Antes:**
```typescript
const logout = useCallback(async () => {
  try {
    await AuthService.logout();
    setSession(null);
    toast.info('Sesión cerrada correctamente');
  } catch (error) {
    setSession(null);
    toast.info('Sesión cerrada correctamente');
  }
}, []);
```

**Después:**
```typescript
const logout = useCallback(async () => {
  try {
    await AuthService.logout();
  } catch (error) {
    console.warn('⚠️ [LOGOUT] Error en logout del servidor, limpiando sesión local');
  } finally {
    // Limpiar explícitamente el localStorage ANTES de actualizar el estado
    console.log('🗑️ [LOGOUT] Limpiando sesión de localStorage');
    localStorage.removeItem(SESSION_KEY);
    
    // Verificar que se limpió correctamente
    const verification = localStorage.getItem(SESSION_KEY);
    if (verification) {
      console.warn('⚠️ [LOGOUT] La sesión no se limpió correctamente, forzando limpieza');
      localStorage.removeItem(SESSION_KEY);
    } else {
      console.log('✅ [LOGOUT] Sesión eliminada correctamente del localStorage');
    }
    
    // Actualizar el estado después de limpiar localStorage
    setSession(null);
    toast.info('Sesión cerrada correctamente');
  }
}, []);
```

**Mejoras:**
- ✅ Limpia explícitamente el `localStorage` antes de actualizar el estado
- ✅ Verifica que la limpieza se haya realizado correctamente
- ✅ Fuerza la limpieza si no se eliminó en el primer intento
- ✅ Logs detallados para debugging

### 2. **Login Mejorado** (`lib/auth/auth-context.tsx`)

**Antes:**
```typescript
const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    console.log('🔐 [LOGIN] Iniciando login...');
    const response = await AuthService.login(credentials);
    // ...
  }
}, []);
```

**Después:**
```typescript
const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    // Limpiar cualquier sesión anterior antes de hacer login
    const existingSession = localStorage.getItem(SESSION_KEY);
    if (existingSession) {
      console.log('🧹 [LOGIN] Limpiando sesión anterior antes de nuevo login');
      localStorage.removeItem(SESSION_KEY);
      // Limpiar también el estado de React para evitar conflictos
      setSession(null);
      // Pequeño delay para asegurar que el localStorage y el estado se limpien
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🔐 [LOGIN] Iniciando login con rememberMe:', credentials.rememberMe);
    console.log('📧 [LOGIN] Email:', credentials.email);
    
    const response = await AuthService.login(credentials);
    // ...
  }
}, []);
```

**Mejoras:**
- ✅ Limpia sesiones anteriores antes de hacer login
- ✅ Limpia tanto `localStorage` como el estado de React
- ✅ Delay para asegurar que la limpieza se complete
- ✅ Logs detallados del email que se está usando

### 3. **UserMenu Mejorado** (`components/auth/UserMenu.tsx`)

**Antes:**
```typescript
const handleLogout = async () => {
  await logout();
  router.push(ROUTES.HOME);
};
```

**Después:**
```typescript
const handleLogout = async () => {
  try {
    await logout();
    // Pequeño delay para asegurar que el localStorage se limpie
    await new Promise(resolve => setTimeout(resolve, 100));
    // Redirigir a login para que el usuario pueda iniciar sesión con otro perfil
    router.push(ROUTES.LOGIN);
    // Forzar recarga para limpiar cualquier estado residual
    router.refresh();
  } catch (error) {
    console.error('Error en logout:', error);
    router.push(ROUTES.LOGIN);
  }
};
```

**Mejoras:**
- ✅ Espera a que el logout se complete antes de redirigir
- ✅ Redirige a `/login` en lugar de `/` para que sea más claro
- ✅ Fuerza recarga de la página para limpiar estado residual
- ✅ Manejo de errores robusto

### 4. **AdminSidebar Mejorado** (`components/admin/AdminSidebar.tsx`)

Mismas mejoras que `UserMenu` para consistencia.

## 🧪 Cómo Probar

### Prueba 1: Cambio de Perfil Básico

1. **Inicia sesión con el primer usuario:**
   - Email: `demo@airbnb.com`
   - Password: `password123`
   - ✅ Deberías ver tu avatar en el header

2. **Cierra sesión:**
   - Click en tu avatar → "Cerrar sesión"
   - ✅ Deberías ser redirigido a `/login`
   - ✅ El localStorage debería estar limpio (verifica en DevTools → Application → Local Storage)

3. **Inicia sesión con otro usuario:**
   - Email: `juan@example.com`
   - Password: `Password123`
   - ✅ Deberías ver el avatar del nuevo usuario
   - ✅ No debería haber datos del usuario anterior

### Prueba 2: Cambio Rápido Entre Perfiles

1. **Inicia sesión con usuario A**
2. **Sin cerrar sesión, intenta iniciar sesión con usuario B:**
   - Ve a `/login`
   - Ingresa credenciales de otro usuario
   - ✅ El sistema debería limpiar la sesión anterior automáticamente
   - ✅ Deberías ver el nuevo usuario sin problemas

### Prueba 3: Verificación en Consola

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Intenta cambiar de perfil
4. Deberías ver estos logs:
   ```
   🗑️ [LOGOUT] Limpiando sesión de localStorage
   ✅ [LOGOUT] Sesión eliminada correctamente del localStorage
   🧹 [LOGIN] Limpiando sesión anterior antes de nuevo login
   📧 [LOGIN] Email: nuevo@email.com
   ✅ [LOGIN] Respuesta exitosa del servidor
   ```

### Prueba 4: Verificación de LocalStorage

1. Abre DevTools → Application → Local Storage
2. Busca la clave `airbnb_session`
3. **Después de logout:** No debería existir
4. **Después de login:** Debería contener solo los datos del nuevo usuario

## 🔍 Debugging

Si aún tienes problemas:

### Verificar que el logout limpió todo:

```javascript
// En la consola del navegador:
localStorage.getItem('airbnb_session')
// Debería retornar: null
```

### Limpiar manualmente si es necesario:

```javascript
// En la consola del navegador:
localStorage.clear()
// Luego recarga la página
```

### Verificar el estado de la sesión:

```javascript
// En la consola del navegador:
const session = localStorage.getItem('airbnb_session')
if (session) {
  const parsed = JSON.parse(session)
  console.log('Usuario actual:', parsed.user?.email)
  console.log('Token:', parsed.token ? 'Presente' : 'No presente')
} else {
  console.log('No hay sesión activa')
}
```

## 📝 Checklist de Verificación

Después de los cambios, verifica:

- [ ] El logout limpia el `localStorage` correctamente
- [ ] El login limpia sesiones anteriores antes de crear una nueva
- [ ] Puedes cambiar entre diferentes perfiles sin problemas
- [ ] Los logs en consola muestran el proceso de limpieza
- [ ] No hay datos residuales de usuarios anteriores
- [ ] La redirección después del logout va a `/login`
- [ ] El estado de React se actualiza correctamente

## 🎯 Resultado Esperado

Ahora deberías poder:
1. ✅ Iniciar sesión con cualquier usuario
2. ✅ Cerrar sesión correctamente
3. ✅ Iniciar sesión con otro usuario sin conflictos
4. ✅ Cambiar entre perfiles sin necesidad de limpiar manualmente el navegador

---

**Última actualización:** Mejoras en manejo de sesiones en `lib/auth/auth-context.tsx`, `components/auth/UserMenu.tsx` y `components/admin/AdminSidebar.tsx`
















