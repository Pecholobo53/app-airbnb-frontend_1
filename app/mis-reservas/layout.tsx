// app/mis-reservas/layout.tsx
import { UserPanelWrapper } from '@/components/user/UserPanelWrapper';

export default function MisReservasLayout({ children }: { children: React.ReactNode }) {
  return <UserPanelWrapper>{children}</UserPanelWrapper>;
}
