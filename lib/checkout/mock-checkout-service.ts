// lib/checkout/mock-checkout-service.ts

import {
  CheckoutData,
  CheckoutResponse,
  CheckoutSession,
  GuestInfo,
  PaymentInfo,
} from '@/types/checkout';
import {
  createCheckoutSession,
  getCheckoutSession,
  updateCheckoutSession,
  deleteCheckoutSession,
} from './mock-checkout-db';
import { DashboardService } from '@/lib/dashboard/dashboard-service';
import { calculatePriceBreakdown } from '@/lib/pricing/calculate-price';

/**
 * SERVICIO MOCK DE CHECKOUT
 * 
 * Contexto:
 * Simula un servicio completo de checkout que maneja:
 * - Creación de sesiones de checkout
 * - Actualización de información del huésped
 * - Procesamiento de pagos (simulado)
 * - Confirmación de reservas
 * 
 * Flujo:
 * 1. Usuario selecciona fechas/huéspedes en página de detalle
 * 2. Se crea sesión de checkout con datos iniciales
 * 3. Usuario completa información en página de checkout
 * 4. Se actualiza sesión con info del huésped
 * 5. Usuario selecciona método de pago y completa datos
 * 6. Se procesa pago (simulado)
 * 7. Se confirma reserva y se crea booking
 * 8. Se elimina sesión de checkout
 * 
 * Notas:
 * - Todos los pagos son simulados (no procesa pagos reales)
 * - Las sesiones expiran después de 30 minutos
 * - Integra con DashboardService para crear reservas (API REST real)
 */

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockCheckoutService {
  /**
   * CREAR SESIÓN DE CHECKOUT
   * 
   * Crea una nueva sesión de checkout con los datos iniciales
   * (propiedad, fechas, huéspedes, precios)
   */
  static async createSession(
    userId: string,
    data: Omit<CheckoutData, 'createdAt' | 'expiresAt'>
  ): Promise<CheckoutResponse<CheckoutSession>> {
    try {
      await delay(200 + Math.random() * 200); // 200-400ms

      // Validar datos básicos
      if (!data.propertyId || !data.checkIn || !data.checkOut) {
        return {
          success: false,
          error: {
            code: 'INVALID_DATA',
            message: 'Datos de checkout inválidos',
          },
        };
      }

      // Validar fechas
      if (data.checkOut <= data.checkIn) {
        return {
          success: false,
          error: {
            code: 'INVALID_DATES',
            message: 'La fecha de salida debe ser posterior a la entrada',
          },
        };
      }

      // Crear sesión
      const session = createCheckoutSession(userId, data as CheckoutData);

      return {
        success: true,
        data: session,
      };
    } catch (error) {
      console.error('❌ [CHECKOUT] Error creando sesión:', error);
      return {
        success: false,
        error: {
          code: 'CREATE_SESSION_ERROR',
          message: 'Error al crear sesión de checkout',
        },
      };
    }
  }

  /**
   * OBTENER SESIÓN DE CHECKOUT
   * 
   * Obtiene una sesión existente por su ID
   */
  static async getSession(
    sessionId: string
  ): Promise<CheckoutResponse<CheckoutSession>> {
    try {
      await delay(100 + Math.random() * 100); // 100-200ms

      const session = getCheckoutSession(sessionId);

      if (!session) {
        return {
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Sesión no encontrada o expirada',
          },
        };
      }

      return {
        success: true,
        data: session,
      };
    } catch (error) {
      console.error('❌ [CHECKOUT] Error obteniendo sesión:', error);
      return {
        success: false,
        error: {
          code: 'GET_SESSION_ERROR',
          message: 'Error al obtener sesión de checkout',
        },
      };
    }
  }

  /**
   * ACTUALIZAR INFORMACIÓN DEL HUÉSPED
   * 
   * Actualiza los datos del huésped en la sesión de checkout
   */
  static async updateGuestInfo(
    sessionId: string,
    guestInfo: GuestInfo
  ): Promise<CheckoutResponse<CheckoutSession>> {
    try {
      await delay(150 + Math.random() * 100); // 150-250ms

      // Validar información del huésped
      if (!guestInfo.name || !guestInfo.email) {
        return {
          success: false,
          error: {
            code: 'INVALID_GUEST_INFO',
            message: 'Nombre y email son requeridos',
          },
        };
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestInfo.email)) {
        return {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Email inválido',
          },
        };
      }

      // Actualizar sesión
      const updated = updateCheckoutSession(sessionId, { guestInfo });

      if (!updated) {
        return {
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Sesión no encontrada o expirada',
          },
        };
      }

      return {
        success: true,
        data: updated,
      };
    } catch (error) {
      console.error('❌ [CHECKOUT] Error actualizando info del huésped:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_GUEST_INFO_ERROR',
          message: 'Error al actualizar información del huésped',
        },
      };
    }
  }

  /**
   * PROCESAR PAGO (SIMULADO)
   * 
   * Simula el procesamiento de un pago.
   * En producción, esto llamaría a una pasarela de pago real (Stripe, PayPal, etc.)
   */
  static async processPayment(
    sessionId: string,
    paymentInfo: PaymentInfo
  ): Promise<CheckoutResponse<{ paymentId: string; status: string }>> {
    try {
      await delay(500 + Math.random() * 500); // 500-1000ms (simular procesamiento)

      // Validar información de pago (solo tarjeta ahora)
      if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        return {
          success: false,
          error: {
            code: 'INVALID_PAYMENT_INFO',
            message: 'Información de tarjeta incompleta',
          },
        };
      }

      // Validar dirección de facturación
      if (!paymentInfo.billingAddress) {
        return {
          success: false,
          error: {
            code: 'MISSING_BILLING_ADDRESS',
            message: 'Dirección de facturación requerida',
          },
        };
      }

      // Validar formato de tarjeta (básico)
      const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        return {
          success: false,
          error: {
            code: 'INVALID_CARD_NUMBER',
            message: 'Número de tarjeta inválido',
          },
        };
      }

      // Validar CVV
      if (paymentInfo.cvv.length < 3 || paymentInfo.cvv.length > 4) {
        return {
          success: false,
          error: {
            code: 'INVALID_CVV',
            message: 'CVV inválido',
          },
        };
      }

      // Simular éxito de pago
      const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Actualizar sesión con información de pago
      updateCheckoutSession(sessionId, { paymentInfo });

      console.log(`💳 [CHECKOUT] Pago simulado procesado: ${paymentId}`);

      return {
        success: true,
        data: {
          paymentId,
          status: 'completed',
        },
      };
    } catch (error) {
      console.error('❌ [CHECKOUT] Error procesando pago:', error);
      return {
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: 'Error al procesar el pago',
        },
      };
    }
  }

  /**
   * CONFIRMAR RESERVA
   * 
   * Confirma la reserva final, crea el booking y elimina la sesión de checkout
   */
  static async confirmBooking(
    sessionId: string
  ): Promise<CheckoutResponse<{ bookingId: string }>> {
    try {
      await delay(300 + Math.random() * 200); // 300-500ms

      // Obtener sesión
      const sessionResponse = await this.getSession(sessionId);
      if (!sessionResponse.success || !sessionResponse.data) {
        return {
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Sesión no encontrada o expirada',
          },
        };
      }

      const session = sessionResponse.data;
      const { data } = session;

      // Validar que tiene toda la información necesaria
      if (!data.guestInfo) {
        return {
          success: false,
          error: {
            code: 'MISSING_GUEST_INFO',
            message: 'Información del huésped requerida',
          },
        };
      }

      if (!data.paymentInfo) {
        return {
          success: false,
          error: {
            code: 'MISSING_PAYMENT_INFO',
            message: 'Información de pago requerida',
          },
        };
      }

      // Crear reserva usando DashboardService
      const bookingResponse = await DashboardService.createBooking(
        session.userId,
        data.propertyId,
        data.checkIn,
        data.checkOut,
        data.guests,
        {
          basePrice: data.pricing.basePrice,
          nightsTotal: data.pricing.subtotal,
          cleaningFee: data.pricing.cleaningFee,
          serviceFee: data.pricing.serviceFee,
          total: data.pricing.total,
        }
      );

      if (!bookingResponse.success || !bookingResponse.data) {
        return {
          success: false,
          error: {
            code: 'CREATE_BOOKING_ERROR',
            message: bookingResponse.error?.message || 'Error al crear la reserva',
          },
        };
      }

      // Eliminar sesión de checkout
      deleteCheckoutSession(sessionId);

      console.log(`✅ [CHECKOUT] Reserva confirmada: ${bookingResponse.data.id}`);

      return {
        success: true,
        data: {
          bookingId: bookingResponse.data.id,
        },
      };
    } catch (error) {
      console.error('❌ [CHECKOUT] Error confirmando reserva:', error);
      return {
        success: false,
        error: {
          code: 'CONFIRM_BOOKING_ERROR',
          message: 'Error al confirmar la reserva',
        },
      };
    }
  }
}

// Export default para uso simple
export default MockCheckoutService;

