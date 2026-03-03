// app/favoritos/layout.tsx
import { UserPanelWrapper } from '@/components/user/UserPanelWrapper';

export default function FavoritosLayout({ children }: { children: React.ReactNode }) {
  return <UserPanelWrapper>{children}</UserPanelWrapper>;
}
