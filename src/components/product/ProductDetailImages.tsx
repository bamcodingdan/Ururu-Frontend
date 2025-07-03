import React from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';

interface ProductDetailImagesProps {
  product: Product;
  className?: string;
}

export const ProductDetailImages: React.FC<ProductDetailImagesProps> = ({
  product,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {product.detailImages.map((imageSrc, index) => (
        <div key={index} className="w-full">
          <Image
            src={imageSrc}
            alt={`${product.name} 상세 이미지 ${index + 1}`}
            width={1200}
            height={800}
            className="w-full rounded-lg object-cover"
            priority={false}
          />
        </div>
      ))}
    </div>
  );
};
