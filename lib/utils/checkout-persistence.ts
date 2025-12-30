// lib/utils/checkout-persistence.ts

/**
 * Sistema de persistencia de datos del checkout en sessionStorage
 * Permite recuperar el progreso del checkout si el usuario recarga la página
 */

interface CheckoutPersistenceData {
  bookingId?: string;
  currentStep: 1 | 2 | 3;
  guestInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentInfo?: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    paymentMethod: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  timestamp: number;
}

const STORAGE_KEY = 'checkout_persistence';
const EXPIRATION_MS = 2 * 60 * 60 * 1000; // 2 horas

/**
 * Guardar datos del checkout en sessionStorage
 */
export function saveCheckoutData(data: Partial<CheckoutPersistenceData>): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getCheckoutData();
    const merged: CheckoutPersistenceData = {
      ...existing,
      ...data,
      timestamp: Date.now(),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    console.log('💾 [CHECKOUT PERSISTENCE] Datos guardados:', {
      bookingId: merged.bookingId,
      currentStep: merged.currentStep,
    });
  } catch (error) {
    console.error('❌ [CHECKOUT PERSISTENCE] Error guardando datos:', error);
  }
}

/**
 * Obtener datos del checkout desde sessionStorage
 */
export function getCheckoutData(): Partial<CheckoutPersistenceData> | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: CheckoutPersistenceData = JSON.parse(stored);

    // Verificar expiración
    const now = Date.now();
    if (now - data.timestamp > EXPIRATION_MS) {
      clearCheckoutData();
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ [CHECKOUT PERSISTENCE] Error leyendo datos:', error);
    return null;
  }
}

/**
 * Limpiar datos del checkout de sessionStorage
 */
export function clearCheckoutData(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ [CHECKOUT PERSISTENCE] Datos limpiados');
  } catch (error) {
    console.error('❌ [CHECKOUT PERSISTENCE] Error limpiando datos:', error);
  }
}

/**
 * Guardar paso actual del checkout
 */
export function saveCheckoutStep(step: 1 | 2 | 3): void {
  saveCheckoutData({ currentStep: step });
}

/**
 * Guardar información del huésped
 */
export function saveGuestInfo(guestInfo: CheckoutPersistenceData['guestInfo']): void {
  saveCheckoutData({ guestInfo });
}

/**
 * Guardar información de pago
 */
export function savePaymentInfo(paymentInfo: CheckoutPersistenceData['paymentInfo']): void {
  saveCheckoutData({ paymentInfo });
}

/**
 * Guardar dirección de facturación
 */
export function saveBillingAddress(billingAddress: CheckoutPersistenceData['billingAddress']): void {
  saveCheckoutData({ billingAddress });
}

/**
 * Guardar ID de reserva
 */
export function saveBookingId(bookingId: string): void {
  saveCheckoutData({ bookingId });
}

