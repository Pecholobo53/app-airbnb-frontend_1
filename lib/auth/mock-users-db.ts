// lib/auth/mock-users-db.ts

import { User } from '@/types/auth';

/**
 * BASE DE DATOS MOCK DE USUARIOS
 * 
 * Contexto:
 * Simula una base de datos en memoria con usuarios del sistema.
 * En producción, esto sería una base de datos real (PostgreSQL, MongoDB, etc.)
 * con tablas relacionadas para usuarios, sesiones, tokens, etc.
 * 
 * Contenido:
 * - 4 usuarios de prueba con diferentes estados y proveedores
 * - Datos realistas: nombres, emails, avatares, teléfonos
 * - Estados de verificación variados
 * - Diferentes métodos de autenticación (email, OAuth)
 * 
 * USUARIOS DE PRUEBA:
 * 1. demo@airbnb.com / password123
 *    - Verificado, email, Superhost
 *    - Tiene favoritos y propiedades
 * 
 * 2. maria@gmail.com / maria2024
 *    - Verificado, OAuth Google
 *    - Usuario regular
 * 
 * 3. carlos@outlook.com / carlos123
 *    - NO verificado, email
 *    - Requiere verificación de email
 * 
 * 4. ana@facebook.com (sin contraseña)
 *    - Verificado, OAuth Facebook
 *    - Login solo por OAuth
 * 
 * Estructura de User:
 * - id: Identificador único (user-001, user-002, etc.)
 * - email: Email del usuario (único)
 * - name: Nombre completo
 * - avatar: URL del avatar
 * - phone: Teléfono (opcional)
 * - emailVerified: Estado de verificación de email
 * - createdAt: Fecha de creación de cuenta
 * - updatedAt: Última actualización
 * - provider: Método de autenticación ('email' | 'google' | 'facebook')
 * - favorites: Array de IDs de propiedades favoritas
 * 
 * Datos Adicionales (no en User pero relacionados):
 * - MOCK_PASSWORDS: Mapeo email -> contraseña (en producción: hash en BD)
 * - MOCK_RECOVERY_TOKENS: Tokens activos para recuperación de contraseña
 * - MOCK_VERIFICATION_TOKENS: Tokens activos para verificación de email
 * - MOCK_LOGIN_ATTEMPTS: Registro de intentos fallidos (anti-brute force)
 * 
 * Utilidades:
 * - findUserByEmail(email): Buscar usuario por email
 * - findUserById(id): Buscar usuario por ID
 * - emailExists(email): Verificar si email ya existe
 * - addUser(user): Agregar nuevo usuario
 * - updateUser(id, updates): Actualizar datos de usuario
 * 
 * Seguridad:
 * ⚠️ IMPORTANTE: En producción:
 * - Las contraseñas deben estar hasheadas (bcrypt, argon2)
 * - Los tokens deben estar en base de datos con expiración
 * - Implementar rate limiting para login
 * - Usar HTTPS para todas las comunicaciones
 * - Validar y sanitizar todos los inputs
 */
export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    email: 'demo@airbnb.com',
    name: 'Juan Pérez',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '+34 612 345 678',
    emailVerified: true,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-11-01T15:45:00'),
    provider: 'email',
    favorites: ['prop-1', 'prop-3', 'prop-7'],
  },
  {
    id: 'user-002',
    email: 'maria@gmail.com',
    name: 'María González',
    avatar: 'https://i.pravatar.cc/150?img=45',
    phone: '+34 623 456 789',
    emailVerified: true,
    createdAt: new Date('2024-02-20T14:20:00'),
    updatedAt: new Date('2024-10-15T09:10:00'),
    provider: 'google',
    favorites: ['prop-2', 'prop-4', 'prop-5', 'prop-8'],
  },
  {
    id: 'user-003',
    email: 'carlos@outlook.com',
    name: 'Carlos Rodríguez',
    avatar: 'https://i.pravatar.cc/150?img=33',
    phone: '+34 634 567 890',
    emailVerified: false,
    createdAt: new Date('2024-11-10T08:15:00'),
    updatedAt: new Date('2024-11-10T08:15:00'),
    provider: 'email',
    favorites: [],
  },
  {
    id: 'user-004',
    email: 'ana@facebook.com',
    name: 'Ana Martínez',
    avatar: 'https://i.pravatar.cc/150?img=20',
    emailVerified: true,
    createdAt: new Date('2024-03-05T16:40:00'),
    updatedAt: new Date('2024-09-22T11:30:00'),
    provider: 'facebook',
    favorites: ['prop-1', 'prop-6'],
  },
];

/**
 * CONTRASEÑAS MOCK
 */
export const MOCK_PASSWORDS: Record<string, string> = {
  'demo@airbnb.com': 'password123',
  'maria@gmail.com': 'maria2024',
  'carlos@outlook.com': 'carlos123',
};

/**
 * TOKENS DE RECUPERACIÓN DE CONTRASEÑA
 */
export const MOCK_RECOVERY_TOKENS: Map<string, { email: string; expiresAt: Date }> = new Map();

/**
 * INTENTOS DE LOGIN FALLIDOS
 */
export const MOCK_LOGIN_ATTEMPTS: Map<string, { count: number; lockedUntil?: Date }> = new Map();

/**
 * TOKENS DE VERIFICACIÓN DE EMAIL
 */
export const MOCK_VERIFICATION_TOKENS: Map<string, string> = new Map();

MOCK_VERIFICATION_TOKENS.set('verify-carlos-123', 'carlos@outlook.com');

/**
 * Utilidades
 */
export function findUserByEmail(email: string): User | undefined {
  return MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return MOCK_USERS.find(u => u.id === id);
}

export function emailExists(email: string): boolean {
  return MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
}

export function addUser(user: User): void {
  MOCK_USERS.push(user);
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const user = findUserById(id);
  if (!user) return null;
  
  Object.assign(user, updates, { updatedAt: new Date() });
  return user;
}

if (typeof window !== 'undefined') {
  console.log('🗄️ MOCK Database inicializada');
  console.log(`📊 Usuarios registrados: ${MOCK_USERS.length}`);
  console.log('🔐 Credenciales de prueba:', Object.keys(MOCK_PASSWORDS));
}
