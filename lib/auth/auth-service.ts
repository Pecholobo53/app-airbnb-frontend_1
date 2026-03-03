// lib/auth/auth-service.ts

import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  PasswordRecoveryData,
  ResetPasswordData,
  User,
  AuthSession,
  type AuthError
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<AuthResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const session = typeof window !== 'undefined' 
      ? sessionStorage.getItem('airbnb_session') 
      : null;
    
    let token: string | null = null;

    if (session) {
      try {
        const parsed = JSON.parse(session);
        token = parsed.token || parsed.accessToken;
      } catch {
        console.error('Error parseando sesión');
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (fetchError) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `No se pudo conectar al backend en ${API_BASE_URL}. Verifica que el servidor esté corriendo.`,
        },
      };
    }

    const contentType = response.headers.get('content-type');
    let data: any;

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Respuesta no JSON');
      }
    } catch {
      return {
        success: false,
        error: {
          code: response.status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR',
          message: `Respuesta inválida del servidor (HTTP ${response.status}).`,
        },
      };
    }

    if (!response.ok) {
      let errorCode: AuthError = 'SERVER_ERROR';
      let errorMessage =
        data?.error?.message ||
        data?.message ||
        'Error en la petición';

      if (response.status === 401) {
        errorCode = 'UNAUTHORIZED';
        errorMessage =
          data?.error?.message ||
          'Credenciales inválidas.';
      } else if (response.status === 404) {
        errorCode = 'NOT_FOUND';
      } else if (response.status === 409) {
        errorCode = 'CONFLICT';
      }

      return {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }

    let userData = null;
    let accessToken = null;

    if (data.accessToken) accessToken = data.accessToken;
    if (data.token) accessToken = data.token;
    if (data.data?.accessToken) accessToken = data.data.accessToken;
    if (data.data?.token) accessToken = data.data.token;

    if (data.data?.user) userData = data.data.user;
    else if (data.user) userData = data.user;
    else if (data.data) userData = data.data;
    else userData = data;

    if (accessToken && userData) {
      userData = { ...userData, accessToken };
    }

    if (!userData) {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Respuesta inválida del servidor.',
        },
      };
    }

    return {
      success: true,
      data: userData,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Error de conexión.',
      },
    };
  }
}

export class AuthService {

  static async register(data: RegisterData): Promise<AuthResponse<User>> {
    return apiRequest<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse<AuthSession>> {
    return apiRequest<AuthSession>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async logout(): Promise<void> {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  }

  static async requestPasswordRecovery(data: PasswordRecoveryData): Promise<AuthResponse<void>> {
    return apiRequest<void>('/api/auth/recovery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async resetPassword(data: ResetPasswordData): Promise<AuthResponse<void>> {
    return apiRequest<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async verifyEmail(token: string): Promise<AuthResponse<void>> {
    return apiRequest<void>(`/api/auth/verify-email/${token}`, {
      method: 'GET',
    });
  }

  static async loginWithGoogleCode(code: string): Promise<AuthResponse<AuthSession>> {
    const REDIRECT_URI = 'https://www.voyageraumaroc.net';

    return apiRequest<AuthSession>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });
  }

  static async getProfile(): Promise<AuthResponse<User>> {
    return apiRequest<User>('/api/auth/me', {
      method: 'GET',
    });
  }

  static async verifyToken(): Promise<AuthResponse<{ valid: boolean; user?: User }>> {
    return apiRequest<{ valid: boolean; user?: User }>('/api/auth/verify', {
      method: 'GET',
    });
  }
}