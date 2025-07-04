import React from 'react';
import Image from 'next/image';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { FORM_STYLES } from '@/constants/form-styles';

// 상태 뱃지 (더 작게)
function StatusBadge({ status }: { status: 'in_progress' | 'confirmed' | 'failed' }) {
  let icon, text, bg, textColor;
  if (status === 'in_progress') {
    icon = <Clock className="mr-1 h-4 w-4 text-primary-300" />;
    text = '공구 진행중';
    bg = 'bg-primary-100';
    textColor = 'text-primary-300';
  } else if (status === 'confirmed') {
    icon = <CheckCircle className="mr-1 h-4 w-4 text-primary-300" />;
    text = '공구 확정';
    bg = 'bg-primary-100';
    textColor = 'text-primary-300';
  } else {
    icon = <XCircle className="mr-1 h-4 w-4 text-text-300" />;
    text = '공구 실패';
    bg = 'bg-bg-200';
    textColor = 'text-text-300';
  }
  return (
    <span
      className={`flex items-center rounded-lg px-3 py-1.5 text-xs font-medium ${bg} ${textColor}`}
    >
      {icon}
      {text}
    </span>
  );
}

// 리워드 달성 그라데이션 뱃지 (더 작게, 캐릭터 왼쪽)
function RewardBadge({ percent }: { percent: number }) {
  return (
    <span className="flex items-center rounded-lg bg-gradient-to-r from-primary-200 to-primary-300 px-3 py-1.5 text-xs font-medium text-text-on">
      <Image src="/ururu-gradient.svg" alt="캐릭터" width={12} height={12} className="mr-1" />
      현재 {percent}% 달성
    </span>
  );
}

interface OrderCardProps {
  order: Order & { status: 'in_progress' | 'confirmed' | 'failed' };
}

export function OrderCard({ order }: OrderCardProps) {
  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\./g, '.');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  // 리워드 달성 뱃지 노출 조건: 진행중/확정 + progressRate >= 20
  const showRewardBadge =
    (order.status === 'in_progress' || order.status === 'confirmed') && order.progressRate >= 20;

  const getReviewButton = (item: Order['items'][0]) => {
    if (item.hasReview) {
      return (
        <Button className="h-8 min-w-[80px] rounded-lg border border-bg-300 bg-bg-100 text-xs text-text-300 shadow-none transition-colors hover:bg-bg-200">
          리뷰 보기
        </Button>
      );
    }

    return (
      <Button className="h-8 min-w-[80px] rounded-lg border border-bg-300 bg-bg-100 text-xs text-text-300 shadow-none transition-colors hover:bg-bg-200">
        리뷰 작성
      </Button>
    );
  };

  const getRefundButton = () => {
    const isRefundExpired = new Date() > order.refundDeadline;

    return (
      <Button
        disabled={!order.canRefund || isRefundExpired}
        className={FORM_STYLES.button.refundButton + ' h-10 min-w-[120px] lg:w-full'}
      >
        {isRefundExpired ? '환불 기간 만료' : '환불하기'}
      </Button>
    );
  };

  const getDeliveryButton = () => {
    if (order.deliveryStatus === 'completed') {
      return (
        <Button disabled className={FORM_STYLES.button.submit + ' h-10 min-w-[120px] lg:w-full'}>
          배송 완료
        </Button>
      );
    }

    return (
      <Button className={FORM_STYLES.button.deliveryButton + ' h-10 min-w-[120px] lg:w-full'}>
        배송 조회
      </Button>
    );
  };

  return (
    <div className="rounded-lg bg-bg-100 p-0">
      {/* 주문 헤더 */}
      <div className="mb-4 flex flex-col gap-2">
        <div className="text-lg font-bold text-text-100">{formatDate(order.orderDate)}</div>
        <div className="text-sm text-text-200">주문번호: {order.orderNumber}</div>
      </div>
      {/* 주문 상품들 */}
      <div className="space-y-6">
        {order.items.map((item) => (
          <div key={item.id}>
            {/* 상품별 뱃지: 상태/리워드 */}
            <div className="mb-2 flex gap-2">
              <StatusBadge status={order.status as any} />
              {showRewardBadge && <RewardBadge percent={order.progressRate} />}
            </div>
            <div className="flex gap-3">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-bg-200 bg-bg-100">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="line-clamp-2 text-base font-semibold text-text-100">
                    {item.productName}
                  </h3>
                  <p className="line-clamp-2 text-xs text-text-200">옵션: {item.option}</p>
                  <p className="text-xs text-text-200">수량: {item.quantity}개</p>
                  <p className="text-xl font-bold text-text-100">{formatPrice(item.price)}원</p>
                </div>
                {/* 모바일에서는 리뷰 버튼을 상품 정보 아래에 배치 */}
                <div className="mt-3 flex items-center lg:hidden">{getReviewButton(item)}</div>
              </div>
              {/* 데스크톱에서는 리뷰 버튼을 오른쪽에 배치 */}
              <div className="hidden items-center lg:flex">{getReviewButton(item)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 주문 요약 */}
      <div className="mt-4 border-t border-bg-300 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-base font-semibold text-text-100">
            총 {formatPrice(order.totalAmount)}원 (배송비 포함)
          </span>
        </div>
        <div className="flex gap-2">
          {getRefundButton()}
          {getDeliveryButton()}
        </div>
      </div>
    </div>
  );
}
