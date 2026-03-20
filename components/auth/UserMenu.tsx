// components/auth/UserMenu.tsx
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from './UserAvatar';
import { User, Heart, Calendar, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

interface UserMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function UserMenu({ open, onOpenChange }: UserMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push(ROUTES.LOGIN);
      router.refresh();
    } catch (error) {
      console.error('Error en logout:', error);
      router.push(ROUTES.LOGIN);
    }
  };

  const navigate = (route: string) => {
    onOpenChange?.(false);
    router.push(route);
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="focus:outline-none rounded-full">
        <div className="flex items-center gap-2 px-3 py-2 border border-acento-200 rounded-full hover:bg-acento-200/10 transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <UserAvatar user={user} size="sm" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-[#071b3e] border border-white/10 text-white">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{user.name}</p>
            <p className="text-xs leading-none text-white/60">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem onClick={() => navigate(ROUTES.DASHBOARD)} className="cursor-pointer text-white/90 hover:text-white focus:text-white focus:bg-white/10">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate(ROUTES.PERFIL)} className="cursor-pointer text-white/90 hover:text-white focus:text-white focus:bg-white/10">
          <User className="mr-2 h-4 w-4" />
          <span>Mi perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate(ROUTES.MIS_RESERVAS)} className="cursor-pointer text-white/90 hover:text-white focus:text-white focus:bg-white/10">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Mis reservas</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate(ROUTES.FAVORITOS)} className="cursor-pointer text-white/90 hover:text-white focus:text-white focus:bg-white/10">
          <Heart className="mr-2 h-4 w-4" />
          <span>Favoritos</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-acento-200 focus:text-acento-200 focus:bg-acento-200/10">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
