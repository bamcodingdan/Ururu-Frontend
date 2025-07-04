'use client';

import React from 'react';
import { RankingProductCard } from './RankingProductCard';
import type { Product } from '@/types/product';

interface RankingProduct {
  product: Product;
  rank: number;
}

interface RankingProductGridProps {
  products: RankingProduct[];
  className?: string;
}

export const RankingProductGrid = ({ products, className = '' }: RankingProductGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {products.map(({ product, rank }) => (
        <RankingProductCard key={product.id} product={product} rank={rank} />
      ))}
    </div>
  );
};
