'use client';

import React, { useEffect, useState } from 'react';
import { categoryItems } from '@/data/categories';
import { CenteredSectionHeader } from '@/components/common/CenteredSectionHeader';
import { CategoryTabs } from './CategoryTabs';
import { MobileProductList } from './MobileProductList';
import { DesktopProductGrid } from './DesktopProductGrid';
import { fetchGroupBuyCategoryTop6 } from '@/services/groupbuyService';
import type { GroupBuyTop3 } from '@/types/groupbuy';
import type { Product } from '@/types/product';

// 카테고리명과 API categoryId 매핑
const CATEGORY_ID_MAP: Record<string, number> = {
  스킨케어: 2,
  마스크팩: 15,
  클렌징: 25,
  선케어: 44,
  메이크업: 63,
  향수: 81,
  바디케어: 113,
};

function convertToProduct(item: GroupBuyTop3): Product {
  return {
    id: String(item.id),
    name: item.title,
    mainImage: item.thumbnailUrl,
    thumbnails: [],
    detailImages: [],
    price: item.displayFinalPrice,
    originalPrice: item.startPrice,
    discountRate: item.maxDiscountRate,
    point: 0,
    participants: item.orderCount,
    targetParticipants: 0,
    remainingDays: Math.max(
      0,
      Math.ceil((new Date(item.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    ),
    category: { main: '', sub: '' },
    shippingInfo: { type: '', description: '', shippingFee: '' },
    rewardTiers: [],
    options: [],
  };
}

export function CategoryRankingSection({ className = '' }: { className?: string }) {
  const mainCategories = categoryItems
    .map((cat) => cat.title)
    .filter((title) => CATEGORY_ID_MAP[title]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Product[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MOBILE_PAGE_SIZE = 3;
  const activeCategoryTitle = mainCategories[activeCategory];
  const activeCategoryId = CATEGORY_ID_MAP[activeCategoryTitle];
  const activeProducts = productsByCategory[activeCategoryId] || [];

  useEffect(() => {
    // 이미 불러온 카테고리는 캐시
    if (productsByCategory[activeCategoryId] !== undefined) return;
    setLoading(true);
    setError(null);
    fetchGroupBuyCategoryTop6(activeCategoryId)
      .then((res) => {
        setProductsByCategory((prev) => ({
          ...prev,
          [activeCategoryId]: res.data.map(convertToProduct),
        }));
      })
      .catch(() => {
        setError('카테고리 랭킹 데이터를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryId]);

  const handleCategoryChange = (index: number) => {
    setActiveCategory(index);
    setMobilePage(0);
  };

  const handleMobilePageReset = () => {
    setMobilePage(0);
  };

  const handleMobilePageChange = (page: number) => {
    setMobilePage(page);
  };

  return (
    <section className={`w-full ${className}`}>
      <CenteredSectionHeader
        title="카테고리 랭킹"
        description="카테고리별 인기 상품을 확인해보세요"
        className="mb-6"
      />
      <CategoryTabs
        categories={mainCategories.map((cat) => ({ category: cat, products: [] }))}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onMobilePageReset={handleMobilePageReset}
      />
      <div>
        {loading && <div className="text-center text-sm text-text-200">로딩 중...</div>}
        {error && <div className="text-center text-sm text-red-400">{error}</div>}
        {!loading && !error && activeProducts.length === 0 && (
          <div className="text-center text-sm text-text-200">랭킹 데이터가 없습니다.</div>
        )}
        {!loading && !error && activeProducts.length > 0 && (
          <>
            <MobileProductList
              products={activeProducts}
              currentPage={mobilePage}
              pageSize={MOBILE_PAGE_SIZE}
              onPageChange={handleMobilePageChange}
            />
            <DesktopProductGrid products={activeProducts} />
          </>
        )}
      </div>
    </section>
  );
}
