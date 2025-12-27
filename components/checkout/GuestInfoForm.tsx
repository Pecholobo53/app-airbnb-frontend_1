// components/checkout/GuestInfoForm.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GuestInfo } from '@/types/checkout';
import { useAuth } from '@/lib/auth/auth-context';
import { User } from 'lucide-react';

interface GuestInfoFormProps {
  initialData?: GuestInfo;
  onSubmit: (data: GuestInfo) => void;
  isLoading?: boolean;
}

// Schema de validación
const guestInfoSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
});

type GuestInfoFormData = z.infer<typeof guestInfoSchema>;

/**
 * Formulario de Información del Huésped
 * 
 * Permite al usuario completar o actualizar su información
 * para la reserva. Pre-llena con datos del usuario autenticado.
 */
export default function GuestInfoForm({
  initialData,
  onSubmit,
  isLoading = false,
}: GuestInfoFormProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<GuestInfoFormData>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      name: initialData?.name || user?.name || '',
      email: initialData?.email || user?.email || '',
      phone: initialData?.phone || '',
    },
  });

  // Pre-llenar con datos del usuario si está autenticado
  useEffect(() => {
    if (user && !initialData) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
    }
  }, [user, initialData, setValue]);

  const handleFormSubmit = (data: GuestInfoFormData) => {
    onSubmit({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-lg">
          <User className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Información del huésped
          </h2>
          <p className="text-sm text-gray-600">
            Confirma tus datos para la reserva
          </p>
        </div>
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleFormSubmit)(e);
        }} 
        className="space-y-4"
      >
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
            placeholder="Tu nombre completo"
            autoComplete="name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Teléfono (opcional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono (opcional)
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
            placeholder="+34 612 345 678"
            autoComplete="tel"
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            El anfitrión puede contactarte por teléfono si es necesario
          </p>
        </div>

        {/* Botón para continuar */}
        {isValid && (
          <button
            type="submit"
            className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3 rounded-lg transition-colors mt-4"
          >
            Continuar
          </button>
        )}
      </form>

    </div>
  );
}

