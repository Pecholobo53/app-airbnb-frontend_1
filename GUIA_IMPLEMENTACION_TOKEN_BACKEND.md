# 🔧 Guía: Implementación de Tokens de Recuperación en Backend

**Fecha:** 24 de Diciembre, 2025  
**Criterios:** @.cursor/rules/mvc_milestone.mdc  
**Stack:** MongoDB + Express.js + TypeScript + Node.js

---

## 📋 Resumen Ejecutivo

Esta guía explica cómo implementar la generación y validación de tokens de recuperación de contraseña en el backend, siguiendo los principios del milestone MVC:

- ✅ Código simple y mantenible (nivel junior)
- ✅ Sin dependencias innecesarias
- ✅ Patrón MVC (Model-View-Controller)
- ✅ Programación funcional (evitar clases cuando sea posible)

---

## 🎯 Flujo Completo

```
1. Usuario solicita recuperación
   POST /api/auth/recovery
   → Backend genera token único
   → Guarda token en MongoDB
   → Envía email con link

2. Usuario hace click en link
   GET /reset-password?token=abc123
   → Frontend extrae token

3. Usuario resetea contraseña
   POST /api/auth/reset-password
   → Backend valida token
   → Actualiza contraseña
   → Marca token como usado
```

---

## 📁 Estructura de Archivos (Backend)

```
backend/
├── models/
│   └── PasswordResetToken.ts      # Modelo MongoDB
├── controllers/
│   └── auth/
│       ├── recovery.controller.ts  # POST /api/auth/recovery
│       └── reset-password.controller.ts  # POST /api/auth/reset-password
├── services/
│   └── email.service.ts           # Envío de emails
└── utils/
    └── token.util.ts              # Generación de tokens
```

---

## 🔧 Implementación Paso a Paso

### PASO 1: Instalar Dependencias Necesarias

```bash
npm install crypto uuid
npm install --save-dev @types/uuid
```

**Justificación:**
- `crypto`: Generación segura de tokens (ya viene con Node.js)
- `uuid`: Alternativa para tokens UUID (opcional)

---

### PASO 2: Crear Modelo MongoDB

**Archivo:** `models/PasswordResetToken.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface para Password Reset Token
 */
export interface IPasswordResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

/**
 * Schema de Password Reset Token
 */
const PasswordResetTokenSchema = new Schema<IPasswordResetToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // Auto-eliminar documentos expirados
  },
  used: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Índice compuesto para búsquedas rápidas
PasswordResetTokenSchema.index({ token: 1, used: 1, expiresAt: 1 });

// Auto-eliminar tokens expirados después de 1 hora
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken = mongoose.model<IPasswordResetToken>(
  'PasswordResetToken',
  PasswordResetTokenSchema
);
```

**Características:**
- ✅ Auto-eliminación de tokens expirados (MongoDB TTL)
- ✅ Índices para búsquedas rápidas
- ✅ Validación de campos requeridos
- ✅ Referencia al modelo User

---

### PASO 3: Utilidad para Generar Tokens

**Archivo:** `utils/token.util.ts`

```typescript
import crypto from 'crypto';

/**
 * Genera un token único y seguro para recuperación de contraseña
 * 
 * @returns Token hexadecimal de 64 caracteres (32 bytes)
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calcula la fecha de expiración del token
 * 
 * @param hours - Horas hasta la expiración (default: 1)
 * @returns Fecha de expiración
 */
export function getTokenExpiration(hours: number = 1): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + hours);
  return expiration;
}
```

**Alternativa con UUID (opcional):**

```typescript
import { v4 as uuidv4 } from 'uuid';

export function generateResetToken(): string {
  // Opción 1: Crypto (más seguro, más largo)
  return crypto.randomBytes(32).toString('hex');
  
  // Opción 2: UUID (más corto, también seguro)
  // return uuidv4();
}
```

---

### PASO 4: Servicio de Email (Simple)

**Archivo:** `services/email.service.ts`

```typescript
/**
 * Servicio simple de envío de emails
 * 
 * NOTA: En producción, usar Nodemailer, SendGrid, Resend, etc.
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envía un email de recuperación de contraseña
 * 
 * @param email - Email del destinatario
 * @param token - Token de recuperación
 * @param frontendUrl - URL del frontend (ej: http://localhost:3001)
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  frontendUrl: string = process.env.FRONTEND_URL || 'http://localhost:3001'
): Promise<void> {
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;
  
  const emailContent = {
    to: email,
    subject: 'Recuperar tu contraseña - Airbnb Clone',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #FF385C; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Recuperar contraseña</h2>
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Haz click en el siguiente botón para continuar:</p>
            <a href="${resetLink}" class="button">Restablecer contraseña</a>
            <p>O copia y pega este link en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${resetLink}</p>
            <p><strong>Este link expira en 1 hora.</strong></p>
            <p>Si no solicitaste este cambio, puedes ignorar este email de forma segura.</p>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Airbnb Clone. Proyecto de demostración.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  // TODO: Implementar envío real de email
  // Opciones:
  // 1. Nodemailer (SMTP)
  // 2. SendGrid
  // 3. Resend
  // 4. AWS SES
  
  console.log('📧 [EMAIL SERVICE] Email de recuperación:', {
    to: email,
    resetLink,
    // En desarrollo, loguear el link para testing
  });

  // En desarrollo, mostrar el link en consola
  if (process.env.NODE_ENV === 'development') {
    console.log('🔗 [DEV] Link de recuperación:', resetLink);
  }

  // TODO: Implementar envío real
  // await sendEmail(emailContent);
}
```

**Para producción, usar Nodemailer:**

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  frontendUrl: string
): Promise<void> {
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@airbnb.com',
    to: email,
    subject: 'Recuperar tu contraseña - Airbnb Clone',
    html: `...`, // HTML del email
  });
}
```

---

### PASO 5: Controller - POST /api/auth/recovery

**Archivo:** `controllers/auth/recovery.controller.ts`

```typescript
import { Request, Response } from 'express';
import { User } from '../../models/User';
import { PasswordResetToken } from '../../models/PasswordResetToken';
import { generateResetToken, getTokenExpiration } from '../../utils/token.util';
import { sendPasswordResetEmail } from '../../services/email.service';

/**
 * POST /api/auth/recovery
 * Solicitar recuperación de contraseña
 * 
 * Body: { email: string }
 * Response: { success: boolean, message: string }
 */
export async function requestPasswordRecovery(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { email } = req.body;

    // Validar email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Email es requerido',
        },
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Por seguridad, siempre devolver éxito (no revelar si email existe)
    // Esto previene enumeración de emails
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
      });
    }

    // Generar token único
    const token = generateResetToken();
    const expiresAt = getTokenExpiration(1); // Expira en 1 hora

    // Invalidar tokens anteriores del usuario (opcional - buena práctica)
    await PasswordResetToken.updateMany(
      { userId: user._id, used: false },
      { used: true }
    );

    // Guardar token en MongoDB
    await PasswordResetToken.create({
      userId: user._id,
      email: user.email,
      token,
      expiresAt,
      used: false,
    });

    // Enviar email con link de recuperación
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    await sendPasswordResetEmail(user.email, token, frontendUrl);

    // Respuesta (sin token por seguridad)
    return res.status(200).json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
    });
  } catch (error) {
    console.error('❌ [RECOVERY] Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al procesar la solicitud',
      },
    });
  }
}
```

**Características:**
- ✅ No revela si el email existe (seguridad)
- ✅ Genera token único
- ✅ Guarda en MongoDB
- ✅ Invalida tokens anteriores
- ✅ Envía email con link
- ✅ Manejo de errores robusto

---

### PASO 6: Controller - POST /api/auth/reset-password

**Archivo:** `controllers/auth/reset-password.controller.ts`

```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/User';
import { PasswordResetToken } from '../../models/PasswordResetToken';

/**
 * POST /api/auth/reset-password
 * Restablecer contraseña con token
 * 
 * Body: { token: string, password: string }
 * Response: { success: boolean, message?: string, error?: { code, message } }
 */
export async function resetPassword(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const { token, password } = req.body;

    // Validar campos requeridos
    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token es requerido',
        },
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Contraseña es requerida',
        },
      });
    }

    // Validar contraseña (mínimo 8 caracteres)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'La contraseña debe tener al menos 8 caracteres',
        },
      });
    }

    // Buscar token válido en MongoDB
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }, // No expirado
    });

    if (!resetToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token inválido o expirado',
        },
      });
    }

    // Buscar usuario
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado',
        },
      });
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Actualizar contraseña del usuario
    await User.updateOne(
      { _id: user._id },
      { 
        password: hashedPassword,
        updatedAt: new Date(),
      }
    );

    // Marcar token como usado
    resetToken.used = true;
    await resetToken.save();

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Contraseña restablecida correctamente',
    });
  } catch (error) {
    console.error('❌ [RESET PASSWORD] Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error al restablecer la contraseña',
      },
    });
  }
}
```

**Características:**
- ✅ Valida token en MongoDB
- ✅ Verifica que no esté usado
- ✅ Verifica que no esté expirado
- ✅ Hashea nueva contraseña con bcrypt
- ✅ Actualiza contraseña del usuario
- ✅ Marca token como usado
- ✅ Manejo de errores robusto

---

### PASO 7: Rutas (Express Router)

**Archivo:** `routes/auth.routes.ts`

```typescript
import { Router } from 'express';
import { requestPasswordRecovery } from '../controllers/auth/recovery.controller';
import { resetPassword } from '../controllers/auth/reset-password.controller';

const router = Router();

// POST /api/auth/recovery
router.post('/recovery', requestPasswordRecovery);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
```

---

## 🧪 Testing Manual

### 1. Generar Token de Prueba

**Opción A: Desde MongoDB (para testing rápido)**

```javascript
// En MongoDB Compass o mongo shell
db.passwordresettokens.insertOne({
  userId: ObjectId("69373fded72c75eb71475fa5"), // ID del usuario
  email: "juan@example.com",
  token: "test-token-123",
  expiresAt: new Date(Date.now() + 3600000), // 1 hora desde ahora
  used: false,
  createdAt: new Date()
});
```

**Opción B: Crear endpoint de desarrollo (solo en dev)**

```typescript
// controllers/auth/dev.controller.ts (solo en desarrollo)
export async function generateTestToken(
  req: Request,
  res: Response
): Promise<Response> {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const token = generateResetToken();
  const expiresAt = getTokenExpiration(1);

  await PasswordResetToken.create({
    userId: user._id,
    email: user.email,
    token,
    expiresAt,
    used: false,
  });

  return res.status(200).json({
    success: true,
    token, // Solo en desarrollo
    resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
  });
}
```

---

## 📊 Estructura de Datos en MongoDB

### Colección: `passwordresettokens`

```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("69373fded72c75eb71475fa5"),
  "email": "juan@example.com",
  "token": "a1b2c3d4e5f6...",
  "expiresAt": ISODate("2025-12-24T21:00:00Z"),
  "used": false,
  "createdAt": ISODate("2025-12-24T20:00:00Z")
}
```

**Índices:**
- `token` (único)
- `userId` (para búsquedas por usuario)
- `expiresAt` (TTL - auto-eliminación)
- Compuesto: `{ token: 1, used: 1, expiresAt: 1 }`

---

## 🔒 Seguridad

### Mejores Prácticas Implementadas

1. ✅ **Tokens únicos y seguros**
   - `crypto.randomBytes(32)` genera tokens criptográficamente seguros
   - 64 caracteres hexadecimales (256 bits de entropía)

2. ✅ **Expiración automática**
   - Tokens expiran en 1 hora
   - MongoDB TTL elimina tokens expirados automáticamente

3. ✅ **Uso único**
   - Tokens marcados como `used: true` después de uso
   - No se pueden reutilizar

4. ✅ **No revelar información**
   - Siempre devolver éxito en `/recovery` (no revelar si email existe)
   - Token no se devuelve en respuesta HTTP

5. ✅ **Invalidar tokens anteriores**
   - Al generar nuevo token, invalidar los anteriores del usuario

---

## 📝 Variables de Entorno Necesarias

```env
# .env
FRONTEND_URL=http://localhost:3001
NODE_ENV=development

# Para producción (email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-password
EMAIL_FROM=noreply@airbnb.com
```

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias: `crypto`, `uuid` (opcional)
- [ ] Crear modelo `PasswordResetToken` en MongoDB
- [ ] Crear utilidad `generateResetToken()`
- [ ] Crear servicio de email (simple o con Nodemailer)
- [ ] Implementar `POST /api/auth/recovery`
- [ ] Implementar `POST /api/auth/reset-password`
- [ ] Agregar rutas en Express
- [ ] Configurar variables de entorno
- [ ] Probar generación de token
- [ ] Probar validación de token
- [ ] Probar expiración de token
- [ ] Probar invalidación después de uso

---

## 🧪 Cómo Generar Token para Testing

### Método 1: Usar el Endpoint de Recovery

```bash
# 1. Solicitar recuperación (genera token real)
curl -X POST http://localhost:3000/api/auth/recovery \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@example.com"}'

# 2. Revisar logs del servidor (en desarrollo muestra el link)
# O revisar MongoDB para obtener el token
```

### Método 2: Crear Token Manualmente en MongoDB

```javascript
// En MongoDB Compass
use airbnb_db;

db.passwordresettokens.insertOne({
  userId: ObjectId("69373fded72c75eb71475fa5"),
  email: "juan@example.com",
  token: "mi-token-de-prueba-123",
  expiresAt: new Date(Date.now() + 3600000), // 1 hora
  used: false,
  createdAt: new Date()
});

// Obtener el token
db.passwordresettokens.findOne({ email: "juan@example.com", used: false });
```

### Método 3: Endpoint de Desarrollo (Solo Dev)

```typescript
// Agregar en routes/auth.routes.ts (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  router.post('/dev/generate-token', generateTestToken);
}
```

```bash
# Usar endpoint de desarrollo
curl -X POST http://localhost:3000/api/auth/dev/generate-token \
  -H "Content-Type: application/json" \
  -d '{"email": "juan@example.com"}'

# Respuesta:
# {
#   "success": true,
#   "token": "abc123...",
#   "resetLink": "http://localhost:3001/reset-password?token=abc123..."
# }
```

---

## 🎯 Ejemplo Completo de Uso

### 1. Usuario solicita recuperación

```bash
POST http://localhost:3000/api/auth/recovery
Body: { "email": "juan@example.com" }

Response: {
  "success": true,
  "message": "Si el email existe, recibirás instrucciones..."
}
```

**Backend hace:**
1. Busca usuario por email
2. Genera token: `"a1b2c3d4e5f6..."`
3. Guarda en MongoDB
4. Envía email con link: `http://localhost:3001/reset-password?token=a1b2c3d4e5f6...`

### 2. Usuario hace click en link

```
Frontend: http://localhost:3001/reset-password?token=a1b2c3d4e5f6...
→ Extrae token
→ Muestra formulario
```

### 3. Usuario resetea contraseña

```bash
POST http://localhost:3000/api/auth/reset-password
Body: {
  "token": "a1b2c3d4e5f6...",
  "password": "NewPassword123"
}

Response: {
  "success": true,
  "message": "Contraseña restablecida correctamente"
}
```

**Backend hace:**
1. Busca token en MongoDB
2. Valida que no esté usado ni expirado
3. Hashea nueva contraseña
4. Actualiza contraseña del usuario
5. Marca token como usado

---

## 📌 Resumen

### Para Generar Token Válido:

1. **Método Recomendado:** Usar `POST /api/auth/recovery` con email real
   - Genera token automáticamente
   - Lo guarda en MongoDB
   - Envía email (o muestra en logs en desarrollo)

2. **Método Manual:** Insertar directamente en MongoDB
   - Útil para testing rápido
   - Requiere conocer el userId

3. **Método Dev:** Endpoint de desarrollo
   - Solo en `NODE_ENV=development`
   - Retorna token en respuesta (solo para testing)

---

**Implementado según:** @.cursor/rules/mvc_milestone.mdc  
**Stack:** MongoDB + Express.js + TypeScript  
**Complejidad:** Media


