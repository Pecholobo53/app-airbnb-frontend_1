// lib/auth/validators.ts

import { z } from 'zod';

/**
 * SCHEMA DE VALIDACIÓN PARA LOGIN
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * SCHEMA DE VALIDACIÓN PARA REGISTRO
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .trim(),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * SCHEMA DE VALIDACIÓN PARA RECUPERACIÓN DE CONTRASEÑA
 */
export const passwordRecoverySchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .toLowerCase()
    .trim(),
});

export type PasswordRecoveryFormData = z.infer<typeof passwordRecoverySchema>;

/**
 * SCHEMA DE VALIDACIÓN PARA RESETEAR CONTRASEÑA
 */
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * SCHEMA DE VALIDACIÓN PARA ACTUALIZAR PERFIL
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras')
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{9,20}$/, 'Número de teléfono inválido')
    .optional()
    .or(z.literal('')),
  avatar: z
    .string()
    .url('URL de avatar inválida')
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

/**
 * UTILIDAD: CALCULAR FORTALEZA DE CONTRASEÑA
 */
export interface PasswordStrength {
  score: number;
  label: 'Muy débil' | 'Débil' | 'Media' | 'Fuerte' | 'Muy fuerte';
  color: string;
  percentage: number;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  score = Math.min(score, 4);

  const labels: Array<'Muy débil' | 'Débil' | 'Media' | 'Fuerte' | 'Muy fuerte'> = [
    'Muy débil',
    'Débil',
    'Media',
    'Fuerte',
    'Muy fuerte',
  ];
  
  const colors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#84cc16',
    '#22c55e',
  ];

  return {
    score,
    label: labels[score],
    color: colors[score],
    percentage: (score / 4) * 100,
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getFieldError(errors: any, fieldName: string): string | undefined {
  return errors?.[fieldName]?.message;
}
