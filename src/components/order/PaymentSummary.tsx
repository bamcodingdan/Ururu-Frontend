'use client';

import React from 'react';

interface PaymentSummaryProps {
  totalProductPrice: number;
  pointAmount: number;
  shippingFee: number;
  finalPrice: number;
}

export function PaymentSummary({
  totalProductPrice,
  pointAmount,
  shippingFee,
  finalPrice,
}: PaymentSummaryProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-100">최종 결제 금액</h2>
        <span className="text-2xl font-bold text-text-100 md:text-3xl">
          {finalPrice.toLocaleString()}원
        </span>
      </div>

      {/* 상세 내역 */}
      <div className="border-border-100 space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm text-text-200">
          <span>총 상품 금액</span>
          <span>{totalProductPrice.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>포인트 사용</span>
          <span className="text-primary-100">-{pointAmount.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm text-text-200">
          <span>배송비</span>
          <span>{shippingFee.toLocaleString()}원</span>
        </div>
        <div className="border-border-100 flex justify-between border-t pt-2 text-base font-semibold text-text-100">
          <span>합계</span>
          <span>{finalPrice.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}
