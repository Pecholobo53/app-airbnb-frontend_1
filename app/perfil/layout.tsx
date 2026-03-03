// app/perfil/layout.tsx
import { UserPanelWrapper } from '@/components/user/UserPanelWrapper';

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return <UserPanelWrapper>{children}</UserPanelWrapper>;
}
