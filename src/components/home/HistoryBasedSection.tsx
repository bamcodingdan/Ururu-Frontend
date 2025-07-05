'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product';
import type { Product } from '@/types/product';

interface HistoryBasedSectionProps {
  products: Product[];
  className?: string;
}

export function HistoryBasedSection({ products, className = '' }: HistoryBasedSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!products.length) return null;

  return (
    <section className={`w-full ${className}`}>
      {/* 섹션 헤더 */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-100 md:text-2xl">숏폼에서 본 그 제품</h2>
        <p className="mt-1 text-sm text-text-200 md:text-base">
          최근에 관심을 보인 상품들을 모아봤어요
        </p>
      </div>

      {/* 모바일/태블릿: 2열 카드 레이아웃 */}
      <div className="relative md:hidden">
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide grid grid-cols-2 gap-4 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* 스크롤 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-bg-100/80 absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-text-100 hover:bg-bg-100"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-bg-100/80 absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-text-100 hover:bg-bg-100"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 데스크탑: 4열 이상 와이드 그리드 */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-primary-300 text-primary-300 hover:bg-primary-100"
          >
            더 많은 히스토리 기반 추천 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
