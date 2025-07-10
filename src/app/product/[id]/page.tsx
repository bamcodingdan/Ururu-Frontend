'use client';

import { CustomLayout } from '@/components/layout';
import { DetailMain, OrderBox, OrderFloatingBar } from '@/components/product';
import { mockProduct } from '@/data/mock-product';

export default function ProductDetailPage() {

  return (
    <CustomLayout
      showTopBar={true}
      showSearchBar={true}
      showMainNav={true}
      showFooter={true}
      showBottomNav={true}
    >
      <div className="container mx-auto max-w-[1280px] px-6 py-8 md:px-9 md:py-10 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* 왼쪽: 상품 이미지 및 상세 정보 */}
          <div className="lg:col-span-2">
            <DetailMain product={mockProduct} />
          </div>

          {/* 오른쪽: 주문 정보 (데스크탑) */}
          <div className="hidden lg:block">
            <OrderBox product={mockProduct} />
          </div>
        </div>

        {/* 모바일/태블릿: 하단 플로팅 주문 바 */}
        <OrderFloatingBar product={mockProduct} />
      </div>
    </CustomLayout>
  );
}
