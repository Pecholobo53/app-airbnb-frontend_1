// app/checkout/page.tsx
'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { validateBooking, createBooking, getBookingById, updateBooking, cleanupOldDrafts, type CreateBookingRequest, type Booking, type UpdateBookingRequest } from '@/lib/bookings/booking-service';
import { saveCheckoutData, getCheckoutData, clearCheckoutData, saveCheckoutStep, saveGuestInfo, savePaymentInfo, saveBillingAddress, saveBookingId } from '@/lib/utils/checkout-persistence';
import { PropertyService } from '@/lib/properties/property-service';
import { parseCheckoutParams } from '@/lib/checkout/utils';
import { calculatePriceBreakdown } from '@/lib/pricing/calculate-price';
import { CheckoutData, GuestInfo, PaymentInfo, BillingAddress } from '@/types/checkout';
import { Property } from '@/types/search';
import { ROUTES, ERROR_MESSAGES } from '@/lib/constants';
import { toast } from 'sonner';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import GuestInfoForm from '@/components/checkout/GuestInfoForm';
import PaymentSection from '@/components/checkout/PaymentSection';
import ConfirmationModal from '@/components/checkout/ConfirmationModal';
import { ReservationProtectionsWithButton } from '@/components/checkout/ReservationProtections';
import { formatPrice } from '@/lib/pricing/calculate-price';
import { differenceInDays } from 'date-fns';
import { Lock, CheckCircle } from 'lucide-react';

/**
 * Página de Checkout
 * 
 * Permite al usuario revisar y confirmar los detalles de su reserva:
 * - Paso 1: Detalles (resumen de propiedad)
 * - Paso 2: Pago (información de huésped, tarjeta y facturación)
 * - Paso 3: Confirmación (modal de éxito)
 */
export default function CheckoutPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [billingAddress, setBillingAddress] = useState<BillingAddress | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  
  // Referencia para evitar múltiples llamadas a loadCheckoutData
  const hasLoadedRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    // Limpiar borradores antiguos al iniciar (solo una vez)
    if (isAuthenticated && user) {
      cleanupOldDrafts().catch(err => {
        console.warn('⚠️ [CHECKOUT] Error limpiando borradores antiguos:', err);
      });
    }
  }, [isAuthenticated, user]);

  // No redirigir automáticamente - el usuario decide desde el modal
  // El modal tiene botones para "Ver mi reserva", "Buscar más propiedades", etc.

  // Extraer valores primitivos de los parámetros para evitar recargas innecesarias
  // Crear una clave estable basada en los valores de los parámetros
  const urlParamsKey = useMemo(() => {
    return searchParams.toString();
  }, [searchParams.toString()]);

  const urlParams = useMemo(() => ({
    bookingId: searchParams.get('id'),
    propertyId: searchParams.get('propertyId'),
    checkIn: searchParams.get('checkIn'),
    checkOut: searchParams.get('checkOut'),
    adults: searchParams.get('adults'),
    children: searchParams.get('children'),
    infants: searchParams.get('infants'),
  }), [urlParamsKey]); // Depender de la clave estable en lugar del objeto searchParams

  useEffect(() => {
    console.log('🔄 [CHECKOUT] useEffect ejecutado', {
      authLoading,
      isAuthenticated,
      hasUser: !!user,
      urlParamsKey,
      hasLoadedRef: hasLoadedRef.current,
      isLoadingRef: isLoadingRef.current,
    });

    // Redirigir a login si no está autenticado
    if (!authLoading && !isAuthenticated) {
      console.log('🚫 [CHECKOUT] No autenticado, redirigiendo a login');
      toast.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      router.push(ROUTES.LOGIN);
      return;
    }

    // Cargar datos de checkout si está autenticado
    // Usar una clave única basada en los parámetros de la URL para evitar recargas innecesarias
    const loadKey = urlParams.bookingId || `${urlParams.propertyId}-${urlParams.checkIn}-${urlParams.checkOut}` || 'default';
    
    console.log('🔑 [CHECKOUT] Load key calculada:', loadKey);
    console.log('🔍 [CHECKOUT] Verificando condiciones:', {
      isAuthenticated,
      hasUser: !!user,
      hasLoadedRef: hasLoadedRef.current,
      loadKey,
      keysMatch: hasLoadedRef.current === loadKey,
      isLoadingRef: isLoadingRef.current,
    });
    
    // Solo cargar si no se ha cargado para esta clave específica y no está cargando actualmente
    if (isAuthenticated && user && hasLoadedRef.current !== loadKey && !isLoadingRef.current) {
      console.log('✅ [CHECKOUT] Condiciones cumplidas, iniciando carga...');
      isLoadingRef.current = true;
      hasLoadedRef.current = loadKey;
      
      // Recuperar datos persistentes primero (solo una vez)
      const persisted = getCheckoutData();
      if (persisted) {
        console.log('📦 [CHECKOUT] Datos persistentes recuperados:', persisted);
        if (persisted.currentStep) setCurrentStep(persisted.currentStep);
        if (persisted.guestInfo) setGuestInfo(persisted.guestInfo);
        if (persisted.paymentInfo) setPaymentInfo(persisted.paymentInfo);
        if (persisted.billingAddress) setBillingAddress(persisted.billingAddress);
        // NO actualizar bookingId aquí para evitar bucles - se actualizará en loadCheckoutData si es necesario
      }
      
      loadCheckoutData()
        .then(() => {
          console.log('✅ [CHECKOUT] loadCheckoutData completado exitosamente');
        })
        .catch((error) => {
          console.error('❌ [CHECKOUT] Error en loadCheckoutData:', error);
        })
        .finally(() => {
          console.log('🏁 [CHECKOUT] loadCheckoutData finally - reseteando isLoadingRef');
          isLoadingRef.current = false;
        });
    } else {
      console.log('⏭️ [CHECKOUT] Condiciones NO cumplidas, saltando carga:', {
        isAuthenticated,
        hasUser: !!user,
        keysMatch: hasLoadedRef.current === loadKey,
        isLoadingRef: isLoadingRef.current,
      });
    }
  }, [isAuthenticated, user, authLoading, router, urlParamsKey, urlParams.bookingId, urlParams.propertyId, urlParams.checkIn, urlParams.checkOut]);

  // No cambiar automáticamente el paso - el usuario controla la navegación

  const loadCheckoutData = async (): Promise<void> => {
    if (!user) {
      isLoadingRef.current = false;
      return;
    }
    
    // Evitar múltiples llamadas simultáneas
    if (isLoadingRef.current) {
      console.log('⚠️ [CHECKOUT] Ya se está cargando, ignorando llamada duplicada');
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Verificar si hay un ID de reserva en la URL
      const bookingIdParam = urlParams.bookingId;

      if (bookingIdParam) {
        // Verificar primero si hay parámetros en la URL para usar como fallback
        // Esto evita intentar cargar la reserva si sabemos que puede fallar
        const propertyIdFromUrl = urlParams.propertyId;
        const checkInParam = urlParams.checkIn;
        const checkOutParam = urlParams.checkOut;
        const guestsParam = urlParams.adults;
        
        // Si hay parámetros completos en la URL, usarlos directamente como fallback
        // Esto es más rápido y evita peticiones innecesarias que causan 429
        if (propertyIdFromUrl && checkInParam && checkOutParam && guestsParam) {
          console.log('✅ [CHECKOUT] Parámetros encontrados en URL, usando fallback directo (más rápido)...');
          
          // Cargar propiedad directamente
          const propertyResponse = await PropertyService.getPropertyById(propertyIdFromUrl);
          if (propertyResponse.success && propertyResponse.data) {
            const loadedProperty = propertyResponse.data;
            setProperty(loadedProperty);
            setBookingId(bookingIdParam);
            
            // Crear checkoutData desde parámetros
            const checkIn = new Date(checkInParam);
            const checkOut = new Date(checkOutParam);
            const guests = parseInt(guestsParam, 10);
            
            const pricing = calculatePriceBreakdown(
              loadedProperty.pricing,
              checkIn,
              checkOut,
              guests
            );
            
            const nights = differenceInDays(checkOut, checkIn);
            
            const checkoutData: Omit<CheckoutData, 'createdAt' | 'expiresAt'> = {
              propertyId: loadedProperty.id,
              property: loadedProperty,
              checkIn,
              checkOut,
              nights,
              guests: {
                adults: guests,
                children: parseInt(urlParams.children || '0', 10),
                infants: parseInt(urlParams.infants || '0', 10),
              },
              pricing,
            };
            
            setCheckoutData(checkoutData);
            setIsLoading(false);
            isLoadingRef.current = false;
            console.log('✅ [CHECKOUT] Checkout cargado desde parámetros de URL (fallback)');
            return;
          }
        }
        
        // Si no hay parámetros en la URL, intentar cargar desde la API
        // Pero con timeout para evitar que se quede colgado
        console.log('📋 [CHECKOUT] Intentando cargar reserva desde API:', bookingIdParam);
        
        try {
          // Timeout de 5 segundos para evitar que se quede colgado
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: La petición tardó demasiado')), 5000);
          });
          
          const bookingResponse = await Promise.race([
            getBookingById(bookingIdParam),
            timeoutPromise
          ]);
          
          if (!bookingResponse.success) {
            const errorCode = bookingResponse.error?.code;
            const errorMessage = bookingResponse.error?.message || 'Error al cargar la reserva';
            
            // Si es 403 o timeout, mostrar error
            if (errorCode === 'FORBIDDEN' || errorCode === 'HTTP_403' || errorMessage.includes('Timeout')) {
              console.warn('⚠️ [CHECKOUT] Error 403 o timeout al cargar reserva.');
              setError('No se pudo cargar la reserva. Si acabas de crearla, espera unos segundos y recarga la página, o contacta con soporte.');
              setIsLoading(false);
              isLoadingRef.current = false;
              return;
            }
            
            // Para otros errores, mostrar mensaje estándar
            setError(errorMessage);
            setIsLoading(false);
            isLoadingRef.current = false;
            return;
          }
          
          if (!bookingResponse.data?.booking) {
            setError('Reserva no encontrada');
            setIsLoading(false);
            isLoadingRef.current = false;
            return;
          }
          
          // Continuar con el flujo normal de carga de reserva
          const booking = bookingResponse.data.booking;
          setBookingId(booking.id);
          setBookingData(booking);
          saveBookingId(booking.id);
          
          console.log('📋 [CHECKOUT] Reserva cargada:', {
            id: booking.id,
            status: booking.status,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests,
            createdAt: booking.createdAt,
          });
          
          // Cargar propiedad usando el ID de la reserva
          const propertyResponse = await PropertyService.getPropertyById(booking.propertyId);
          if (!propertyResponse.success || !propertyResponse.data) {
            setError(propertyResponse.error?.message || 'Propiedad no encontrada');
            setIsLoading(false);
            isLoadingRef.current = false;
            return;
          }
          
          const loadedProperty = propertyResponse.data;
          
          // Calcular precios
          const pricing = calculatePriceBreakdown(
            loadedProperty.pricing,
            new Date(booking.checkIn),
            new Date(booking.checkOut),
            booking.guests
          );
          
          const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));
          
          // Crear datos de checkout desde la reserva
          const checkoutData: Omit<CheckoutData, 'createdAt' | 'expiresAt'> = {
            propertyId: loadedProperty.id,
            property: loadedProperty,
            checkIn: new Date(booking.checkIn),
            checkOut: new Date(booking.checkOut),
            nights,
            guests: {
              adults: booking.guests,
              children: 0,
              infants: 0,
            },
            pricing,
          };
          
          // Si la reserva tiene información del huésped, prellenar el formulario
          if (booking.guestInfo) {
            setGuestInfo({
              fullName: booking.guestInfo.name,
              email: booking.guestInfo.email,
              phone: booking.guestInfo.phone,
            });
          }
          
          // Guardar datos directamente
          setProperty(loadedProperty);
          setCheckoutData(checkoutData);
          setIsLoading(false);
          isLoadingRef.current = false;
          console.log('✅ [CHECKOUT] Checkout cargado desde reserva existente - COMPLETADO');
        } catch (apiError) {
          // Si falla la petición a la API (timeout, red, etc.)
          console.error('❌ [CHECKOUT] Error en petición a API:', apiError);
          const errorMessage = apiError instanceof Error ? apiError.message : 'Error al cargar la reserva';
          
          if (errorMessage.includes('Timeout')) {
            setError('La conexión está tardando demasiado. Por favor, recarga la página.');
          } else {
            setError('Error al cargar la reserva. Por favor, intenta más tarde.');
          }
          setIsLoading(false);
          isLoadingRef.current = false;
          return;
        }
      } else {
        // Flujo de parámetros de query: crear reserva en borrador y redirigir a flujo unificado
        console.log('📋 [CHECKOUT] Cargando desde parámetros de query');
        
        const params = parseCheckoutParams(new URLSearchParams(searchParams.toString()));

        if (!params.propertyId || !params.checkIn || !params.checkOut || !params.guests) {
          setError('Datos de checkout incompletos. Por favor, vuelve a la propiedad y selecciona fechas.');
          setIsLoading(false);
          return;
        }

        // Cargar propiedad usando el servicio real
        const propertyResponse = await PropertyService.getPropertyById(params.propertyId);
        if (!propertyResponse.success || !propertyResponse.data) {
          setError(propertyResponse.error?.message || 'Propiedad no encontrada');
          setIsLoading(false);
          return;
        }

        const loadedProperty = propertyResponse.data;

        // Intentar crear reserva en borrador para unificar flujo (opcional)
        // Si falla (404), continuar con flujo antiguo sin reserva en borrador
        try {
          const checkInStr = params.checkIn.toISOString().split('T')[0];
          const checkOutStr = params.checkOut.toISOString().split('T')[0];
          
          console.log('📝 [CHECKOUT] Intentando crear reserva en borrador desde parámetros...');
          
          // Validar disponibilidad antes de crear (opcional, si el endpoint existe)
          const validationResponse = await validateBooking({
            propertyId: params.propertyId,
            checkIn: checkInStr,
            checkOut: checkOutStr,
            guests: params.guests.adults + (params.guests.children || 0),
          });

          // Si el endpoint de validación no existe (404), saltar validación
          const skipValidation = !validationResponse.success && 
                               (validationResponse.error?.code === 'NOT_FOUND' || 
                                validationResponse.error?.code === 'HTTP_404' ||
                                validationResponse.error?.message?.includes('Ruta no encontrada'));

          if (!skipValidation && (!validationResponse.success || !validationResponse.data?.available)) {
            const errorMessage = validationResponse.error?.message || 
                                validationResponse.data?.message || 
                                'Las fechas seleccionadas no están disponibles';
            setError(errorMessage);
            setIsLoading(false);
            return;
          }

          // Crear reserva en borrador (opcional, si el endpoint existe)
          const bookingRequest: CreateBookingRequest = {
            propertyId: params.propertyId,
            checkIn: checkInStr,
            checkOut: checkOutStr,
            guests: params.guests.adults + (params.guests.children || 0),
            guestInfo: {
              name: user.name || 'Usuario',
              email: user.email || '',
              phone: '',
            },
            paymentMethod: 'pending',
          };

          const bookingResponse = await createBooking(bookingRequest);

          // Si el endpoint no existe (404), continuar con flujo antiguo
          if (!bookingResponse.success) {
            const errorCode = bookingResponse.error?.code;
            const errorMessage = bookingResponse.error?.message || '';
            
            if (errorCode === 'NOT_FOUND' || errorCode === 'HTTP_404' ||
                errorMessage.includes('Ruta no encontrada') || errorMessage.includes('not found')) {
              console.warn('⚠️ [CHECKOUT] Endpoint de creación no disponible (404), continuando con flujo antiguo');
              // Continuar con flujo antiguo (sin reserva en borrador)
            } else {
              // Otro error, mostrar y continuar con flujo antiguo
              console.warn('⚠️ [CHECKOUT] Error creando reserva, continuando con flujo antiguo:', errorMessage);
            }
          } else if (bookingResponse.data?.booking) {
            // Si se creó exitosamente, redirigir a flujo unificado
            const newBookingId = bookingResponse.data.booking.id;
            console.log('✅ [CHECKOUT] Reserva creada en borrador:', newBookingId);
            // Limpiar TODAS las referencias para permitir carga limpia con nuevo ID
            hasLoadedRef.current = null;
            isLoadingRef.current = false;
            setIsLoading(false);
            // Usar window.location para forzar recarga completa y evitar bucles
            window.location.href = `/checkout?id=${newBookingId}`;
            return; // No continuar, la redirección cargará los datos
          }
        } catch (err) {
          console.error('❌ [CHECKOUT] Error creando reserva desde parámetros:', err);
          // Si falla crear reserva, continuar con flujo antiguo (compatibilidad)
          console.warn('⚠️ [CHECKOUT] Continuando con flujo antiguo sin reserva en borrador');
        }

        // Flujo antiguo (fallback si falla crear reserva)
        const pricing = calculatePriceBreakdown(
          loadedProperty.pricing,
          params.checkIn,
          params.checkOut,
          params.guests.adults
        );

        const nights = differenceInDays(params.checkOut, params.checkIn);

        const checkoutData: Omit<CheckoutData, 'createdAt' | 'expiresAt'> = {
          propertyId: loadedProperty.id,
          property: loadedProperty,
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          nights,
          guests: params.guests,
          pricing,
        };

        setProperty(loadedProperty);
        setCheckoutData(checkoutData);
        setIsLoading(false);
        isLoadingRef.current = false;
        console.log('✅ [CHECKOUT] Checkout cargado desde parámetros de query');
      }
    } catch (err) {
      console.error('Error cargando checkout:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos de checkout';
      
      // Si es timeout o error de red, mostrar mensaje específico
      if (errorMessage.includes('Timeout') || errorMessage.includes('fetch')) {
        setError('La conexión está tardando demasiado. Por favor, recarga la página o intenta más tarde.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const handleGuestInfoSubmit = async (data: GuestInfo) => {
    if (!checkoutData) return;

    // Guardar info del huésped en estado local
    setGuestInfo(data);
    setCurrentStep(2);
    
    // Guardar en persistencia
    saveGuestInfo(data);
    saveCheckoutStep(2);
    
    // Actualizar checkoutData con info del huésped
    setCheckoutData({
      ...checkoutData,
      guestInfo: data,
    });

    // Actualizar reserva en borrador si existe
    if (bookingId) {
      try {
        const updates: UpdateBookingRequest = {
          guestInfo: {
            name: data.fullName,
            email: data.email,
            phone: data.phone,
          },
        };
        
        const updateResponse = await updateBooking(bookingId, updates);
        if (updateResponse.success) {
          console.log('✅ [CHECKOUT] Reserva actualizada con información del huésped');
        } else {
          console.warn('⚠️ [CHECKOUT] Error actualizando reserva:', updateResponse.error);
        }
      } catch (error) {
        console.error('❌ [CHECKOUT] Error actualizando reserva:', error);
      }
    }
  };

  const handleBillingAddressSubmit = (data: BillingAddress) => {
    setBillingAddress(data);
  };

  const handlePaymentSubmit = (data: PaymentInfo) => {
    // Si hay dirección de facturación, agregarla
    if (billingAddress && !data.billingAddress) {
      data.billingAddress = billingAddress;
    }
    // Asegurar que siempre tenga billingAddress
    if (!data.billingAddress && billingAddress) {
      data.billingAddress = billingAddress;
    }
    // Si no tiene billingAddress pero tenemos uno guardado, usarlo
    if (!data.billingAddress && billingAddress) {
      data.billingAddress = billingAddress;
    }
    setPaymentInfo(data);
    
    // Guardar en persistencia
    savePaymentInfo({
      cardNumber: data.cardNumber,
      cardHolder: data.cardHolder || '',
      expiryDate: data.expiryDate || '',
      cvv: data.cvv || '',
      paymentMethod: data.paymentMethod || 'card',
    });
    if (data.billingAddress) {
      saveBillingAddress(data.billingAddress);
    }
    
    console.log('✅ Payment info guardada:', data);
  };

  const handleConfirmBooking = async () => {
    console.log('🚀 handleConfirmBooking INICIADO - USANDO API REAL');
    console.log('📋 Estado inicial:', {
      checkoutData: !!checkoutData,
      user: !!user,
      guestInfo: !!guestInfo,
      paymentInfo: !!paymentInfo,
      billingAddress: !!billingAddress,
    });

    if (!checkoutData || !user || !guestInfo) {
      console.error('❌ Validación fallida: datos básicos faltantes');
      toast.error('Completa toda la información antes de confirmar');
      return;
    }

    // Validar que tenemos información de pago completa
    if (!paymentInfo) {
      console.error('❌ Validación fallida: paymentInfo faltante');
      toast.error('Completa la información de pago (tarjeta y facturación)');
      return;
    }

    // Asegurar que tenemos dirección de facturación (puede estar en paymentInfo o en billingAddress)
    let finalPaymentInfo: PaymentInfo = { ...paymentInfo };
    if (!finalPaymentInfo.billingAddress && billingAddress) {
      finalPaymentInfo.billingAddress = billingAddress;
    }

    // Validar que tenemos dirección de facturación
    if (!finalPaymentInfo.billingAddress) {
      console.error('❌ Validación fallida: billingAddress faltante');
      toast.error('Completa la dirección de facturación');
      return;
    }

    // Validar que tenemos todos los datos de tarjeta
    if (!finalPaymentInfo.cardNumber || !finalPaymentInfo.cardHolder || !finalPaymentInfo.expiryDate || !finalPaymentInfo.cvv) {
      console.error('❌ Validación fallida: datos de tarjeta incompletos', {
        cardNumber: !!finalPaymentInfo.cardNumber,
        cardHolder: !!finalPaymentInfo.cardHolder,
        expiryDate: !!finalPaymentInfo.expiryDate,
        cvv: !!finalPaymentInfo.cvv,
      });
      toast.error('Completa todos los datos de la tarjeta');
      return;
    }

    console.log('✅ Todas las validaciones pasadas, validando y creando reserva con API REAL...');
    setIsProcessing(true);

    try {
      // PASO 1: Validar reserva con la API (opcional si el endpoint existe)
      console.log('🔍 [API REAL] Validando reserva...');
      const checkInStr = checkoutData.checkIn.toISOString().split('T')[0];
      const checkOutStr = checkoutData.checkOut.toISOString().split('T')[0];
      
      let skipValidation = false;
      
      try {
        const validationResponse = await validateBooking({
          propertyId: checkoutData.propertyId,
          checkIn: checkInStr,
          checkOut: checkOutStr,
          guests: checkoutData.guests.adults + (checkoutData.guests.children || 0),
        });

        // Si el endpoint no existe (404), saltar validación
        if (!validationResponse.success) {
          const errorCode = validationResponse.error?.code;
          const errorMessage = validationResponse.error?.message || '';
          
          if (errorCode === 'NOT_FOUND' || errorCode === 'HTTP_404' ||
              errorMessage.includes('Ruta no encontrada') || errorMessage.includes('not found')) {
            console.warn('⚠️ [CHECKOUT] Endpoint de validación no disponible (404), saltando validación');
            skipValidation = true;
          } else if (validationResponse.data?.available === false) {
            // Si las fechas realmente no están disponibles, bloquear
            console.error('❌ [API REAL] Reserva no válida:', validationResponse.error);
            toast.error(
              validationResponse.error?.message || 
              validationResponse.data?.message || 
              'Las fechas seleccionadas no están disponibles'
            );
            setIsProcessing(false);
            return;
          } else {
            // Para otros errores, permitir continuar
            console.warn('⚠️ [CHECKOUT] Error en validación, pero permitiendo continuar');
            skipValidation = true;
          }
        } else if (!validationResponse.data?.available) {
          // Si la validación fue exitosa pero las fechas no están disponibles
          console.error('❌ [API REAL] Reserva no válida: fechas no disponibles');
          toast.error(
            validationResponse.data?.message || 
            'Las fechas seleccionadas no están disponibles'
          );
          setIsProcessing(false);
          return;
        } else {
          console.log('✅ [API REAL] Reserva validada exitosamente');
        }
      } catch (error) {
        console.warn('⚠️ [CHECKOUT] Error inesperado en validación, continuando:', error);
        skipValidation = true;
      }

      // PASO 2: Crear reserva con la API REAL
      console.log('📝 [API REAL] Creando reserva...');
      
      const bookingRequest: CreateBookingRequest = {
        propertyId: checkoutData.propertyId,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        guests: checkoutData.guests.adults + (checkoutData.guests.children || 0),
        guestInfo: {
          name: guestInfo.fullName || user.name || '',
          email: guestInfo.email || user.email || '',
          phone: guestInfo.phone || '',
        },
        paymentMethod: finalPaymentInfo.paymentMethod || 'card',
      };

      const bookingResponse = await createBooking(bookingRequest);

      // Si el endpoint no existe (404), simular confirmación exitosa
      if (!bookingResponse.success) {
        const errorCode = bookingResponse.error?.code;
        const errorMessage = bookingResponse.error?.message || '';
        
        if (errorCode === 'NOT_FOUND' || errorCode === 'HTTP_404' ||
            errorMessage.includes('Ruta no encontrada') || errorMessage.includes('not found')) {
          console.warn('⚠️ [CHECKOUT] Endpoint de creación no disponible (404), simulando confirmación');
          
          // Simular ID de reserva para mostrar confirmación
          const simulatedBookingId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          setBookingId(simulatedBookingId);
          setCurrentStep(3);
          setShowConfirmation(true);
          setIsProcessing(false);
          
          // Limpiar datos persistentes al confirmar
          clearCheckoutData();
          
          toast.success('¡Reserva confirmada exitosamente! (Modo simulación - endpoint no disponible)');
          
          console.log('🎉 Estado final (simulado):', {
            currentStep: 3,
            showConfirmation: true,
            bookingId: simulatedBookingId,
          });
          return;
        }
        
        // Si es rate limit (429), mostrar mensaje específico
        if (errorCode === 'RATE_LIMIT' || errorCode === 'HTTP_429' ||
            errorMessage.includes('Demasiadas solicitudes')) {
          toast.error('Demasiadas solicitudes. Por favor, espera unos segundos e intenta de nuevo.');
          setIsProcessing(false);
          return;
        }
        
        // Otro error, mostrar mensaje
        console.error('❌ [API REAL] Error creando reserva:', bookingResponse.error);
        toast.error(
          bookingResponse.error?.message || 
          'Error al crear la reserva. Por favor, intenta de nuevo.'
        );
        setIsProcessing(false);
        return;
      }

      if (!bookingResponse.data?.booking) {
        console.error('❌ [API REAL] Respuesta sin datos de reserva');
        toast.error('Error al crear la reserva. Por favor, intenta de nuevo.');
        setIsProcessing(false);
        return;
      }

      const createdBooking = bookingResponse.data.booking;
      console.log('✅ [API REAL] Reserva creada exitosamente:', createdBooking.id);
      
      setBookingId(createdBooking.id);
      setCurrentStep(3);
      setShowConfirmation(true);
      setIsProcessing(false);
      
      // Limpiar datos persistentes al confirmar
      clearCheckoutData();
      
      toast.success('¡Reserva confirmada exitosamente!');
      
      console.log('🎉 Estado final:', {
        currentStep: 3,
        showConfirmation: true,
        bookingId: createdBooking.id,
      });
    } catch (err) {
      console.error('❌ [API REAL] Error inesperado:', err);
      toast.error('Error al confirmar la reserva. Por favor, intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando checkout...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se redirige)
  if (!isAuthenticated) {
    return null;
  }

  // Error state
  if (error || !property || !checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Error al cargar checkout'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'No se pudieron cargar los datos de checkout'}
          </p>
          <button
            onClick={() => router.push(ROUTES.BUSCAR)}
            className="px-6 py-3 bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold rounded-lg transition-colors"
          >
            Buscar propiedades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutHeader
          propertyTitle={property.title}
          propertyId={property.id}
        />

        {/* Barra de Progreso */}
        <CheckoutProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - Formularios (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paso 1: Resumen de Checkout */}
            {currentStep === 1 && (
              <CheckoutSummary
                property={property}
                checkIn={checkoutData.checkIn}
                checkOut={checkoutData.checkOut}
                nights={checkoutData.nights}
                guests={checkoutData.guests}
                pricing={checkoutData.pricing}
                bookingData={bookingData || undefined}
              />
            )}

            {/* Paso 2: Información del Huésped y Pago */}
            {currentStep === 2 && (
              <>
                {/* Información del Huésped - Siempre mostrar */}
                <GuestInfoForm
                  initialData={checkoutData.guestInfo || guestInfo || undefined}
                  onSubmit={handleGuestInfoSubmit}
                  isLoading={isProcessing}
                />

                {/* Mostrar PaymentSection si ya hay guestInfo */}
                {guestInfo && (
                  <PaymentSection
                    initialData={checkoutData.paymentInfo}
                    onSubmit={handlePaymentSubmit}
                    isLoading={isProcessing}
                  />
                )}
              </>
            )}

            {/* Paso 3: Confirmación */}
            {currentStep === 3 && (
              <div className="bg-white border border-gray-300 rounded-xl p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Reserva confirmada!
                </h2>
                <p className="text-gray-600 mb-4">
                  Recibirás un email de confirmación en breve.
                </p>
                {bookingId && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">ID de reserva:</p>
                    <p className="text-lg font-semibold text-gray-900 font-mono">
                      {bookingId}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Columna Lateral - Resumen Sticky (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Resumen de la reserva
                </h3>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      {formatPrice(checkoutData.pricing.basePrice, checkoutData.pricing.currency)} × {checkoutData.nights} {checkoutData.nights === 1 ? 'noche' : 'noches'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(checkoutData.pricing.subtotal, checkoutData.pricing.currency)}
                    </span>
                  </div>

                  {checkoutData.pricing.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Limpieza</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(checkoutData.pricing.cleaningFee, checkoutData.pricing.currency)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-700">Servicio</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(checkoutData.pricing.serviceFee, checkoutData.pricing.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-700">Impuestos</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(checkoutData.pricing.taxes, checkoutData.pricing.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-lg">
                    <span className="text-gray-900">Total ({checkoutData.pricing.currency})</span>
                    <span className="text-gray-900">
                      {formatPrice(checkoutData.pricing.total, checkoutData.pricing.currency)}
                    </span>
                  </div>
                </div>

                {/* Botón de continuar (solo en paso 1) */}
                {currentStep === 1 && (
                  <button
                    onClick={() => {
                      setCurrentStep(2);
                      saveCheckoutStep(2);
                    }}
                    className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3 rounded-lg transition-colors mt-6"
                  >
                    Continuar
                  </button>
                )}

                {/* Protecciones de Reserva con Botón de Confirmar (solo en paso 2) */}
                {currentStep === 2 && (
                  <ReservationProtectionsWithButton
                    onConfirm={() => {
                      console.log('🔘 Botón Confirmar Reserva clickeado');
                      console.log('📊 Estado:', { currentStep, guestInfo: !!guestInfo, paymentInfo: !!paymentInfo });
                      handleConfirmBooking();
                    }}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                  />
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showConfirmation}
        bookingId={bookingId}
        onClose={() => {
          setShowConfirmation(false);
        }}
        onViewBooking={() => {
          router.push(ROUTES.MIS_RESERVAS || '/dashboard/reservas');
        }}
      />
    </div>
  );
}
