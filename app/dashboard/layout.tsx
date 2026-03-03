// app/dashboard/layout.tsx
import { UserPanelWrapper } from '@/components/user/UserPanelWrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <UserPanelWrapper>{children}</UserPanelWrapper>;
}
