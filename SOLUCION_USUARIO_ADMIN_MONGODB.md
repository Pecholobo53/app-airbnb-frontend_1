# 🔧 Solución: Usuario Admin Creado en MongoDB No Es Reconocido

**Fecha:** 2025-12-27  
**Problema:** Usuario creado directamente en MongoDB no puede hacer login  
**Estado:** ⚠️ **REQUIERE ACCIÓN EN BACKEND/MONGODB**

---

## 🔍 Problema Identificado

### Síntoma:
- ✅ Usuario creado en MongoDB con rol "admin"
- ❌ Al intentar login, no es reconocido
- ❌ Credenciales no funcionan

### Causa Raíz:
Cuando creas un usuario directamente en MongoDB, probablemente:
1. **Contraseña en texto plano** - El backend espera un hash bcrypt
2. **Campos faltantes** - Pueden faltar campos requeridos
3. **Formato incorrecto** - El email puede tener mayúsculas/minúsculas incorrectas

---

## ✅ Soluciones

### **Opción 1: Usar el Endpoint de Registro (RECOMENDADO)** ⭐

La mejor forma es usar el endpoint de registro del backend, que hashea la contraseña correctamente:

**Usando curl o Postman:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Armandito Admin",
    "email": "armandito@gmail.com",
    "password": "Password123"
  }'
```

**Luego actualizar el rol a admin en MongoDB:**
```javascript
// En MongoDB Compass o mongo shell
db.users.updateOne(
  { email: "armandito@gmail.com" },
  { $set: { role: "admin" } }
);
```

---

### **Opción 2: Hashear la Contraseña Manualmente en MongoDB**

Si necesitas mantener el usuario que ya creaste, debes hashear la contraseña:

#### **Paso 1: Generar Hash de Contraseña**

**Opción A: Usar Node.js (en el backend):**
```javascript
// En el backend, ejecutar en consola Node.js o crear un script temporal
const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'Password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash generado:', hash);
  // Copiar este hash
}

hashPassword();
```

**Opción B: Usar herramienta online (menos seguro):**
- Buscar "bcrypt hash generator" en Google
- Ingresar: `Password123`
- Rounds: `10`
- Copiar el hash generado

#### **Paso 2: Actualizar Usuario en MongoDB**

```javascript
// En MongoDB Compass o mongo shell
db.users.updateOne(
  { email: "armandito@gmail.com" },
  { 
    $set: { 
      password: "PEGAR_AQUI_EL_HASH_GENERADO",
      emailVerified: true,
      provider: "email",
      favorites: [],
      updatedAt: new Date()
    }
  }
);
```

#### **Paso 3: Verificar Campos Requeridos**

Asegúrate de que el usuario tenga estos campos:

```javascript
{
  _id: ObjectId("..."),
  name: "Armandito",
  email: "armandito@gmail.com",  // ← En minúsculas, sin espacios
  password: "$2b$10$...",  // ← Hash bcrypt (NO texto plano)
  role: "admin",
  emailVerified: true,  // ← Importante: debe ser true
  provider: "email",  // ← "email", "google", o "facebook"
  favorites: [],  // ← Array vacío si no tiene favoritos
  createdAt: ISODate("2024-12-25T00:00:00.000Z"),
  updatedAt: ISODate("2024-12-27T00:00:00.000Z")
}
```

---

### **Opción 3: Script de Node.js para Crear Usuario Admin**

Crea un script temporal en el backend:

**Archivo:** `scripts/create-admin.js` (temporal, eliminar después)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Importar modelo User del backend
const User = require('../models/User'); // Ajustar ruta según tu estructura

async function createAdmin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const email = 'armandito@gmail.com';
    const password = 'Password123';
    const name = 'Armandito';

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (existingUser) {
      console.log('⚠️ Usuario ya existe. Actualizando...');
      
      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Actualizar usuario
      await User.updateOne(
        { _id: existingUser._id },
        {
          password: hashedPassword,
          role: 'admin',
          emailVerified: true,
          provider: 'email',
          favorites: existingUser.favorites || [],
          updatedAt: new Date()
        }
      );
      
      console.log('✅ Usuario actualizado correctamente');
    } else {
      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Crear nuevo usuario
      const newUser = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin',
        emailVerified: true,
        provider: 'email',
        favorites: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Usuario admin creado:', newUser._id);
    }
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
```

**Ejecutar:**
```bash
cd backend  # O la ruta donde está el backend
node scripts/create-admin.js
```

---

## 🔍 Verificación

### Verificar que el Usuario Esté Correcto en MongoDB:

```javascript
// En MongoDB Compass o mongo shell
db.users.findOne({ email: "armandito@gmail.com" });
```

**Verificar:**
- ✅ `email` está en minúsculas: `"armandito@gmail.com"`
- ✅ `password` es un hash (empieza con `$2b$10$` o similar), NO texto plano
- ✅ `emailVerified: true`
- ✅ `provider: "email"`
- ✅ `role: "admin"`
- ✅ `favorites` es un array (puede estar vacío)

### Probar Login:

1. Ir a `http://localhost:3001/login`
2. Email: `armandito@gmail.com`
3. Password: `Password123`
4. Debería funcionar correctamente

---

## ⚠️ Problemas Comunes

### Problema 1: Contraseña en Texto Plano

**Síntoma:** Login falla con "Credenciales inválidas"

**Solución:**
- La contraseña DEBE estar hasheada con bcrypt
- NO puede estar en texto plano como `"Password123"`
- Debe ser un hash como `"$2b$10$abcdefghijklmnopqrstuvwxyz1234567890"`

### Problema 2: Email con Mayúsculas

**Síntoma:** Login falla aunque la contraseña sea correcta

**Solución:**
- El email debe estar en minúsculas: `"armandito@gmail.com"`
- NO: `"Armandito@Gmail.com"` o `"ARMANDITO@GMAIL.COM"`

### Problema 3: emailVerified: false

**Síntoma:** Login falla aunque todo esté correcto

**Solución:**
- Actualizar en MongoDB: `emailVerified: true`

### Problema 4: Campos Faltantes

**Síntoma:** Error al procesar respuesta del backend

**Solución:**
- Asegurar que existan: `provider`, `favorites`, `createdAt`, `updatedAt`

---

## 📝 Checklist de Usuario Admin Correcto

- [ ] Email en minúsculas: `"armandito@gmail.com"`
- [ ] Password es hash bcrypt (NO texto plano)
- [ ] `emailVerified: true`
- [ ] `provider: "email"`
- [ ] `role: "admin"`
- [ ] `favorites: []` (array vacío o con IDs)
- [ ] `createdAt` y `updatedAt` son fechas válidas

---

## 🎯 Recomendación Final

**La mejor práctica es:**

1. **Crear el usuario usando el endpoint de registro:**
   ```bash
   POST /api/auth/register
   {
     "name": "Armandito Admin",
     "email": "armandito@gmail.com",
     "password": "Password123"
   }
   ```

2. **Luego actualizar el rol a admin en MongoDB:**
   ```javascript
   db.users.updateOne(
     { email: "armandito@gmail.com" },
     { $set: { role: "admin" } }
   );
   ```

Esto garantiza que:
- ✅ La contraseña esté hasheada correctamente
- ✅ Todos los campos requeridos estén presentes
- ✅ El formato sea correcto
- ✅ El email esté normalizado

---

**Última Actualización:** 2025-12-27  
**Estado:** ⚠️ Requiere acción en backend/MongoDB para hashear contraseña



