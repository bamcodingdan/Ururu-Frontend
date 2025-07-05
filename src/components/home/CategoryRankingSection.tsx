'use client';

import React, { useState } from 'react';
import { ProductCard } from '@/components/product';
import type { CategoryRanking } from '@/data/home';

interface CategoryRankingSectionProps {
  categories: CategoryRanking[];
  className?: string;
}

export function CategoryRankingSection({
  categories,
  className = '',
}: CategoryRankingSectionProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  if (!categories.length) return null;

  const activeCategoryData = categories[activeCategory];

  return (
    <section className={`w-full ${className}`}>
      {/* 섹션 헤더 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-100 md:text-2xl">카테고리 랭킹</h2>
        <p className="mt-1 text-sm text-text-200 md:text-base">
          카테고리별 인기 상품을 확인해보세요
        </p>
      </div>

      {/* 카테고리 탭 */}
      <div className="mb-6">
        {/* 모바일/태블릿: 스크롤 가능한 탭 */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto md:hidden">
          {categories.map((category, index) => (
            <button
              key={category.category}
              className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                index === activeCategory
                  ? 'bg-primary-300 text-text-on'
                  : 'bg-bg-200 text-text-200 hover:bg-bg-300'
              }`}
              onClick={() => setActiveCategory(index)}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* 데스크탑: 넓은 탭 */}
        <div className="hidden md:flex md:gap-4">
          {categories.map((category, index) => (
            <button
              key={category.category}
              className={`rounded-lg px-6 py-3 text-base font-medium transition-colors hover:bg-bg-200 ${
                index === activeCategory ? 'bg-primary-300 text-text-on' : 'bg-bg-100 text-text-200'
              }`}
              onClick={() => setActiveCategory(index)}
            >
              {category.category}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 리스트 */}
      <div>
        {/* 모바일/태블릿: 세로 리스트 */}
        <div className="space-y-4 md:hidden">
          {activeCategoryData.products.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4 rounded-xl bg-bg-100 p-4">
              {/* 랭킹 번호 */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-300">
                {index + 1}
              </div>

              {/* 상품 정보 */}
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium text-text-100">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary-300">
                    {product.discountRate}%
                  </span>
                  <span className="text-sm text-text-300 line-through">
                    {product.originalPrice.toLocaleString()}원
                  </span>
                  <span className="text-lg font-bold text-text-100">
                    {product.price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑: 그리드 레이아웃 */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {activeCategoryData.products.map((product, index) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} rank={index + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
