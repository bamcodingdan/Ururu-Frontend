'use client';
import { useState } from 'react';
import { MinimalLayout } from '@/components/layout';
import { categoryItems } from '@/data/categories';
import { fetchGroupBuyByCategoryId } from '@/services/groupbuyService';
import type { GroupBuyTop3 } from '@/types/groupbuy';
import type { Product } from '@/types/product';
import { ProductGrid } from '@/components/product';

// 세부 카테고리명과 categoryId 매핑
const SUBCATEGORY_ID_MAP: Record<string, number> = {
  '스킨/토너': 2,
  '에센스/세럼/앰플': 3,
  크림: 5,
  로션: 8,
  '미스트/오일': 10,
  스킨케어세트: 13,
  '스킨케어 디바이스': 14,
  시트팩: 16,
  패드: 21,
  페이셜팩: 22,
  코팩: 23,
  패치: 24,
  '클렌징폼/젤': 27,
  '오일/밤': 30,
  '워터/밀크': 33,
  '필링&스크럽': 36,
  '티슈/패드': 40,
  '립&아이리무버': 41,
  '클렌징 디바이스': 42,
  선크림: 44,
  선스틱: 45,
  선쿠션: 47,
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

export default function CategoryPage() {
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubClick = async (subTitle: string) => {
    setSelectedSub(subTitle);
    setLoading(true);
    setError(null);
    setProducts([]);
    const categoryId = SUBCATEGORY_ID_MAP[subTitle];
    if (!categoryId) {
      setError('카테고리 ID가 없습니다.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetchGroupBuyByCategoryId(categoryId);
      setProducts(res.data.map(convertToProduct));
    } catch (e: any) {
      setError(e?.message || '공동구매 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MinimalLayout>
      <div className="container py-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-text-100">카테고리</h1>
          <p className="mt-2 text-sm text-text-200">원하는 카테고리를 선택하여 공구를 찾아보세요</p>
        </div>

        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryItems.map((category) => (
            <div
              key={category.title}
              className="rounded-xl border border-bg-300 bg-bg-100 p-4 shadow-sm"
            >
              {/* 메인 카테고리 */}
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-text-100">{category.title}</h2>
              </div>

              {/* 서브 카테고리 */}
              <div className="grid grid-cols-2 gap-2">
                {category.subItems.map((subItem) => (
                  <button
                    key={subItem.title}
                    className="rounded-lg bg-bg-200 px-3 py-2 text-sm text-text-200"
                    onClick={() => handleSubClick(subItem.title)}
                  >
                    {subItem.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 공동구매 리스트 */}
        {selectedSub && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-text-100">{selectedSub} 공동구매</h3>
            {loading && <div className="text-sm text-text-200">로딩 중...</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {!loading && !error && products.length === 0 && (
              <div className="text-sm text-text-200">공동구매 상품이 없습니다.</div>
            )}
            {!loading && !error && products.length > 0 && <ProductGrid products={products} />}
          </div>
        )}
      </div>
    </MinimalLayout>
  );
}
