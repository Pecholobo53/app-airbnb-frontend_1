// types/checkout.ts

import { Property, PriceBreakdown } from '@/types/search';

/**
 * TIPOS DE CHECKOUT
 * 
 * Este archivo contiene todas las interfaces TypeScript
 * para el módulo de checkout y proceso de reserva.
 */

/**
 * Método de pago disponible
 */
export type PaymentMethod = 'card' | 'paypal' | 'bank_transfer';

/**
 * Información del huésped para checkout
 */
export interface GuestInfo {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Información de pago (MOCK - no procesa pagos reales)
 */
export interface PaymentInfo {
  method: PaymentMethod;
  // Para tarjeta
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string; // MM/YY
  cvv?: string;
  // Para PayPal
  paypalEmail?: string;
  // Para transferencia bancaria
  bankAccount?: string;
}

/**
 * Datos completos de checkout
 */
export interface CheckoutData {
  propertyId: string;
  property: Property;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  pricing: PriceBreakdown;
  guestInfo?: GuestInfo;
  paymentInfo?: PaymentInfo;
  createdAt: Date;
  expiresAt: Date; // Sesión expira después de 30 minutos
}

/**
 * Sesión de checkout (almacenada temporalmente)
 */
export interface CheckoutSession {
  id: string;
  userId: string;
  data: CheckoutData;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Respuesta del servicio de checkout
 */
export interface CheckoutResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

