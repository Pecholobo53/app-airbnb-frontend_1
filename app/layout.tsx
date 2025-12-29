import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import ConditionalOfferTopBar from '@/components/ConditionalOfferTopBar';
import Header from '@/components/Header';
import { AuthProvider } from '@/lib/auth/auth-context';
import { Toaster } from '@/components/ui/sonner';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans'
});

export const metadata: Metadata = {
  title: 'Ofertas Especiales - Airbnb',
  description: 'Descubre las mejores promociones y ofertas exclusivas en alojamientos únicos de Airbnb',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <AuthProvider>
          <Header />
          <ConditionalOfferTopBar 
            discount="40%" 
            maxUsers={10}
            showTimer={true}
            timerMinutes={60}
          />
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}