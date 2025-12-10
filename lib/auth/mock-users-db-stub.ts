// lib/auth/mock-users-db-stub.ts
// 
// STUB TEMPORAL - Solo para compatibilidad con otros módulos mock
// Este archivo será eliminado cuando se integren los otros módulos (dashboard, favorites, notifications)
//
// NOTA: Este archivo solo exporta los datos mínimos necesarios para que otros módulos mock funcionen.
// El módulo AUTH ya no usa este archivo, usa la API REST real.

import { User } from '@/types/auth';

/**
 * USUARIOS MOCK - STUB TEMPORAL
 * 
 * Solo para compatibilidad con otros módulos mock.
 * Estos datos serán eliminados cuando se integren dashboard, favorites y notifications.
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
 * Utilidad para buscar usuario por ID
 * Solo para compatibilidad con otros módulos mock.
 */
export function findUserById(id: string): User | undefined {
  return MOCK_USERS.find(u => u.id === id);
}


