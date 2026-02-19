// lib/auth/mock-users-db-stub.ts
// 
// STUB VACÍO - Archivo MOCK eliminado por solicitud del usuario
// Este archivo solo exporta funciones vacías para evitar errores de compilación
// en otros módulos que aún no están completamente integrados.
//
// NOTA: Este archivo NO contiene datos MOCK. Los módulos de auth y usuario
// están completamente integrados con la API REST real.

import { User } from '@/types/auth';

/**
 * USUARIOS MOCK - ELIMINADO
 * 
 * Este array está vacío. Los módulos de auth y usuario usan la API REST real.
 * Si otros módulos (notifications, favorites, dashboard) necesitan datos de usuario,
 * deben obtenerlos de la API REST o del contexto de autenticación.
 */
export const MOCK_USERS: User[] = [];

/**
 * Utilidad para buscar usuario por ID
 * 
 * RETORNA: undefined (siempre)
 * 
 * NOTA: Esta función está vacía porque los datos MOCK fueron eliminados.
 * Los módulos que necesiten datos de usuario deben usar:
 * - useAuth() para obtener el usuario actual
 * - API REST para obtener otros usuarios
 */
export function findUserById(id: string): User | undefined {
  return undefined;
}















