'use client';

import { FullLayout } from '@/components/layout';
import { CategorySelector } from '@/components/ranking';
import { ProductGrid } from '@/components/product';
import { useRanking } from '@/hooks';

export default function RankingPage() {
  const { selectedCategory, handleCategoryChange, rankingProducts } = useRanking();

  return (
    <FullLayout>
      <div className="container mx-auto max-w-[1280px] px-6 py-8 md:px-9 md:py-10 xl:px-12">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-100">카테고리 랭킹</h1>
          <p className="mt-2 text-sm text-text-200">인기 상품들을 카테고리별로 확인해보세요</p>
        </div>

        {/* 카테고리 선택 */}
        <div className="mb-8">
          <CategorySelector
            categories={[
              { value: 'all', label: '전체' },
              { value: 'skincare', label: '스킨케어' },
              { value: 'makeup', label: '메이크업' },
              { value: 'mask', label: '마스크팩' },
              { value: 'cleansing', label: '클렌징' },
              { value: 'suncare', label: '선케어' },
              { value: 'perfume', label: '향수' },
              { value: 'haircare', label: '헤어케어' },
              { value: 'bodycare', label: '바디케어' },
            ]}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* 상품 그리드 */}
        <ProductGrid products={rankingProducts.map((item) => item.product)} showRanking={true} />
      </div>
    </FullLayout>
  );
}
