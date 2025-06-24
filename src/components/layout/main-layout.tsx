import { Header } from './header';
import { BottomNavigation } from './bottom-navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="bg-bg-100 min-h-screen">
      <Header />
      <main className="desktop:pb-0 min-h-[calc(100vh-4rem)] pb-16">{children}</main>
      <BottomNavigation />
    </div>
  );
}
