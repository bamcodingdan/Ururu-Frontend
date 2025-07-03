import React from 'react';
import { ProductCard } from '@/components/product';
import { mockHistoryProducts } from '@/data/history';
import { CustomLayout } from '@/components/layout/layouts';

export default function HistoryPage() {
  return (
    <CustomLayout
      showTopBar={true}
      showSearchBar={true}
      showMainNav={true}
      showFooter={true}
      showBottomNav={true}
    >
      <div className="mx-auto w-full max-w-[1248px] px-6 py-8 md:px-9 md:py-10 xl:px-12">
        {/* 페이지 타이틀 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-100 md:text-3xl">최근 본 상품</h1>
          <p className="mt-2 text-sm text-text-200 md:text-base">
            최근에 조회한 상품들을 확인해보세요
          </p>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockHistoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 빈 상태 (상품이 없을 때) */}
        {mockHistoryProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-6xl">🛍️</div>
            <h2 className="mb-2 text-xl font-semibold text-text-100">최근 본 상품이 없어요</h2>
            <p className="text-sm text-text-200">상품을 둘러보시면 여기에 표시됩니다</p>
          </div>
        )}
      </div>
    </CustomLayout>
  );
}
