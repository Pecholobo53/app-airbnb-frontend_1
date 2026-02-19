// components/checkout/CheckoutProgress.tsx
'use client';

interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
}

/**
 * Barra de Progreso del Checkout
 * 
 * Muestra el progreso del proceso de reserva en 3 pasos:
 * 1. Detalles
 * 2. Pago
 * 3. Confirmación
 */
export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { number: 1, label: 'Detalles' },
    { number: 2, label: 'Pago' },
    { number: 3, label: 'Confirmación' },
  ];

  return (
    <div className="mb-8">
      {/* Título y paso actual */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Proceso de reserva</h2>
        <span className="text-sm text-gray-600">
          Paso {currentStep} de 3
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="relative">
        {/* Barra de fondo */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Barra de progreso (rellena) */}
          <div
            className="h-full bg-acento-200 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>

        {/* Puntos de paso */}
        <div className="flex justify-between mt-4">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center flex-1"
              >
                {/* Círculo del paso */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? 'bg-acento-200 text-white'
                      : isCurrent
                      ? 'bg-acento-200 text-white ring-4 ring-red-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Etiqueta del paso */}
                <span
                  className={`mt-2 text-sm font-medium ${
                    isCompleted || isCurrent
                      ? 'text-acento-200'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

