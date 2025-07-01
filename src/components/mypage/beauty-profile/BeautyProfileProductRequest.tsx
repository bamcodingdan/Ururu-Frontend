import React from 'react';

interface BeautyProfileProductRequestProps {
  productRequest: string;
}

export function BeautyProfileProductRequest({ productRequest }: BeautyProfileProductRequestProps) {
  if (!productRequest) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text-100">이런 상품을 추천해주세요</h2>
      <div className="rounded-lg border border-bg-300 bg-bg-200 p-4">
        <p className="text-sm leading-relaxed text-text-100">{productRequest}</p>
      </div>
    </div>
  );
}
