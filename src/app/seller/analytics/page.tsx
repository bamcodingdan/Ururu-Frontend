'use client';

import React from 'react';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { AnalyticsDashboard } from '@/components/seller/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <SellerLayout>
      <div className="flex min-h-screen bg-bg-100">
        <SellerSidebar />
        <main className="flex-1 overflow-auto">
          <AnalyticsDashboard />
        </main>
      </div>
    </SellerLayout>
  );
}
