# ⚡ INICIO RÁPIDO - Módulo de Autenticación

> **5 minutos para probar el sistema completo de autenticación**

---

## 🚀 PASO 1: Iniciar el servidor

```bash
npm run dev
```

Abre: http://localhost:3000

---

## 🔑 PASO 2: Login Rápido (30 segundos)

1. Click en **"Iniciar sesión"** en el header
2. Usar estas credenciales:
   ```
   Email: demo@airbnb.com
   Password: password123
   ```
3. Click en **"Iniciar sesión"**
4. ✅ ¡Listo! Verás tu avatar en el header

---

## 👤 PASO 3: Explorar tu Perfil (1 minuto)

1. Click en tu **avatar** en el header
2. Click en **"Mi perfil"**
3. Click en **"Editar perfil"**
4. Cambia tu nombre o teléfono
5. Click en **"Guardar cambios"**
6. ✅ Verás una notificación de éxito

---

## 📝 PASO 4: Probar Registro (2 minutos)

1. Click en tu avatar → **"Cerrar sesión"**
2. Click en **"Registrarse"** en el header
3. Llenar el formulario:
   ```
   Nombre: Tu Nombre
   Email: tunombre@test.com
   Contraseña: Password123
   Confirmar: Password123
   ✓ Acepto términos
   ```
4. Click en **"Crear cuenta"**
5. ✅ Cuenta creada (pero email no verificado)

---

## 📧 PASO 5: Verificar Email (MOCK) (1 minuto)

1. Abrir consola del navegador (**F12**)
2. Buscar: `🔗 Link de verificación:`
3. Copiar la URL que aparece (algo como `/verificar-email?token=...`)
4. Pegar en la barra del navegador
5. ✅ Email verificado!

---

## 🔐 PASO 6: Login con Cuenta Nueva (30 segundos)

1. Ir a `/login`
2. Usar el email y contraseña que creaste
3. ✅ Login exitoso!

---

## 🎨 PASO 7: Probar OAuth (MOCK) (30 segundos)

1. Cerrar sesión
2. Ir a `/login`
3. Click en **"Continuar con Google"**
4. ✅ Login inmediato (sin formulario)

---

## 🛡️ PASO 8: Probar Protección de Rutas (30 segundos)

1. Cerrar sesión
2. Intentar ir a `/perfil` directamente
3. ✅ Redirige automáticamente a `/login`

---

## ✅ ¡COMPLETADO!

Has probado:
- ✅ Login con email/password
- ✅ Registro de usuario
- ✅ Verificación de email
- ✅ Edición de perfil
- ✅ OAuth social (mock)
- ✅ Protección de rutas
- ✅ Logout

---

## 🧪 CREDENCIALES DE PRUEBA

### Usuario Principal
```
Email: demo@airbnb.com
Password: password123
Estado: ✅ Verificado
```

### Usuario Google
```
Email: maria@gmail.com
Password: maria2024
Estado: ✅ Verificado
Proveedor: Google OAuth
```

### Usuario Sin Verificar
```
Email: carlos@outlook.com
Password: carlos123
Estado: ❌ No verificado
(Usar para probar flujo de verificación)
```

---

## 📍 RUTAS DISPONIBLES

| Ruta | Descripción | Requiere Login |
|------|-------------|----------------|
| `/` | Home | ❌ |
| `/login` | Iniciar sesión | ❌ |
| `/registro` | Crear cuenta | ❌ |
| `/recuperar-password` | Recuperar contraseña | ❌ |
| `/perfil` | Perfil de usuario | ✅ |

---

## 🎯 FUNCIONALIDADES CLAVE

### ✨ En el Header
- **NO autenticado**: Botones "Iniciar sesión" y "Registrarse"
- **Autenticado**: Avatar + menú dropdown con opciones

### ✨ En el Menú de Usuario
- Mi perfil
- Mis reservas (próximamente)
- Favoritos (próximamente)
- Configuración (próximamente)
- Cerrar sesión

### ✨ Notificaciones
- ✅ Login exitoso
- ✅ Cuenta creada
- ✅ Perfil actualizado
- ✅ Sesión cerrada
- ❌ Errores claros (credenciales inválidas, email no verificado, etc.)

---

## 💡 TIPS

### Ver Logs Detallados
1. Abrir consola del navegador (**F12**)
2. Todos los servicios logean acciones:
   ```
   🔐 [LOGIN] Intentando login para: demo@airbnb.com
   ✅ [LOGIN] Login exitoso: Juan Pérez
   📧 [REGISTER] Email de verificación enviado (MOCK)
   ```

### Limpiar Sesión
Si algo no funciona, limpiar localStorage:
```javascript
// En consola del navegador:
localStorage.clear();
location.reload();
```

### Probar Bloqueo por Intentos Fallidos
1. Ir a `/login`
2. Intentar login con contraseña incorrecta 5 veces
3. ❌ Cuenta bloqueada por 15 minutos
4. Ver mensaje de error con tiempo restante

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles, ver:

- **`AUTH_DOCUMENTATION.md`** - Guía completa de todo el sistema
- **`MILESTONE_1.md`** - Plan detallado de tareas implementadas
- **`IMPLEMENTATION_SUMMARY.md`** - Resumen ejecutivo

---

## ❓ TROUBLESHOOTING RÁPIDO

### "Email no verificado"
→ Revisa consola (F12), copia el link de verificación

### "Cuenta bloqueada"
→ Espera 15 min o limpia localStorage

### "Sesión expiró"
→ Vuelve a hacer login (usa "Recordarme" para sesión de 30 días)

### No veo mi avatar
→ Refresca la página (Ctrl+R)

---

## 🎉 ¡TODO FUNCIONA!

Si completaste todos los pasos, has probado exitosamente:
- ✅ Sistema completo de autenticación
- ✅ Persistencia de sesión
- ✅ Validaciones de formularios
- ✅ Protección de rutas
- ✅ UI/UX profesional

---

**¿Listo para más?** → Revisa `AUTH_DOCUMENTATION.md` para funcionalidades avanzadas

**Tiempo total**: ~5 minutos ⚡


