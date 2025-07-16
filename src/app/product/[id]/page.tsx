'use client';

import React, { useState, useEffect } from 'react';
import { DetailMain, OrderBox, OrderFloatingBar } from '@/components/product';
import { CustomLayout } from '@/components/layout/layouts';
import { getGroupBuyDetail } from '@/services/groupbuyService';
import type { GroupBuyDetail } from '@/types/groupbuy';
import type { Product } from '@/types/product';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [groupBuyData, setGroupBuyData] = useState<GroupBuyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GroupBuy 데이터를 Product 형태로 변환하는 함수
  const convertGroupBuyToProduct = (groupBuy: GroupBuyDetail): Product => {
    // 남은 일수 계산
    const remainingDays = Math.max(
      0,
      Math.ceil((new Date(groupBuy.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    );

    // 이미지 배열 생성 (thumbnailUrl을 첫 번째로, images를 순서대로)
    const sortedImages = [...groupBuy.images].sort((a, b) => a.displayOrder - b.displayOrder);
    const thumbnails = sortedImages.map((img) => img.imageUrl);
    const detailImages = sortedImages.map((img) => img.imageUrl);

    // 옵션 변환
    const options = groupBuy.options.map((option) => ({
      id: String(option.id),
      name: option.optionName,
      price: option.salePrice,
      image: null, // API에서 이미지 URL을 받지만 File 형태가 필요하므로 null
      fullIngredients: option.fullIngredients,
    }));

    // 할인 단계를 rewardTiers로 변환
    const rewardTiers = groupBuy.discountStages.map((stage) => ({
      participants: stage.minQuantity,
      discount: `${stage.discountRate}% 할인`,
      achieved: groupBuy.currentOrderCount >= stage.minQuantity,
    }));

    return {
      id: String(groupBuy.id),
      name: groupBuy.title,
      mainImage: groupBuy.thumbnailUrl,
      thumbnails,
      detailImages,
      price: groupBuy.displayFinalPrice,
      originalPrice: groupBuy.startPrice,
      discountRate: groupBuy.maxDiscountRate,
      point: 0, // API에 point 정보가 없으므로 0으로 설정
      participants: groupBuy.currentOrderCount,
      targetParticipants: groupBuy.discountStages[0]?.minQuantity || 0,
      remainingDays,
      category: {
        main: groupBuy.product.categoryIds[0] || 'general',
        sub: groupBuy.product.categoryIds[1] || '',
      },
      shippingInfo: {
        type: '우르르 배송 상품',
        description: '공구 마감 후 평균 4일 이내 배송',
        shippingFee: '기본 배송비 3,000원',
      },
      rewardTiers,
      options,
    };
  };

  useEffect(() => {
    const fetchGroupBuyData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const groupBuyId = parseInt(params.id, 10);

        if (isNaN(groupBuyId)) {
          setError('잘못된 공동구매 ID입니다.');
          return;
        }

        const response = await getGroupBuyDetail(groupBuyId);
        console.log('API Response:', response);
        console.log('GroupBuy Data:', response.data);
        setGroupBuyData(response.data);
      } catch (err: any) {
        setError(err.message || '공동구매 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupBuyData();
  }, [params.id]);

  // 로딩 상태
  if (isLoading) {
    return (
      <CustomLayout
        showTopBar={true}
        showSearchBar={true}
        showMainNav={true}
        showFooter={true}
        showBottomNav={false}
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 py-10 pb-24 md:px-9 md:py-12 md:pb-28 xl:flex-row xl:items-start xl:gap-12 xl:px-12 xl:pb-10">
          <div className="py-20 text-center">로딩 중...</div>
        </div>
      </CustomLayout>
    );
  }

  // 에러 상태
  if (error || !groupBuyData) {
    return (
      <CustomLayout
        showTopBar={true}
        showSearchBar={true}
        showMainNav={true}
        showFooter={true}
        showBottomNav={false}
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 py-10 pb-24 md:px-9 md:py-12 md:pb-28 xl:flex-row xl:items-start xl:gap-12 xl:px-12 xl:pb-10">
          <div className="py-20 text-center text-red-500">
            {error || '공동구매 정보를 불러올 수 없습니다.'}
          </div>
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout
      showTopBar={true}
      showSearchBar={true}
      showMainNav={true}
      showFooter={true}
      showBottomNav={false}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 py-10 pb-24 md:px-9 md:py-12 md:pb-28 xl:flex-row xl:items-start xl:gap-12 xl:px-12 xl:pb-10">
        {/* 왼쪽: 상세/리뷰/컨텐츠 */}
        <section className="w-full xl:w-[60%]">
          <DetailMain product={convertGroupBuyToProduct(groupBuyData)} />
        </section>
        {/* 오른쪽: 주문/상품 정보 (데스크탑만) */}
        <aside className="hidden w-full xl:block xl:w-[40%]">
          <OrderBox product={convertGroupBuyToProduct(groupBuyData)} />
        </aside>
      </div>
      {/* 모바일/태블릿 하단 플로팅 바 */}
      <OrderFloatingBar product={convertGroupBuyToProduct(groupBuyData)} />
    </CustomLayout>
  );
}
