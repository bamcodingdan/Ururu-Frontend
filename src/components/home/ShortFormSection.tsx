'use client';

import React from 'react';
import Image from 'next/image';
import { SectionHeader } from '@/components/common/SectionHeader';

// 하드코딩된 숏폼 이미지+제목 데이터
const SHORTFORM_ITEMS = [
  {
    image: 'https://i.pinimg.com/736x/4e/e5/f1/4ee5f143f94ac5b3618790d75ed2dd2d.jpg',
    title: '향수 없이 향기로워지는 방법',
  },
  {
    image: 'https://i.pinimg.com/736x/0a/8d/a9/0a8da90c69d8cfa3c79513af900f184b.jpg',
    title: '언제 어디서든 가장 향기롭게',
  },
  {
    image: 'https://i.pinimg.com/736x/26/81/ee/2681ee33862eaac4d3986898a26de409.jpg',
    title: '볼드 아이라인 쉽게 그리는 방법',
  },
  {
    image: 'https://i.pinimg.com/736x/e9/e7/9c/e9e79ca4e809255eb48e2fa43bc69637.jpg',
    title: '오버립 꿀조합 알려드려요',
  },
];

interface ShortFormSectionProps {
  className?: string;
}

export function ShortFormSection({ className = '' }: ShortFormSectionProps) {
  return (
    <section className={`w-full ${className}`}>
      {/* 섹션 헤더 */}
      <SectionHeader title="숏폼에서 보던 그 제품" />

      {/* 이미지 4개 가로 배치 */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {SHORTFORM_ITEMS.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-bg-200">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={idx === 0}
              />
            </div>
            <div className="mt-4 text-center text-base font-medium text-text-100 md:text-lg">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
