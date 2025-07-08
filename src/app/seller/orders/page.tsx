'use client';

import { SellerLayout } from '@/components/seller/SellerLayout';
import { EmptyPage } from '@/components/seller/common';

export default function OrdersPage() {
  return (
    <SellerLayout>
      <EmptyPage title="주문 관리 준비중이에요" />
    </SellerLayout>
  );
}
