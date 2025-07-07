'use client';

import React from 'react';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { SellerDashboard } from '@/components/seller/SellerDashboard';

export default function SellerPage() {
  return (
    <SellerLayout>
      <div className="flex min-h-screen bg-bg-100">
        <SellerSidebar />
        <main className="flex-1 overflow-auto">
          <SellerDashboard />
        </main>
      </div>
    </SellerLayout>
  );
}
