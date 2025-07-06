'use client';

import React from 'react';
import Image from 'next/image';
import { ProductCard } from '@/components/product';
import type { Product } from '@/types/product';
import { SectionHeader } from '@/components/common/SectionHeader';

interface RealtimeBestSectionProps {
  products: Product[];
  className?: string;
}

export function RealtimeBestSection({ products, className = '' }: RealtimeBestSectionProps) {
  if (!products.length) return null;

  return (
    <section className={`w-full ${className} flex h-full flex-col`}>
      {/* 섹션 헤더 */}
      <SectionHeader
        title="실시간 베스트"
        description="지금 가장 인기 있는 상품들을 확인해보세요"
        className="mb-6"
      />

      {/* 모바일/태블릿: 세로 리스트 */}
      <div className="block space-y-4 md:hidden">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-3 rounded-xl bg-bg-100">
            {/* 랭킹 번호 */}
            <div className="flex h-8 w-4 flex-shrink-0 items-center justify-center text-lg font-bold text-text-100">
              {index + 1}
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
                <span className="text-lg font-bold text-primary-300">{product.discountRate}%</span>
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

      {/* 데스크탑: 우측 사이드 세로 리스트 - 캐러셀 높이에 맞춤 */}
      <div className="hidden h-full flex-col md:flex">
        <div className="flex h-full flex-col gap-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex flex-1 items-center gap-4 rounded-xl bg-bg-100">
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
          ))}
        </div>
      </div>
    </section>
  );
}
