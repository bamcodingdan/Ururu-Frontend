'use client';

import { SellerLayout } from '@/components/seller/SellerLayout';
import { ProductRegistration } from '@/components/seller/ProductRegistration';

export default function NewProductPage() {
  return (
    <SellerLayout>
      <ProductRegistration />
    </SellerLayout>
  );
}
