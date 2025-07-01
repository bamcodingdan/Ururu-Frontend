import React from 'react';

interface BeautyProfilePriceRangeProps {
  minPrice: string;
  maxPrice: string;
}

export function BeautyProfilePriceRange({ minPrice, maxPrice }: BeautyProfilePriceRangeProps) {
  const formatPrice = (price: string) => {
    return price ? Number(price).toLocaleString() : '최소 가격';
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text-100">선호 가격대</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="rounded-lg border border-bg-300 bg-bg-200 px-4 py-3 text-sm text-text-200">
            {formatPrice(minPrice)}원
          </div>
        </div>
        <div className="flex items-center text-text-300">~</div>
        <div className="flex-1">
          <div className="rounded-lg border border-bg-300 bg-bg-200 px-4 py-3 text-sm text-text-200">
            {formatPrice(maxPrice)}원
          </div>
        </div>
      </div>
    </div>
  );
}
