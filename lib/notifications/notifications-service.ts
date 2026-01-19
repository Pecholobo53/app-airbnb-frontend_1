// lib/notifications/notifications-service.ts

import { Notification, GetNotificationsOptions, NotificationsResponse } from '@/types/notifications';
import { ApiResponse } from '@/lib/bookings/booking-service'; // Reusing ApiResponse type

// En desarrollo usamos URL relativa para pasar por el proxy de Next.js (evita CORS)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
  : '';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const sessionStr = sessionStorage.getItem('airbnb_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.accessToken) {
        return session.accessToken;
      }
    }
  } catch (error) {
    console.warn('⚠️ [NOTIFICATIONS SERVICE] Error leyendo sessionStorage:', error);
  }
  return localStorage.getItem('token') || localStorage.getItem('authToken');
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔔 [NOTIFICATIONS SERVICE] ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return { success: true } as ApiResponse<T>;
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { success: response.ok, message: response.statusText };
    }

    if (!response.ok) {
      let errorMessage = data.message || data.error?.message || data.error || `Error ${response.status}`;
      let errorCode = data.code || data.error?.code || `HTTP_${response.status}`;

      switch (response.status) {
        case 401:
          errorCode = 'UNAUTHORIZED';
          errorMessage = 'Tu sesión expiró. Por favor, inicia sesión de nuevo.';
          break;
        case 403:
          errorCode = 'FORBIDDEN';
          errorMessage = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          errorCode = 'NOT_FOUND';
          errorMessage = data.message || 'Recurso no encontrado. El servicio de notificaciones no está disponible.';
          break;
        case 409:
          errorCode = 'CONFLICT';
          errorMessage = data.message || 'Conflicto al procesar la solicitud.';
          break;
        case 422:
          errorCode = 'VALIDATION_ERROR';
          errorMessage = data.message || 'Los datos proporcionados no son válidos.';
          break;
        case 429:
          errorCode = 'RATE_LIMIT';
          errorMessage = 'Demasiadas solicitudes. Por favor, espera un momento.';
          break;
        case 500:
          errorCode = 'SERVER_ERROR';
          errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
          break;
        default:
          if (data.code || data.error?.code) {
            errorCode = data.code || data.error.code;
          }
          if (data.message || data.error?.message) {
            errorMessage = data.message || data.error.message;
          }
      }

      return {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }

    if (data.success !== undefined) {
      return {
        success: data.success,
        data: data.data || data,
        error: data.error ? {
          code: data.error.code,
          message: data.error.message || data.error,
        } : undefined,
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error(`❌ [NOTIFICATIONS SERVICE] Error en ${endpoint}:`, error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Error de conexión',
      },
    };
  }
}

interface NotificationsListResponse {
  notifications: Notification[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export class NotificationsService {
  /**
   * OBTENER NOTIFICACIONES DEL USUARIO
   * 
   * Endpoint: GET /api/notifications?page={page}&limit={limit}&read={read}
   * 
   * @param options - Opciones de paginación y filtrado
   * @returns Lista de notificaciones con metadata de paginación
   */
  static async getNotifications(
    options: {
      page?: number;
      limit?: number;
      read?: boolean;
    } = {}
  ): Promise<ApiResponse<NotificationsResponse>> {
    const { page = 1, limit = 20, read } = options;
    
    console.log('🔔 [NOTIFICATIONS SERVICE] Obteniendo notificaciones', { page, limit, read });
    
    let queryParams = `page=${page}&limit=${limit}`;
    if (read !== undefined) {
      queryParams += `&read=${read}`;
    }
    
    const response = await apiRequest<NotificationsListResponse>(
      `/api/notifications?${queryParams}`
    );
    
    if (!response.success) {
      return response;
    }
    
    const data = response.data as any;
    const notifications = data?.notifications || data || [];
    
    // Convertir fechas de string a Date
    const notificationsWithDates = Array.isArray(notifications)
      ? notifications.map((notif: any) => ({
          ...notif,
          createdAt: notif.createdAt ? new Date(notif.createdAt) : new Date(),
        }))
      : [];
    
    const unreadCount = data?.unreadCount ?? notificationsWithDates.filter((n: Notification) => !n.read).length;
    const total = data?.total ?? notificationsWithDates.length;
    
    console.log(`✅ [NOTIFICATIONS SERVICE] Encontradas ${notificationsWithDates.length} notificaciones (${unreadCount} no leídas)`);
    
    return {
      success: true,
      data: {
        notifications: notificationsWithDates,
        total,
        unreadCount,
      },
    };
  }

  /**
   * OBTENER CONTADOR DE NOTIFICACIONES NO LEÍDAS
   * 
   * Endpoint: GET /api/notifications/unread-count
   * 
   * @returns Contador de notificaciones no leídas
   */
  static async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    console.log('🔔 [NOTIFICATIONS SERVICE] Obteniendo contador de no leídas');
    
    const response = await apiRequest<{ unreadCount: number }>(
      '/api/notifications/unread-count'
    );
    
    if (!response.success) {
      return response;
    }
    
    const unreadCount = (response.data as any)?.unreadCount ?? 0;
    console.log(`✅ [NOTIFICATIONS SERVICE] Contador de no leídas: ${unreadCount}`);
    
    return {
      success: true,
      data: { unreadCount },
    };
  }

  /**
   * MARCAR NOTIFICACIÓN COMO LEÍDA
   * 
   * Endpoint: PUT /api/notifications/:id/read
   * 
   * @param notificationId - ID de la notificación a marcar como leída
   * @returns Notificación actualizada
   */
  static async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    console.log('🔔 [NOTIFICATIONS SERVICE] Marcando como leída:', notificationId);
    
    const response = await apiRequest<{ notification: Notification }>(
      `/api/notifications/${notificationId}/read`,
      { method: 'PUT' }
    );
    
    if (!response.success) {
      return response;
    }
    
    const notification = (response.data as any)?.notification || response.data;
    const notificationWithDate = {
      ...notification,
      createdAt: notification.createdAt ? new Date(notification.createdAt) : new Date(),
    };
    
    console.log('✅ [NOTIFICATIONS SERVICE] Notificación marcada como leída');
    return {
      success: true,
      data: notificationWithDate,
    };
  }

  /**
   * MARCAR TODAS LAS NOTIFICACIONES COMO LEÍDAS
   * 
   * Endpoint: PUT /api/notifications/mark-all-read
   * 
   * @returns Número de notificaciones marcadas como leídas
   */
  static async markAllAsRead(): Promise<ApiResponse<{ count: number }>> {
    console.log('🔔 [NOTIFICATIONS SERVICE] Marcando todas como leídas');
    
    const response = await apiRequest<{ count: number }>(
      '/api/notifications/mark-all-read',
      { method: 'PUT' }
    );
    
    if (!response.success) {
      return response;
    }
    
    const count = (response.data as any)?.count ?? 0;
    console.log(`✅ [NOTIFICATIONS SERVICE] ${count} notificaciones marcadas como leídas`);
    
    return {
      success: true,
      data: { count },
    };
  }

  /**
   * ELIMINAR NOTIFICACIÓN
   * 
   * Endpoint: DELETE /api/notifications/:id
   * 
   * @param notificationId - ID de la notificación a eliminar
   * @returns Éxito de la operación
   */
  static async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    console.log('🔔 [NOTIFICATIONS SERVICE] Eliminando notificación:', notificationId);
    
    const response = await apiRequest<void>(
      `/api/notifications/${notificationId}`,
      { method: 'DELETE' }
    );
    
    if (!response.success) {
      return response;
    }
    
    console.log('✅ [NOTIFICATIONS SERVICE] Notificación eliminada');
    return { success: true };
  }
}

