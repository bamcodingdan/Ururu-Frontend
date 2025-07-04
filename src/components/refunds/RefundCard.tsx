import React from 'react';
import Image from 'next/image';
import { Refund, getRefundTypeLabel } from '@/types/refund';
import { formatDate, formatPrice } from '@/lib/format-utils';
import { StatusBadge } from '@/components/common';

interface RefundCardProps {
  refund: Refund;
}

export function RefundCard({ refund }: RefundCardProps) {
  return (
    <div className="rounded-lg bg-bg-100 py-6">
      {/* 환불 헤더 */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-bold text-text-100">{formatDate(refund.createdAt)}</div>
            <div className="text-sm text-text-200">환불번호: {refund.refundNumber}</div>
          </div>
          {/* 데스크톱에서는 오른쪽, 모바일에서는 상단에 뱃지 배치 */}
          <div className="hidden md:block">
            <StatusBadge status={refund.status} />
          </div>
        </div>
        {/* 모바일에서는 헤더 아래에 뱃지 배치 */}
        <div className="mt-3 flex md:hidden">
          <StatusBadge status={refund.status} />
        </div>
      </div>

      {/* 환불 상품들 */}
      <div className="space-y-6">
        {refund.items.map((item) => (
          <div key={item.id}>
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
                  <p className="text-xl font-bold text-text-100">
                    {formatPrice(item.refundAmount)}원
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 환불 요약 */}
      <div className="mt-4 border-t border-bg-300 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-base font-semibold text-text-100">
            총 {formatPrice(refund.amount)}원
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-200">환불 사유</span>
            <span className="text-sm font-medium text-text-100">
              {getRefundTypeLabel(refund.type)}
            </span>
          </div>
          {/* 예상 완료일 (승인된 경우만) */}
          {refund.status === 'APPROVED' && refund.estimatedCompletionDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-200">예상 완료일</span>
              <span className="text-sm font-medium text-text-100">
                {formatDate(refund.estimatedCompletionDate)}
              </span>
            </div>
          )}
          {/* 환불 완료일 (완료된 경우만) */}
          {refund.status === 'COMPLETED' && refund.refundedAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-200">환불 완료일</span>
              <span className="text-sm font-medium text-text-100">
                {formatDate(refund.refundedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 거부 사유 (거부된 경우만) */}
      {refund.status === 'REJECTED' && refund.rejectReason && (
        <div className="mt-4 rounded-lg bg-bg-200 p-4">
          <div className="mb-1 text-sm font-medium text-text-100">거부 사유</div>
          <div className="text-sm text-text-200">{refund.rejectReason}</div>
        </div>
      )}
    </div>
  );
}
