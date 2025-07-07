'use client';

import React from 'react';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { StoreSettings } from '@/components/seller/StoreSettings';

export default function SettingsPage() {
  return (
    <SellerLayout>
      <div className="flex min-h-screen bg-bg-100">
        <SellerSidebar />
        <main className="flex-1 overflow-auto">
          <StoreSettings />
        </main>
      </div>
    </SellerLayout>
  );
}
