// types/auth.ts

/**
 * TIPOS DE AUTENTICACIÓN
 * 
 * Este archivo contiene todas las interfaces y tipos TypeScript
 * para el módulo de autenticación.
 */

/**
 * Modelo de Usuario
 * Representa un usuario registrado en la plataforma
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  provider: 'email' | 'google' | 'facebook';
  favorites: string[];  // IDs de propiedades favoritas
}

/**
 * Sesión de autenticación
 * Incluye el usuario y su token de acceso
 */
export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: Date;
}

/**
 * Credenciales de inicio de sesión
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Datos de registro de nuevo usuario
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

/**
 * Datos para solicitud de recuperación de contraseña
 */
export interface PasswordRecoveryData {
  email: string;
}

/**
 * Datos para resetear contraseña
 */
export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Datos para actualizar perfil
 */
export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

/**
 * Códigos de error de autenticación
 */
export type AuthError = 
  | 'EMAIL_EXISTS'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'TOKEN_EXPIRED'
  | 'USER_NOT_FOUND'
  | 'WEAK_PASSWORD'
  | 'NETWORK_ERROR';

/**
 * Respuesta estándar de servicios de autenticación
 */
export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: AuthError;
    message: string;
  };
}
