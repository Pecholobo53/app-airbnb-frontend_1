// lib/utils/admin.ts

import { User } from '@/types/auth';

/**
 * ADMIN UTILITIES
 * 
 * Funciones auxiliares para verificar permisos de administrador
 */

/**
 * Lista de emails de administradores conocidos
 * TODO: Esto debería venir del backend o de una configuración
 */
const ADMIN_EMAILS = [
  'juan@example.com',
  'armandito@gmail.com',
] as const;

/**
 * Verifica si un usuario es administrador
 * 
 * @param user - Usuario a verificar
 * @returns true si el usuario es admin, false en caso contrario
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  // Verificación 1: Campo role === 'admin'
  if (user.role === 'admin') {
    return true;
  }

  // Verificación 2: Email en lista de admins conocidos
  if (ADMIN_EMAILS.includes(user.email as any)) {
    return true;
  }

  return false;
}

/**
 * Verifica permisos de admin haciendo una llamada al backend
 * 
 * @param token - Token JWT del usuario
 * @returns Promise<boolean> - true si el usuario tiene permisos de admin
 */
export async function verifyAdminAccess(token: string): Promise<boolean> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
    
    // Intentar acceder a un endpoint de admin
    const response = await fetch(`${API_BASE_URL}/api/users?limit=1&offset=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Si el endpoint responde 200, el usuario tiene permisos de admin
    // Si responde 403, no tiene permisos
    // Si responde 401, no está autenticado
    return response.ok;
  } catch (error) {
    console.error('Error verificando permisos de admin:', error);
    return false;
  }
}



