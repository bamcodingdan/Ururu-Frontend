'use client';

import React, { useState } from 'react';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { ProductManagement } from '@/components/seller/ProductManagement';

export default function ProductsPage() {
  return (
    <SellerLayout>
      <div className="flex min-h-screen bg-bg-100">
        <SellerSidebar />
        <main className="flex-1 overflow-auto">
          <ProductManagement />
        </main>
      </div>
    </SellerLayout>
  );
}
