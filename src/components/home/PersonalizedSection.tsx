'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product';
import type { Product } from '@/types/product';
import { FORM_STYLES } from '@/constants/form-styles';
import { CenteredSectionHeader } from '@/components/common/CenteredSectionHeader';

interface PersonalizedSectionProps {
  products: Product[];
  className?: string;
  loading?: boolean;
}

export function PersonalizedSection({
  products,
  className = '',
  loading = false,
}: PersonalizedSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 페이지네이션 상태
  const PAGE_SIZE = 8;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const pagedProducts = products.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  // products가 바뀔 때마다 currentPage를 0으로 리셋
  useEffect(() => {
    setCurrentPage(0);
  }, [products]);

  const handleNextPage = () => {
    if (currentPage + 1 >= totalPages) {
      setCurrentPage(0); // 처음으로
    } else {
      setCurrentPage((prev) => prev + 1);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  };

  // 로딩 중이거나 products가 없으면 로딩 상태 표시
  if (loading) {
    return (
      <section className={`w-full ${className}`}>
        <CenteredSectionHeader
          title="취향 맞춤"
          description="회원님만을 위한 맞춤 상품을 추천해드려요"
          className="mb-6"
        />
        <div className="py-8 text-center">
          <p>AI 추천 상품을 불러오는 중...</p>
        </div>
      </section>
    );
  }

  // products가 없으면 빈 상태 표시
  if (!products.length) {
    return (
      <section className={`w-full ${className}`}>
        <CenteredSectionHeader
          title="취향 맞춤"
          description="회원님만을 위한 맞춤 상품을 추천해드려요"
          className="mb-6"
        />
        <div className="py-8 text-center">
          <p>추천 상품이 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full ${className}`}>
      {/* 섹션 헤더 */}
      <CenteredSectionHeader
        title="취향 맞춤"
        description="회원님만을 위한 맞춤 상품을 추천해드려요"
        className="mb-6"
      />

      {/* 모바일/태블릿: 가로 스크롤 */}
      <div className="relative md:hidden">
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {pagedProducts.map((product) => (
            <div key={product.id} className="w-60 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* 데스크탑: 그리드 레이아웃 */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {pagedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 더보기/페이지 버튼 */}
        {totalPages > 1 && (
          <div className="mt-8 text-center">
            <Button className={FORM_STYLES.button.pinkOutline} onClick={handleNextPage}>
              {`AI 추천 더보기 ${currentPage + 1} | ${totalPages}`}
            </Button>
          </div>
        )}
      </div>

      {/* 모바일: 더보기/페이지 버튼 */}
      {totalPages > 1 && (
        <div className="mt-8 text-center md:hidden">
          <Button className={FORM_STYLES.button.pinkOutline} onClick={handleNextPage}>
            {`AI 추천 더보기 ${currentPage + 1} | ${totalPages}`}
          </Button>
        </div>
      )}
    </section>
  );
}
