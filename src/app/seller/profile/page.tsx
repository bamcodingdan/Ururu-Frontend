'use client';

import { SellerLayout } from '@/components/seller/SellerLayout';
import { EmptyPage } from '@/components/seller/common';

export default function ProfilePage() {
  return (
    <SellerLayout>
      <EmptyPage title="준비중이에요" />
    </SellerLayout>
  );
}
