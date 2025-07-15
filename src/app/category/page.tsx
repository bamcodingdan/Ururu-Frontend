'use client';
import { useState, useEffect } from 'react';
import { MinimalLayout, SearchBar, MainNav } from '@/components/layout';
import { categoryItems } from '@/data/categories';
import { fetchGroupBuyByCategoryId } from '@/services/groupbuyService';
import type { GroupBuyTop3 } from '@/types/groupbuy';
import type { Product } from '@/types/product';
import { ProductGrid } from '@/components/product';
import { useSearchParams } from 'next/navigation';

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
  '선스프레이/선패치': 49,
  '태닝/애프터선': 52,
  립메이크업: 56,
  베이스메이크업: 63,
  아이메이크업: 74,
  액체향수: 82,
  고체향수: 83,
  바디퍼퓸: 84,
  헤어퍼퓸: 85,
  '샴푸/린스': 87,
  '트리트먼트/팩': 92,
  '두피앰플/토닉': 95,
  헤어에센스: 97,
  '염색약/펌': 100,
  '헤어기기/브러시': 105,
  스타일링: 109,
  '샤워/입욕': 114,
  '로션/오일/미스트': 119,
  핸드케어: 123,
  풋케어: 126,
  '제모/왁싱': 132,
  데오드란트: 138,
  베이비: 143,
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
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const sub = searchParams.get('sub');
    if (sub && sub !== selectedSub) {
      handleSubClick(sub);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <MinimalLayout>
      <SearchBar />
      <MainNav />
      <div className="container mx-auto max-w-[1280px] px-6 py-8 md:px-9 md:py-10 xl:px-12">
        {/* 공동구매 리스트 */}
        {selectedSub && (
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-text-100">{selectedSub} 공동구매</h3>
            {loading && <div className="text-sm text-text-200">로딩 중...</div>}
            {error && error.includes('해당 공동구매를 찾을 수 없습니다.') ? (
              <div className="flex flex-col items-center justify-center py-8 md:py-12">
                <div className="mb-4 text-6xl">💄</div>
                <h2 className="mb-2 text-xl font-semibold text-text-100">
                  해당 카테고리의 공동구매가 없습니다
                </h2>
                <p className="text-text-200">다른 카테고리를 선택해보세요!</p>
              </div>
            ) : (
              error && <div className="text-sm text-red-400">{error}</div>
            )}
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
