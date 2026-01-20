import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { GoogleAuthProvider } from '@/components/providers/GoogleAuthProvider';
import ConditionalOfferTopBar from '@/components/ConditionalOfferTopBar';
import Header from '@/components/Header';
import { AuthProvider } from '@/lib/auth/auth-context';
import { NotificationProvider } from '@/lib/notifications/notification-context';
import { Toaster } from '@/components/ui/sonner';

const dmSans = DM_Sans({ 
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
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
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <GoogleAuthProvider>
          <AuthProvider>
            <NotificationProvider>
              <Header />
              <ConditionalOfferTopBar 
                discount="40%" 
                maxUsers={10}
                showTimer={true}
                timerMinutes={60}
              />
              {children}
              <Toaster richColors position="top-center" />
            </NotificationProvider>
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}