// components/dashboard/ModeSwitcher.tsx
'use client';

/**
 * MODE SWITCHER - Componente para cambiar entre modos
 * 
 * Contexto:
 * Toggle que permite al usuario cambiar entre:
 * - 🏠 Modo Viajero (guest): Ver mis viajes y reservas
 * - 🏡 Modo Anfitrión (host): Gestionar propiedades y reservas
 * 
 * Funcionalidad:
 * - Se muestra en el header, junto al UserMenu
 * - Cambio instantáneo con animación
 * - Persiste preferencia en localStorage (vía context)
 * - Visual claro del modo activo
 */

import { Plane, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDashboard } from '@/lib/dashboard/dashboard-context';
import { DashboardMode } from '@/types/dashboard';

export default function ModeSwitcher() {
  const { mode, switchMode } = useDashboard();

  const modeConfig = {
    guest: {
      icon: Plane,
      label: 'Viajando',
      color: 'text-blue-600'
    },
    host: {
      icon: Home,
      label: 'Anfitrión',
      color: 'text-green-600'
    }
  };

  const current = modeConfig[mode];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CurrentIcon className={`h-4 w-4 ${current.color}`} />
          <span className="hidden sm:inline">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => switchMode('guest')}
          className={mode === 'guest' ? 'bg-blue-50 font-medium' : ''}
        >
          <Plane className="mr-2 h-4 w-4 text-blue-600" />
          Modo Viajero
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchMode('host')}
          className={mode === 'host' ? 'bg-green-50 font-medium' : ''}
        >
          <Home className="mr-2 h-4 w-4 text-green-600" />
          Modo Anfitrión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

