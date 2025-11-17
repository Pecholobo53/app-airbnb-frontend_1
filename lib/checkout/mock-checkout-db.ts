// lib/checkout/mock-checkout-db.ts

import { CheckoutSession, CheckoutData } from '@/types/checkout';

/**
 * BASE DE DATOS MOCK DE CHECKOUT
 * 
 * Contexto:
 * Simula un almacenamiento en memoria para sesiones de checkout temporales.
 * En producción, esto sería una base de datos real o un servicio de sesiones
 * (Redis, MongoDB, etc.) con expiración automática.
 * 
 * Funcionalidad:
 * - Almacena sesiones de checkout en memoria (Map)
 * - Cada sesión expira después de 30 minutos
 * - Limpieza automática de sesiones expiradas
 * - Vinculado con usuarios autenticados
 * 
 * Estructura de Sesión:
 * - id: Identificador único de sesión (session-xxx)
 * - userId: ID del usuario autenticado
 * - data: Datos completos de checkout
 * - createdAt: Fecha de creación
 * - expiresAt: Fecha de expiración (30 min después)
 * 
 * Notas:
 * - Las sesiones se limpian automáticamente al acceder
 * - No persisten entre reinicios del servidor
 * - Ideal para desarrollo y testing
 */

// Almacenamiento en memoria
const CHECKOUT_SESSIONS = new Map<string, CheckoutSession>();

// Tiempo de expiración: 30 minutos
const SESSION_EXPIRY_MS = 30 * 60 * 1000;

/**
 * Generar ID único para sesión
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Limpiar sesiones expiradas
 */
function cleanExpiredSessions(): void {
  const now = new Date();
  const sessionIds = Array.from(CHECKOUT_SESSIONS.keys());
  for (const id of sessionIds) {
    const session = CHECKOUT_SESSIONS.get(id);
    if (session && session.expiresAt < now) {
      CHECKOUT_SESSIONS.delete(id);
      console.log(`🧹 [CHECKOUT] Sesión expirada eliminada: ${id}`);
    }
  }
}

/**
 * Crear nueva sesión de checkout
 */
export function createCheckoutSession(
  userId: string,
  data: CheckoutData
): CheckoutSession {
  // Limpiar sesiones expiradas antes de crear nueva
  cleanExpiredSessions();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRY_MS);

  const session: CheckoutSession = {
    id: generateSessionId(),
    userId,
    data: {
      ...data,
      createdAt: now,
      expiresAt,
    },
    createdAt: now,
    expiresAt,
  };

  CHECKOUT_SESSIONS.set(session.id, session);
  console.log(`✅ [CHECKOUT] Sesión creada: ${session.id} para usuario ${userId}`);

  return session;
}

/**
 * Obtener sesión de checkout por ID
 */
export function getCheckoutSession(sessionId: string): CheckoutSession | null {
  // Limpiar sesiones expiradas
  cleanExpiredSessions();

  const session = CHECKOUT_SESSIONS.get(sessionId);
  
  if (!session) {
    return null;
  }

  // Verificar si está expirada
  if (session.expiresAt < new Date()) {
    CHECKOUT_SESSIONS.delete(sessionId);
    console.log(`⏰ [CHECKOUT] Sesión expirada: ${sessionId}`);
    return null;
  }

  return session;
}

/**
 * Actualizar datos de sesión de checkout
 */
export function updateCheckoutSession(
  sessionId: string,
  updates: Partial<CheckoutData>
): CheckoutSession | null {
  const session = getCheckoutSession(sessionId);
  
  if (!session) {
    return null;
  }

  // Actualizar datos
  session.data = {
    ...session.data,
    ...updates,
  };

  CHECKOUT_SESSIONS.set(sessionId, session);
  console.log(`🔄 [CHECKOUT] Sesión actualizada: ${sessionId}`);

  return session;
}

/**
 * Eliminar sesión de checkout
 */
export function deleteCheckoutSession(sessionId: string): boolean {
  const deleted = CHECKOUT_SESSIONS.delete(sessionId);
  
  if (deleted) {
    console.log(`🗑️ [CHECKOUT] Sesión eliminada: ${sessionId}`);
  }

  return deleted;
}

/**
 * Obtener todas las sesiones de un usuario (para debugging)
 */
export function getUserCheckoutSessions(userId: string): CheckoutSession[] {
  cleanExpiredSessions();
  
  return Array.from(CHECKOUT_SESSIONS.values())
    .filter(session => session.userId === userId);
}

/**
 * Limpiar todas las sesiones (para testing)
 */
export function clearAllSessions(): void {
  CHECKOUT_SESSIONS.clear();
  console.log(`🧹 [CHECKOUT] Todas las sesiones eliminadas`);
}

