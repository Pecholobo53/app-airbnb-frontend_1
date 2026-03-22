// app/perfil/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { User } from '@/types/auth';
import { DashboardService } from '@/lib/dashboard/dashboard-service';
import { FavoritesService } from '@/lib/favorites/favorites-service';
import UserAvatar from '@/components/auth/UserAvatar';
import { Calendar, Mail, Phone, Heart, Shield, Loader2, Pencil, X, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileFormData } from '@/lib/auth/validators';
import { toast } from 'sonner';

const ACCENT = '#ff385c';

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0f172a]">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#475569] uppercase tracking-wide font-semibold">{label}</p>
        <p className="text-sm text-[#f8fafc] truncate">{value}</p>
      </div>
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center p-4 rounded-xl bg-[#0f172a] border border-[#1e293b]">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-bold text-[#f8fafc]">{value}</p>
      <p className="text-xs text-[#64748b]">{label}</p>
    </div>
  );
}

export default function PerfilPage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      DashboardService.getUserBookingCount(),
      FavoritesService.getFavoriteProperties(),
    ]).then(([count, favoritesRes]) => {
      setBookingCount(count);
      if (favoritesRes.success && favoritesRes.data) setFavoritesCount(favoritesRes.data.length);
    });
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    try {
      const updateData: Partial<User> = {
        name: data.name,
        phone: data.phone || undefined,
      };
      if (previewAvatar) {
        if (previewAvatar.length > 500 * 1024) {
          toast.error('La imagen es demasiado grande. Intenta con una imagen más pequeña.');
          setIsLoading(false);
          return;
        }
        updateData.avatar = previewAvatar;
      }
      const success = await updateUser(updateData);
      if (success) {
        toast.success('Perfil actualizado correctamente');
        setPreviewAvatar(null);
        setIsEditing(false);
      } else {
        toast.error('Error al actualizar el perfil.');
      }
    } catch {
      toast.error('Error inesperado al actualizar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({ name: user?.name || '', phone: user?.phone || '' });
    setPreviewAvatar(null);
    setIsEditing(false);
  };

  const compressImage = (
    file: File,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('No se pudo crear el contexto del canvas')); return; }
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', quality);
          resolve(
            base64.length > 500 * 1024
              ? canvas.toDataURL('image/jpeg', Math.max(0.5, quality - 0.1))
              : base64,
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor de 5MB');
      return;
    }
    try {
      setPreviewAvatar(await compressImage(file));
    } catch {
      toast.error('Error al procesar la imagen. Intenta con otra imagen.');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <p className="text-[#64748b]">Usuario no encontrado</p>
      </div>
    );
  }

  const providerLabels: Record<string, string> = {
    email: 'Email / Contraseña',
    google: 'Google',
    facebook: 'Facebook',
  };

  return (
    <div className="p-5 md:p-8 min-h-full">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
            Cuenta
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#f8fafc] tracking-tight">Mi Perfil</h1>
        <p className="text-[#64748b] mt-1 text-sm">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      <div className="grid gap-6 max-w-3xl">

        {/* Profile Card */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(30, 41, 59, 0.8)' }}
        >
          {/* Avatar + nombre */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <UserAvatar user={user} size="lg" previewSrc={previewAvatar} />
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={!isEditing || isLoading}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#f8fafc]">{user.name}</h2>
                <p className="text-sm text-[#64748b]">{user.email}</p>
                {isEditing && (
                  <p className="text-xs text-[#475569] mt-1">Pasa el cursor sobre la foto para cambiarla</p>
                )}
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#94a3b8] border border-[#1e293b] hover:bg-[#1e293b] hover:text-[#f8fafc] transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wide">
                  Nombre completo
                </label>
                <input
                  {...register('name')}
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] text-[#f8fafc] text-sm placeholder-[#475569] focus:outline-none focus:border-[#ff385c]/50 focus:ring-1 focus:ring-[#ff385c]/30 disabled:opacity-50"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wide">
                  Teléfono
                </label>
                <input
                  {...register('phone')}
                  placeholder="+34 600 000 000"
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] text-[#f8fafc] text-sm placeholder-[#475569] focus:outline-none focus:border-[#ff385c]/50 focus:ring-1 focus:ring-[#ff385c]/30 disabled:opacity-50"
                />
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: ACCENT }}
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                    : <><Check className="w-4 h-4" /> Guardar cambios</>}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#94a3b8] border border-[#1e293b] hover:bg-[#1e293b] transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-2">
              <InfoRow
                icon={<Mail className="w-4 h-4 text-[#64748b]" />}
                label="Email"
                value={user.email}
              />
              {user.phone && (
                <InfoRow
                  icon={<Phone className="w-4 h-4 text-[#64748b]" />}
                  label="Teléfono"
                  value={user.phone}
                />
              )}
              <InfoRow
                icon={<Calendar className="w-4 h-4 text-[#64748b]" />}
                label="Miembro desde"
                value={
                  user.createdAt && !isNaN(new Date(user.createdAt).getTime())
                    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Fecha no disponible'
                }
              />
              <InfoRow
                icon={<Shield className="w-4 h-4 text-[#64748b]" />}
                label="Método de acceso"
                value={providerLabels[user.provider] ?? user.provider}
              />
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0f172a]">
                <Mail className="w-4 h-4 text-[#64748b] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] text-[#475569] uppercase tracking-wide font-semibold">
                    Verificación
                  </p>
                  <span
                    className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-0.5"
                    style={
                      user.emailVerified
                        ? { color: '#34d399', background: 'rgba(52,211,153,0.12)' }
                        : { color: '#f87171', background: 'rgba(248,113,113,0.12)' }
                    }
                  >
                    {user.emailVerified ? '✓ Verificado' : '✗ No verificado'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(30, 41, 59, 0.8)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-bold text-[#f8fafc]">Estadísticas</h2>
            <div className="h-px flex-1 bg-[#1e293b]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatBox
              icon={<Calendar className="w-5 h-5" style={{ color: '#0ea5e9' }} />}
              value={String(bookingCount)}
              label="Reservas"
            />
            <StatBox
              icon={<Heart className="w-5 h-5" style={{ color: ACCENT }} />}
              value={String(favoritesCount)}
              label="Favoritos"
            />
            <StatBox
              icon={<span className="text-lg">✈️</span>}
              value={String(bookingCount)}
              label="Destinos"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
