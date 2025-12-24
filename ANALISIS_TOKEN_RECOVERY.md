# 🔍 Análisis: Generación de Token en Recuperación de Contraseña

**Fecha:** 24 de Diciembre, 2025  
**Problema:** El token no se genera al enviar el email de recuperación  
**Ubicación:** Backend API `/api/auth/recovery`

---

## 📋 Análisis del Problema

### Flujo Esperado (Seguridad Correcta)

```
1. Usuario solicita recuperación
   POST /api/auth/recovery
   Body: { email: "juan@example.com" }
   
2. Backend DEBE:
   ✅ Generar token único (ej: UUID o JWT)
   ✅ Guardar token en BD asociado al usuario
   ✅ Establecer expiración (ej: 1 hora)
   ✅ Enviar email con link: https://app.com/reset-password?token=ABC123
   ✅ NO devolver token en la respuesta (seguridad)
   
3. Respuesta al Frontend:
   {
     "success": true,
     "message": "Si el email existe, recibirás instrucciones..."
   }
   
4. Usuario recibe email con link
   Link: /reset-password?token=ABC123
   
5. Usuario hace click → Frontend extrae token de URL
   
6. Usuario resetea contraseña
   POST /api/auth/reset-password
   Body: { token: "ABC123", password: "NewPass123" }
```

### Problema Actual

Según la imagen de Postman, la respuesta actual es:

```json
{
  "success": true,
  "message": "Si el email existe, recibirás instrucciones para recuperar tu contraseña"
}
```

**Esto es CORRECTO** - El token NO debe venir en la respuesta.

**PERO** el backend debe estar haciendo:
- ❓ ¿Generando el token?
- ❓ ¿Guardándolo en la base de datos?
- ❓ ¿Enviando el email con el link?

---

## 🔒 Por Qué el Token NO Debe Venir en la Respuesta

### Razones de Seguridad

1. **Prevención de interceptación:**
   - Si el token viene en la respuesta HTTP, puede ser interceptado
   - Un atacante podría usar el token sin necesidad del email

2. **Verificación de email:**
   - El token en el email confirma que el usuario tiene acceso al email
   - Si el token viene en la respuesta, no se verifica la propiedad del email

3. **Best Practices:**
   - Estándar de la industria: tokens de recuperación se envían por email
   - OAuth, JWT, y otros sistemas siguen este patrón

---

## ✅ Lo Que el Backend DEBE Hacer

### 1. Generar Token Único

```typescript
// Ejemplo de generación de token
import crypto from 'crypto';

const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
  // O usar UUID: uuidv4()
  // O usar JWT con expiración
};
```

### 2. Guardar Token en Base de Datos

```typescript
// Esquema MongoDB (ejemplo)
interface PasswordResetToken {
  userId: string;
  token: string;
  email: string;
  expiresAt: Date;  // Ej: 1 hora desde ahora
  used: boolean;
  createdAt: Date;
}
```

### 3. Enviar Email con Link

```typescript
// Ejemplo de email
const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

await sendEmail({
  to: user.email,
  subject: 'Recuperar tu contraseña',
  html: `
    <h1>Recuperar contraseña</h1>
    <p>Haz click en el siguiente link para restablecer tu contraseña:</p>
    <a href="${resetLink}">Restablecer contraseña</a>
    <p>Este link expira en 1 hora.</p>
  `
});
```

### 4. Validar Token al Resetear

```typescript
// Al recibir POST /api/auth/reset-password
const token = req.body.token;
const password = req.body.password;

// Buscar token en BD
const resetToken = await PasswordResetToken.findOne({
  token,
  used: false,
  expiresAt: { $gt: new Date() }  // No expirado
});

if (!resetToken) {
  return res.status(400).json({
    success: false,
    error: { message: 'Token inválido o expirado' }
  });
}

// Actualizar contraseña
await User.updateOne(
  { _id: resetToken.userId },
  { password: hashedPassword }
);

// Marcar token como usado
resetToken.used = true;
await resetToken.save();
```

---

## 🔍 Verificación del Backend

### Checklist para el Backend

- [ ] ¿Genera un token único al recibir `/api/auth/recovery`?
- [ ] ¿Guarda el token en la base de datos?
- [ ] ¿Establece una fecha de expiración (ej: 1 hora)?
- [ ] ¿Envía un email con el link que incluye el token?
- [ ] ¿Valida el token al recibir `/api/auth/reset-password`?
- [ ] ¿Marca el token como usado después de resetear?
- [ ] ¿Previene reutilización del token?

---

## 📝 Implementación Sugerida para el Backend

### Endpoint: POST /api/auth/recovery

```typescript
// controllers/auth/recovery.ts
export async function requestPasswordRecovery(req: Request, res: Response) {
  const { email } = req.body;

  // 1. Buscar usuario
  const user = await User.findOne({ email });
  
  // Por seguridad, siempre devolver éxito (no revelar si email existe)
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
    });
  }

  // 2. Generar token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

  // 3. Guardar token en BD
  await PasswordResetToken.create({
    userId: user._id,
    email: user.email,
    token,
    expiresAt,
    used: false
  });

  // 4. Enviar email
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  await sendEmail({
    to: user.email,
    subject: 'Recuperar tu contraseña - Airbnb Clone',
    html: `
      <h2>Recuperar contraseña</h2>
      <p>Haz click en el siguiente link para restablecer tu contraseña:</p>
      <a href="${resetLink}" style="background: #FF385C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Restablecer contraseña
      </a>
      <p>Este link expira en 1 hora.</p>
      <p>Si no solicitaste este cambio, ignora este email.</p>
    `
  });

  // 5. Respuesta (sin token por seguridad)
  return res.status(200).json({
    success: true,
    message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña'
  });
}
```

### Endpoint: POST /api/auth/reset-password

```typescript
// controllers/auth/reset-password.ts
export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body;

  // 1. Buscar token válido
  const resetToken = await PasswordResetToken.findOne({
    token,
    used: false,
    expiresAt: { $gt: new Date() }
  });

  if (!resetToken) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token inválido o expirado'
      }
    });
  }

  // 2. Validar contraseña
  // ... validaciones de contraseña ...

  // 3. Hashear nueva contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Actualizar contraseña del usuario
  await User.updateOne(
    { _id: resetToken.userId },
    { password: hashedPassword }
  );

  // 5. Marcar token como usado
  resetToken.used = true;
  await resetToken.save();

  // 6. Respuesta
  return res.status(200).json({
    success: true,
    message: 'Contraseña restablecida correctamente'
  });
}
```

---

## 🎯 Conclusión

### El Frontend Está Correcto ✅

El frontend NO debe recibir el token en la respuesta. Esto es correcto por seguridad.

### El Backend Debe Implementar ✅

1. **Generación de token** al recibir `/api/auth/recovery`
2. **Guardado en BD** con expiración
3. **Envío por email** con link que incluye el token
4. **Validación del token** al recibir `/api/auth/reset-password`

### Flujo Completo

```
Usuario → Frontend → Backend → Genera Token → Guarda en BD → Envía Email
                                                                    ↓
Usuario recibe email → Click en link → Frontend extrae token → Backend valida → Reset password
```

---

## 📌 Recomendaciones

1. **Verificar implementación del backend:**
   - Revisar si el endpoint `/api/auth/recovery` genera tokens
   - Verificar si se guardan en la base de datos
   - Confirmar si se envían emails

2. **Si el backend no está implementado:**
   - Implementar generación de tokens
   - Crear modelo/schema para PasswordResetToken
   - Configurar servicio de email (ej: Nodemailer, SendGrid, Resend)

3. **Testing:**
   - Probar que el token se genera
   - Verificar que el email se envía
   - Confirmar que el token funciona en reset-password

---

**El problema está en el BACKEND, no en el FRONTEND.**  
El frontend está implementado correctamente según las mejores prácticas de seguridad.

