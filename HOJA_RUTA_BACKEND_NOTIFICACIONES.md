# 🔔 HOJA DE RUTA BACKEND - SISTEMA DE NOTIFICACIONES

## Fase 2: Implementación Backend (API REST)

El frontend ya está implementado con localStorage como fallback. Este documento describe cómo implementar el backend para sincronización real.

---

## 📋 RESUMEN

| Componente | Frontend (Fase 1) ✅ | Backend (Fase 2) 🔜 |
|------------|---------------------|---------------------|
| Almacenamiento | localStorage | MongoDB |
| Sincronización | Una pestaña | Multi-dispositivo |
| Triggers | Manuales | Automáticos (eventos) |
| Real-time | Polling | WebSocket (opcional) |

---

## 🗄️ MODELO DE DATOS

### Notification (MongoDB Schema)

```javascript
// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: [
      'booking_confirmed',
      'booking_cancelled',
      'booking_reminder',
      'favorite_price_drop',
      'favorite_available',
      'message_received',
      'security_alert',
      'promotion',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxLength: 200,
  },
  message: {
    type: String,
    required: true,
    maxLength: 500,
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  link: {
    type: String,
    maxLength: 500,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Índice compuesto para consultas frecuentes
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// TTL: eliminar notificaciones después de 30 días
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Notification', notificationSchema);
```

---

## 🛣️ API REST ENDPOINTS

### Base URL: `/api/notifications`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/notifications` | Listar notificaciones del usuario |
| GET | `/api/notifications/unread-count` | Obtener contador de no leídas |
| PATCH | `/api/notifications/:id/read` | Marcar una como leída |
| PATCH | `/api/notifications/read-all` | Marcar todas como leídas |
| DELETE | `/api/notifications/:id` | Eliminar notificación |

---

### GET /api/notifications

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `read` (boolean, opcional) - Filtrar por estado
- `type` (string, opcional) - Filtrar por tipo

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "64f...",
        "type": "booking_confirmed",
        "title": "¡Reserva confirmada! 🎉",
        "message": "Tu reserva en \"Casa Bonita\" ha sido confirmada.",
        "read": false,
        "link": "/mis-reservas",
        "metadata": {
          "propertyName": "Casa Bonita",
          "checkIn": "15 de febrero",
          "bookingId": "abc123"
        },
        "createdAt": "2026-01-20T10:30:00.000Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

---

### PATCH /api/notifications/:id/read

**Response:**
```json
{
  "success": true,
  "data": {
    "notification": { /* updated notification */ }
  }
}
```

---

### PATCH /api/notifications/read-all

**Response:**
```json
{
  "success": true,
  "data": {
    "modifiedCount": 5
  }
}
```

---

## 📁 ESTRUCTURA DE ARCHIVOS BACKEND

```
📁 airbnb-backend/
├── models/
│   └── Notification.js           ← Modelo MongoDB
├── routes/
│   └── notificationRoutes.js     ← Rutas Express
├── controllers/
│   └── notificationController.js ← Lógica de endpoints
└── services/
    └── notificationService.js    ← Triggers y lógica de negocio
```

---

## 🎯 IMPLEMENTACIÓN CONTROLLER

```javascript
// controllers/notificationController.js
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read, type } = req.query;
    const userId = req.user.id;

    const filter = { userId };
    if (read !== undefined) filter.read = read === 'true';
    if (type) filter.type = type;

    const skip = (page - 1) * Math.min(limit, 100);
    
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.min(limit, 100)),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId, read: false }),
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al obtener notificaciones' },
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { message: 'Notificación no encontrada' },
      });
    }

    res.json({ success: true, data: { notification } });
  } catch (error) {
    console.error('Error marcando como leída:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al marcar como leída' },
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.json({ success: true, data: { modifiedCount: result.modifiedCount } });
  } catch (error) {
    console.error('Error marcando todas como leídas:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al marcar todas como leídas' },
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { message: 'Notificación no encontrada' },
      });
    }

    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error al eliminar notificación' },
    });
  }
};
```

---

## 🎯 IMPLEMENTACIÓN SERVICE (Triggers)

```javascript
// services/notificationService.js
const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Crear notificación de reserva confirmada
   */
  static async bookingConfirmed(userId, booking, property) {
    const checkIn = new Date(booking.checkIn).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });

    return await Notification.create({
      userId,
      type: 'booking_confirmed',
      title: '¡Reserva confirmada! 🎉',
      message: `Tu reserva en "${property.title}" para el ${checkIn} ha sido confirmada.`,
      link: '/mis-reservas',
      metadata: {
        propertyName: property.title,
        propertyId: property._id,
        bookingId: booking._id,
        checkIn,
      },
    });
  }

  /**
   * Crear notificación de reserva cancelada
   */
  static async bookingCancelled(userId, booking, property, reason) {
    return await Notification.create({
      userId,
      type: 'booking_cancelled',
      title: 'Reserva cancelada',
      message: `Tu reserva en "${property.title}" ha sido cancelada.${reason ? ` Motivo: ${reason}` : ''}`,
      link: '/mis-reservas',
      metadata: {
        propertyName: property.title,
        propertyId: property._id,
        bookingId: booking._id,
        reason,
      },
    });
  }

  /**
   * Crear notificación de recordatorio check-in
   * (Llamar desde cron job)
   */
  static async checkInReminder(userId, booking, property, daysUntil) {
    const checkIn = new Date(booking.checkIn).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });

    const title = daysUntil === 1 
      ? '¡Mañana comienza tu viaje! ✈️' 
      : `Tu viaje es en ${daysUntil} días`;

    return await Notification.create({
      userId,
      type: 'booking_reminder',
      title,
      message: `Recuerda: tu estancia en "${property.title}" comienza el ${checkIn}.`,
      link: '/mis-reservas',
      metadata: {
        propertyName: property.title,
        propertyId: property._id,
        bookingId: booking._id,
        checkIn,
        daysUntil,
      },
    });
  }

  /**
   * Crear notificación de bajada de precio en favorito
   */
  static async favoritePriceDrop(userId, property, oldPrice, newPrice) {
    const discount = Math.round((1 - newPrice / oldPrice) * 100);

    return await Notification.create({
      userId,
      type: 'favorite_price_drop',
      title: '¡Bajada de precio! 💰',
      message: `"${property.title}" ahora a €${newPrice}/noche (antes €${oldPrice}). ¡${discount}% de descuento!`,
      link: `/propiedad/${property._id}`,
      metadata: {
        propertyName: property.title,
        propertyId: property._id,
        oldPrice,
        newPrice,
        discount,
      },
    });
  }

  /**
   * Crear notificación de bienvenida
   */
  static async welcomeUser(userId, discountPercent = 15) {
    return await Notification.create({
      userId,
      type: 'promotion',
      title: '¡Bienvenido a Airbnb! 🎁',
      message: `Como nuevo usuario, tienes ${discountPercent}% de descuento en tu primera reserva. ¡Explora y reserva!`,
      link: '/buscar',
      metadata: {
        discountPercent,
        code: `WELCOME${discountPercent}`,
      },
    });
  }
}

module.exports = NotificationService;
```

---

## 🔗 INTEGRACIÓN CON EVENTOS

### En bookingController.js (cuando se confirma pago):

```javascript
const NotificationService = require('../services/notificationService');

// Después de confirmar el pago exitosamente:
await NotificationService.bookingConfirmed(
  booking.guestId, 
  booking, 
  property
);
```

### En userController.js (cuando se registra usuario):

```javascript
const NotificationService = require('../services/notificationService');

// Después de crear el usuario:
await NotificationService.welcomeUser(newUser._id, 15);
```

---

## ⏰ CRON JOB PARA RECORDATORIOS

```javascript
// jobs/checkInReminders.js
const cron = require('node-cron');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const NotificationService = require('../services/notificationService');

// Ejecutar todos los días a las 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Ejecutando cron de recordatorios de check-in...');
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  // Buscar reservas con check-in mañana
  const bookings = await Booking.find({
    checkIn: { $gte: tomorrow, $lt: dayAfterTomorrow },
    status: 'confirmed',
  }).populate('propertyId');

  for (const booking of bookings) {
    try {
      await NotificationService.checkInReminder(
        booking.guestId,
        booking,
        booking.propertyId,
        1 // mañana
      );
      console.log(`✅ Recordatorio enviado a usuario ${booking.guestId}`);
    } catch (error) {
      console.error(`❌ Error enviando recordatorio:`, error);
    }
  }
  
  console.log(`🔔 Cron completado: ${bookings.length} recordatorios enviados`);
});
```

---

## 🔄 ACTIVAR BACKEND EN FRONTEND

Cuando el backend esté listo, cambiar en `lib/notifications/notification-context.tsx`:

```typescript
// Cambiar de:
const USE_BACKEND = false;

// A:
const USE_BACKEND = true;
```

El frontend automáticamente:
1. Intentará cargar desde backend
2. Si falla, usará localStorage como fallback
3. Sincronizará cambios con backend en segundo plano

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend:
- [ ] Crear modelo `Notification.js`
- [ ] Crear `notificationRoutes.js`
- [ ] Crear `notificationController.js`
- [ ] Crear `notificationService.js`
- [ ] Integrar trigger en `bookingController.js` (confirmar pago)
- [ ] Integrar trigger en `userController.js` (registro)
- [ ] Configurar cron job de recordatorios
- [ ] Probar endpoints con Postman

### Frontend:
- [ ] Cambiar `USE_BACKEND = true`
- [ ] Probar flujo completo
- [ ] Verificar fallback a localStorage

---

## 📝 NOTAS ADICIONALES

1. **Rate limiting:** Limitar creación de notificaciones para evitar spam
2. **Limpieza:** El TTL de MongoDB auto-elimina notificaciones antiguas
3. **WebSocket (futuro):** Para notificaciones push en tiempo real
4. **Email (futuro):** Enviar email además de notificación in-app

---

**Fecha:** 20 de enero de 2026  
**Estado:** Fase 1 completada (Frontend), Fase 2 pendiente (Backend)
