'use client';

import React from 'react';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { GroupBuyManagement } from '@/components/seller/GroupBuyManagement';

export default function GroupBuyPage() {
  return (
    <SellerLayout>
      <div className="flex min-h-screen bg-bg-100">
        <SellerSidebar />
        <main className="flex-1 overflow-auto">
          <GroupBuyManagement />
        </main>
      </div>
    </SellerLayout>
  );
}
