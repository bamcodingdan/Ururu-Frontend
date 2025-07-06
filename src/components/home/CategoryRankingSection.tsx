'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { CategoryRanking } from '@/data/home';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryItems } from '@/data/categories';
import { SectionHeader } from '@/components/common/SectionHeader';

interface CategoryRankingSectionProps {
  categories: CategoryRanking[];
  className?: string;
}

export function CategoryRankingSection({
  categories,
  className = '',
}: CategoryRankingSectionProps) {
  // 대분류 카테고리 목록
  const mainCategories = categoryItems.map((cat) => cat.title);
  // 카테고리별 데이터 매핑 (mock 데이터 없으면 빈 배열)
  const rankingsByCategory = mainCategories.map((cat) => {
    const found = categories.find((r) => r.category === cat);
    return {
      category: cat,
      products: found?.products ?? [],
    };
  });
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const MOBILE_PAGE_SIZE = 3;
  const activeCategoryData = rankingsByCategory[activeCategory];
  const totalMobilePages = Math.ceil(activeCategoryData.products.length / MOBILE_PAGE_SIZE);
  const pagedProducts = activeCategoryData.products.slice(
    mobilePage * MOBILE_PAGE_SIZE,
    (mobilePage + 1) * MOBILE_PAGE_SIZE,
  );
  // 데스크탑용 6개 고정 배열 (부족하면 빈 카드)
  const desktopProducts = [
    ...activeCategoryData.products.slice(0, 6),
    ...Array(Math.max(0, 6 - activeCategoryData.products.length)).fill(null),
  ];

  return (
    <section className={`w-full ${className}`}>
      {/* 섹션 헤더 */}
      <SectionHeader
        title="카테고리 랭킹"
        description="카테고리별 인기 상품을 확인해보세요"
        className="mb-6"
      />

      {/* 카테고리 탭 */}
      <div className="mb-6">
        {/* 모바일/태블릿: 스크롤 가능한 탭 */}
        <div className="scrollbar-hide flex gap-1 overflow-x-auto md:hidden">
          {rankingsByCategory.map((category, index) => (
            <button
              key={category.category}
              className={`flex-shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors md:text-sm ${
                index === activeCategory
                  ? 'bg-primary-300 text-text-on'
                  : 'bg-bg-200 text-text-200 hover:bg-bg-300'
              }`}
              onClick={() => {
                setActiveCategory(index);
                setMobilePage(0);
              }}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* 데스크탑: 넓은 탭 */}
        <div className="hidden md:flex md:gap-2">
          {rankingsByCategory.map((category, index) => (
            <button
              key={category.category}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-bg-200 ${
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
        {/* 모바일/태블릿: 3개씩 슬라이드 & 화살표 */}
        <div className="relative md:hidden">
          <div className="flex flex-col gap-4">
            {pagedProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 rounded-xl bg-bg-100">
                {/* 랭킹 번호 */}
                <div className="flex h-8 w-4 flex-shrink-0 items-center justify-center text-lg font-bold text-text-100">
                  {mobilePage * MOBILE_PAGE_SIZE + index + 1}
                </div>
                {/* 상품 이미지 */}
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                </div>
                {/* 상품 정보 */}
                <div className="min-w-0 flex-1">
                  {/* 마감 문구 */}
                  <div className="mb-1 inline-block rounded-md bg-primary-100 px-3 py-1 text-xs font-medium text-primary-300">
                    공구 마감까지 {product.remainingDays}일 남았어요!
                  </div>
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
          {/* 좌우 화살표 */}
          {mobilePage > 0 && (
            <button
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-bg-100 p-2 shadow"
              onClick={() => setMobilePage(mobilePage - 1)}
              aria-label="이전 랭킹 보기"
            >
              <ChevronLeft className="h-5 w-5 text-primary-300" />
            </button>
          )}
          {mobilePage < totalMobilePages - 1 && (
            <button
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-bg-100 p-2 shadow"
              onClick={() => setMobilePage(mobilePage + 1)}
              aria-label="다음 랭킹 보기"
            >
              <ChevronRight className="h-5 w-5 text-primary-300" />
            </button>
          )}
        </div>

        {/* 데스크탑: 2열 3행(6개) 리스트 */}
        <div className="hidden md:grid md:grid-cols-3 md:grid-rows-2 md:gap-6">
          {desktopProducts.map((product, index) =>
            product ? (
              <div
                key={product.id}
                className="mb-4 flex flex-1 items-center gap-4 rounded-xl bg-bg-100"
              >
                {/* 랭킹 번호 */}
                <div className="flex h-10 w-5 flex-shrink-0 items-center justify-center text-lg font-bold text-text-100">
                  {index + 1}
                </div>
                {/* 상품 이미지 */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                </div>
                {/* 상품 정보 */}
                <div className="min-w-0 flex-1">
                  {/* 마감 문구 */}
                  <div className="mb-1 inline-block rounded-md bg-primary-100 px-3 py-1 text-xs font-medium text-primary-300">
                    공구 마감까지 {product.remainingDays}일 남았어요!
                  </div>
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
            ) : (
              <div
                key={index}
                className="mb-4 flex flex-1 items-center gap-4 rounded-xl bg-bg-100 opacity-0"
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
