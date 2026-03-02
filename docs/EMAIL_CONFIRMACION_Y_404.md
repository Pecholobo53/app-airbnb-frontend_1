# Corrección: Email de confirmación y 404

## 1. Problema 404 al hacer clic en "Confirmar mi cuenta"

Si al hacer clic en el enlace del email obtienes una página 404, la causa más probable es que **la versión desplegada en producción no incluye las rutas** `/verificar-email` y `/email-confirmado`.

### Solución

1. **Reconstruir y redesplegar** el frontend con el código más reciente:
   ```bash
   npm run build
   # Luego desplegar según tu plataforma (Vercel, Netlify, etc.)
   ```

2. **Verificar que la URL del enlace sea correcta**:
   - Debe apuntar a: `https://www.voyageraumaroc.net/verificar-email?token=XXX`
   - No debe tener rutas extra ni basePath.

3. **Variable de entorno en el backend**:
   - El backend debe usar `APP_URL=https://www.voyageraumaroc.net` (sin barra final) al construir el enlace.

---

## 2. Logo del email con fondo negro

Se ha creado la plantilla `templates/email-confirmacion-cuenta.html` con:

- **Fondo negro** (#000000) en la cabecera del logo
- **Logo VoyagerAuMaroc** coherente con el frontend: media luna roja + texto blanco/coral
- **Estética oscura** alineada con el frontend

### Uso en el backend

El backend debe cargar esta plantilla HTML y reemplazar:

| Variable | Valor |
|----------|-------|
| `{{verificationLink}}` | `https://www.voyageraumaroc.net/verificar-email?token=${token}` |
| `{{year}}` | `new Date().getFullYear()` |

Ejemplo con Node.js:

```js
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../templates/email-confirmacion-cuenta.html');
let html = fs.readFileSync(templatePath, 'utf8');

html = html
  .replace(/\{\{verificationLink\}\}/g, `https://www.voyageraumaroc.net/verificar-email?token=${token}`)
  .replace(/\{\{year\}\}/g, new Date().getFullYear().toString());

// Enviar html en el email
await sendEmail({ to: email, subject: 'Confirma tu cuenta', html });
```

Si el backend está en otro repositorio, copia el contenido de `templates/email-confirmacion-cuenta.html` al proyecto del backend.
