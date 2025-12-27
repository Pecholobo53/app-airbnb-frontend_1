// components/checkout/BillingAddressForm.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BillingAddress } from '@/types/checkout';
import { MapPin } from 'lucide-react';

interface BillingAddressFormProps {
  initialData?: BillingAddress;
  onSubmit: (data: BillingAddress) => void;
  isLoading?: boolean;
}

// Schema de validación
const billingAddressSchema = z.object({
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad es requerida'),
  state: z.string().min(2, 'El estado/provincia es requerido'),
  postalCode: z.string().min(4, 'El código postal debe tener al menos 4 caracteres'),
  country: z.string().min(2, 'El país es requerido'),
});

type BillingAddressFormData = z.infer<typeof billingAddressSchema>;

/**
 * Formulario de Dirección de Facturación
 * 
 * Permite al usuario completar su dirección de facturación
 */
export default function BillingAddressForm({
  initialData,
  onSubmit,
  isLoading = false,
}: BillingAddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<BillingAddressFormData>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: {
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      postalCode: initialData?.postalCode || '',
      country: initialData?.country || 'España',
    },
  });

  // Observar cambios en los valores del formulario
  const watchedValues = watch();
  const hasSubmittedRef = useRef(false);

  const handleFormSubmit = (data: BillingAddressFormData) => {
    console.log('📍 BillingAddressForm: Enviando datos', data);
    onSubmit({
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
    });
    hasSubmittedRef.current = true;
  };

  // Auto-enviar cuando el formulario es válido
  useEffect(() => {
    if (isValid && !isLoading && !hasSubmittedRef.current) {
      const data: BillingAddressFormData = {
        address: watchedValues.address || '',
        city: watchedValues.city || '',
        state: watchedValues.state || '',
        postalCode: watchedValues.postalCode || '',
        country: watchedValues.country || 'España',
      };
      
      // Validar que todos los campos estén completos
      if (data.address && data.city && data.state && data.postalCode && data.country) {
        handleFormSubmit(data);
      }
    }
    
    // Resetear el flag si el formulario se vuelve inválido
    if (!isValid) {
      hasSubmittedRef.current = false;
    }
  }, [isValid, isLoading, watchedValues.address, watchedValues.city, watchedValues.state, watchedValues.postalCode, watchedValues.country]);

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Dirección de facturación
          </h2>
          <p className="text-sm text-gray-600">
            Completa tu información de facturación
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Dirección */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección *
          </label>
          <input
            id="address"
            type="text"
            {...register('address')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
            placeholder="123 main street"
            autoComplete="street-address"
            disabled={isLoading}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Ciudad */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <input
            id="city"
            type="text"
            {...register('city')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
            placeholder="Barcelona"
            autoComplete="address-level2"
            disabled={isLoading}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        {/* Estado/Provincia */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            Estado/Provincia *
          </label>
          <input
            id="state"
            type="text"
            {...register('state')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
            placeholder="Cataluña"
            autoComplete="address-level1"
            disabled={isLoading}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        {/* Código Postal */}
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código postal *
          </label>
          <input
            id="postalCode"
            type="text"
            {...register('postalCode')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none"
            placeholder="08001"
            autoComplete="postal-code"
            disabled={isLoading}
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
          )}
        </div>

        {/* País */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            País *
          </label>
          <select
            id="country"
            {...register('country')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none bg-white"
            autoComplete="country"
            disabled={isLoading}
          >
            <option value="España">España</option>
            <option value="Francia">Francia</option>
            <option value="Italia">Italia</option>
            <option value="Portugal">Portugal</option>
            <option value="Alemania">Alemania</option>
            <option value="Reino Unido">Reino Unido</option>
            <option value="Estados Unidos">Estados Unidos</option>
            <option value="México">México</option>
            <option value="Argentina">Argentina</option>
            <option value="Colombia">Colombia</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}

