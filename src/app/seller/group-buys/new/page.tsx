'use client';

import React from 'react';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { GroupBuyRegistration } from '@/components/seller/GroupBuyRegistration';

export default function NewGroupBuyPage() {
  return (
    <SellerLayout>
      <div className="flex min-h-screen bg-bg-100">
        <SellerSidebar />
        <main className="flex-1 overflow-auto">
          <GroupBuyRegistration />
        </main>
      </div>
    </SellerLayout>
  );
}
