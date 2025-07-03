'use client';

import React, { useState } from 'react';
import { LoadMoreButton } from './LoadMoreButton';
import { ProductImage } from './ProductImage';
import type { Product } from '@/types/product';

interface ProductDetailImagesProps {
  product: Product;
  className?: string;
  maxInitialImages?: number;
}

export const ProductDetailImages: React.FC<ProductDetailImagesProps> = ({
  product,
  className = '',
  maxInitialImages = 1,
}) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialImages = product.detailImages.slice(0, maxInitialImages);
  const remainingImages = product.detailImages.slice(maxInitialImages);
  const hasMoreImages = remainingImages.length > 0;

  const handleLoadMore = async () => {
    setIsLoading(true);
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowAllImages(true);
    setIsLoading(false);
  };

  const handleShowLess = () => {
    setShowAllImages(false);
  };

  // 데스크탑에서만 펼치기 기능 사용
  const displayedImages = showAllImages ? product.detailImages : initialImages;

  return (
    <div className={`w-full ${className}`}>
      {/* 모바일/태블릿: 모든 이미지 표시 */}
      <div className="lg:hidden">
        {product.detailImages.map((imageSrc, index) => (
          <ProductImage
            key={index}
            src={imageSrc}
            alt={`${product.name} 상세 이미지 ${index + 1}`}
            priority={index < 2}
          />
        ))}
      </div>

      {/* 데스크탑: 조건부 이미지 표시 */}
      <div className="hidden lg:block">
        {displayedImages.map((imageSrc, index) => (
          <div key={index} className="relative">
            <ProductImage
              src={imageSrc}
              alt={`${product.name} 상세 이미지 ${index + 1}`}
              priority={index < 2}
            />

            {/* 첫 번째 이미지에만 블러 효과와 버튼 적용 */}
            {index === 0 && hasMoreImages && !showAllImages && (
              <>
                {/* 블러 효과 오버레이 */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />

                {/* 펼치기 버튼 */}
                <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
                  <LoadMoreButton
                    isLoading={isLoading}
                    remainingCount={remainingImages.length}
                    onLoadMore={handleLoadMore}
                    onShowLess={handleShowLess}
                    showAll={showAllImages}
                  />
                </div>
              </>
            )}
          </div>
        ))}

        {/* 접기 버튼 */}
        {showAllImages && hasMoreImages && (
          <div className="flex justify-center py-6">
            <LoadMoreButton
              isLoading={isLoading}
              remainingCount={remainingImages.length}
              onLoadMore={handleLoadMore}
              onShowLess={handleShowLess}
              showAll={showAllImages}
            />
          </div>
        )}
      </div>
    </div>
  );
};
