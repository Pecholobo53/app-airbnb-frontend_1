// lib/auth/mock-users-db.ts

import { User } from '@/types/auth';

/**
 * BASE DE DATOS MOCK DE USUARIOS
 * 
 * Este array simula una base de datos en memoria.
 * En producción, esto sería una base de datos real (PostgreSQL, MongoDB, etc.)
 * 
 * USUARIOS DE PRUEBA:
 * - demo@airbnb.com / password123 (verificado)
 * - maria@gmail.com / maria2024 (verificado, OAuth Google)
 * - carlos@outlook.com / carlos123 (NO verificado)
 * - ana@facebook.com (verificado, OAuth Facebook)
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
