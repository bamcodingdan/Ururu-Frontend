import { ReactNode } from 'react';
import { SellerSidebar } from './SellerSidebar';

interface SellerLayoutProps {
  children: ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  return (
    <div className="bg-bg-50 flex min-h-screen">
      <SellerSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
