import React from 'react';
import type { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Truck, Clock } from 'lucide-react';
import { calculateProgress } from '@/types/product';

interface ProductInfoProps {
  product: Product;
  className?: string;
  variant?: 'mobile' | 'desktop';
}

export const ProductInfo = ({ product, className = '', variant = 'mobile' }: ProductInfoProps) => {
  const isDesktop = variant === 'desktop';

  // 현재 할인율 계산 (API 데이터 기반)
  const currentDiscountRate = product.discountRate;

  // 다음 리워드 단계 찾기
  const nextStage = product.rewardTiers.find((tier) => product.participants < tier.participants);
  const remainingForNextReward = nextStage ? nextStage.participants - product.participants : 0;

  // 현재 달성된 최고 단계 찾기
  const currentAchievedStage = product.rewardTiers
    .filter((tier) => tier.achieved)
    .sort((a, b) => b.participants - a.participants)[0];

  // 진행률 계산 (다음 목표 기준)
  const progressTarget = nextStage
    ? nextStage.participants
    : product.rewardTiers[product.rewardTiers.length - 1]?.participants ||
      product.targetParticipants;
  const progressValue = Math.min(100, (product.participants / progressTarget) * 100);

  return (
    <div className={className}>
      {/* 상품 제목 */}
      <div
        className={`mb-6 font-semibold text-text-100 ${
          isDesktop ? 'text-2xl' : 'text-xl md:text-2xl'
        }`}
      >
        {product.name}
      </div>

      {/* 가격 정보 */}
      <div className={`mb-6 flex items-center gap-3 ${isDesktop ? 'gap-3.5' : 'gap-3'}`}>
        <span
          className={`font-bold text-primary-300 ${
            isDesktop ? 'text-3xl' : 'text-2xl md:text-3xl'
          }`}
        >
          {currentDiscountRate}%
        </span>
        <span
          className={`font-normal text-text-300 line-through ${
            isDesktop ? 'text-xl' : 'text-lg md:text-xl'
          }`}
        >
          {product.originalPrice.toLocaleString()}원
        </span>
        <span
          className={`font-bold text-primary-300 ${
            isDesktop ? 'text-3xl' : 'text-2xl md:text-3xl'
          }`}
        >
          {/* 현재 할인율 적용된 최저가 표시 */}
          {Math.round((product.originalPrice * (100 - currentDiscountRate)) / 100).toLocaleString()}
          원
        </span>
      </div>

      {/* 공동구매 정보 */}
      <Card
        className={`mb-6 flex w-full items-center gap-4 rounded-lg border-none bg-primary-100 ${
          isDesktop ? 'px-6 py-3' : 'px-4 py-3 md:px-6 md:py-4'
        }`}
      >
        <CardContent className="flex items-center gap-4 bg-transparent p-0">
          <Clock
            className={`text-primary-300 ${isDesktop ? 'h-5 w-5' : 'h-4 w-4 md:h-5 md:w-5'}`}
          />
          <div className="text-sm font-normal text-primary-300">
            공동 구매 마감까지 <span className="font-semibold">{product.remainingDays}일</span>{' '}
            남았어요!
          </div>
        </CardContent>
      </Card>

      {/* 참여 정보 */}
      <div
        className={`mb-6 flex w-full flex-col items-start gap-3 ${isDesktop ? 'gap-4' : 'gap-3'}`}
      >
        <div className={`flex items-center gap-2 ${isDesktop ? 'gap-3' : 'gap-2'}`}>
          <span
            className={`font-bold text-text-100 ${isDesktop ? 'text-2xl' : 'text-xl md:text-2xl'}`}
          >
            {product.participants}
          </span>
          <span className={`text-text-100 ${isDesktop ? 'text-base' : 'text-sm md:text-base'}`}>
            명 참여중
          </span>
          {nextStage && (
            <span className={`text-text-100 ${isDesktop ? 'text-sm' : 'text-xs md:text-sm'}`}>
              다음 리워드까지 {remainingForNextReward}명 남았어요!
            </span>
          )}
        </div>
        {/* 진행률 바 */}
        <div className={`flex w-full flex-col gap-2 ${isDesktop ? 'gap-3' : 'gap-2'}`}>
          <Progress value={progressValue} className="h-2 bg-primary-100" />
          <div
            className={`w-full text-right text-text-100 ${
              isDesktop ? 'text-xs' : 'text-xs md:text-sm'
            }`}
          >
            {product.participants} / {progressTarget}명
          </div>
        </div>
        {/* 리워드 단계 */}
        <div className="flex w-full flex-col gap-2">
          {product.rewardTiers.map((tier, index) => {
            // 현재 단계가 달성되었는지 확인 (실시간)
            const isAchieved = product.participants >= tier.participants;
            // 다음 목표 단계인지 확인 (달성되지 않았고, 다음 단계인 경우)
            const isNext = !isAchieved && nextStage?.participants === tier.participants;

            return (
              <Card
                key={index}
                className={`flex w-full items-center justify-between rounded-lg border-none ${
                  isDesktop ? 'px-6 py-3' : 'px-4 py-3 md:px-6 md:py-4'
                } ${
                  isAchieved
                    ? 'bg-gradient-to-r from-primary-200 to-primary-300 text-text-on'
                    : isNext
                      ? 'bg-gradient-to-r from-primary-200 to-primary-300 text-text-on shadow-lg'
                      : 'bg-primary-100 text-text-100'
                }`}
              >
                <CardContent className="flex w-full items-center justify-between bg-transparent p-0">
                  <span className={`font-normal ${isDesktop ? 'text-sm' : 'text-xs md:text-sm'}`}>
                    {tier.participants}명 달성 시
                  </span>
                  <span className={`font-bold ${isDesktop ? 'text-base' : 'text-sm md:text-base'}`}>
                    {tier.discount}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 배송 정보 */}
      <div className={`mb-6 flex items-start gap-4 ${isDesktop ? 'gap-6' : 'gap-4'}`}>
        <span
          className={`font-medium text-text-100 ${
            isDesktop ? 'text-base' : 'text-sm md:text-base'
          }`}
        >
          배송
        </span>
        <div className={`flex flex-col gap-1 ${isDesktop ? 'gap-2' : 'gap-1'}`}>
          <div className={`flex items-center gap-2 ${isDesktop ? 'gap-3' : 'gap-2'}`}>
            <Truck
              className={`text-primary-200 ${isDesktop ? 'h-6 w-6' : 'h-5 w-5 md:h-6 md:w-6'}`}
            />
            <span className={`text-text-100 ${isDesktop ? 'text-base' : 'text-sm md:text-base'}`}>
              {product.shippingInfo.type}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${isDesktop ? 'gap-3' : 'gap-2'}`}>
            <span className={`text-text-100 ${isDesktop ? 'text-base' : 'text-sm md:text-base'}`}>
              {product.shippingInfo.description}
            </span>
          </div>
          <span className={`text-text-200 ${isDesktop ? 'text-xs' : 'text-xs md:text-sm'}`}>
            {product.shippingInfo.shippingFee}
          </span>
        </div>
      </div>
    </div>
  );
};
