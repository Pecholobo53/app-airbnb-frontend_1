// lib/utils/checkout-persistence.ts

/**
 * Sistema de persistencia de datos del checkout en sessionStorage
 * Permite recuperar el progreso del checkout si el usuario recarga la página
 */

interface CheckoutPersistenceData {
  bookingId?: string;
  currentStep: 1 | 2 | 3;
  guestInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentInfo?: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    paymentMethod: string;
  };
  billingAddress?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  timestamp: number;
}

const STORAGE_KEY = 'checkout_persistence';
const EXPIRATION_MS = 2 * 60 * 60 * 1000; // 2 horas

export function saveCheckoutData(data: Partial<CheckoutPersistenceData>): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getCheckoutData();
    const base: Partial<CheckoutPersistenceData> = existing ?? {};
    const merged: CheckoutPersistenceData = {
      ...base,
      ...data,
      currentStep: data.currentStep ?? base.currentStep ?? 1,
      timestamp: Date.now(),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
  }
}

export function getCheckoutData(): Partial<CheckoutPersistenceData> | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: CheckoutPersistenceData = JSON.parse(stored);

    const now = Date.now();
    if (now - data.timestamp > EXPIRATION_MS) {
      clearCheckoutData();
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function clearCheckoutData(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}

export function saveCheckoutStep(step: 1 | 2 | 3): void {
  saveCheckoutData({ currentStep: step });
}

export function saveGuestInfo(guestInfo: CheckoutPersistenceData['guestInfo']): void {
  saveCheckoutData({ guestInfo });
}

export function savePaymentInfo(paymentInfo: CheckoutPersistenceData['paymentInfo']): void {
  saveCheckoutData({ paymentInfo });
}

export function saveBillingAddress(billingAddress: CheckoutPersistenceData['billingAddress']): void {
  saveCheckoutData({ billingAddress });
}

export function saveBookingId(bookingId: string): void {
  saveCheckoutData({ bookingId });
}
