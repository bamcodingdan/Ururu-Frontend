'use client';

import { useState, useEffect } from 'react';
import { rankingCategories } from '@/data/ranking';
import { fetchGroupBuyRankingTop100 } from '@/services/groupbuyService';
import type { GroupBuyTop3 } from '@/types/groupbuy';
import type { Product } from '@/types/product';

const CATEGORY_ID_MAP: Record<string, number> = {
  skincare: 2,
  mask: 15,
  cleansing: 25,
  suncare: 44,
  makeup: 63,
  perfume: 81,
  haircare: 86,
  bodycare: 113,
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

export const useRanking = () => {
  const [selectedCategory, setSelectedCategory] = useState('skincare');
  const [rankingProducts, setRankingProducts] = useState<{ product: Product; rank: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 전체(all)는 API 연동하지 않음
    if (selectedCategory === 'all') {
      setRankingProducts([]);
      return;
    }
    const categoryId = CATEGORY_ID_MAP[selectedCategory];
    if (!categoryId) {
      setRankingProducts([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetchGroupBuyRankingTop100(categoryId)
      .then((res) => {
        setRankingProducts(
          res.data.map((item, idx) => ({ product: convertToProduct(item), rank: idx + 1 })),
        );
      })
      .catch(() => {
        setError('랭킹 데이터를 불러오지 못했습니다.');
        setRankingProducts([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return {
    categories: rankingCategories,
    selectedCategory,
    rankingProducts,
    loading,
    error,
    handleCategoryChange,
  };
};
