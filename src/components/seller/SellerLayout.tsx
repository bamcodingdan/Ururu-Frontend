import React from 'react';

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  return <div className="min-h-screen bg-bg-100">{children}</div>;
}
