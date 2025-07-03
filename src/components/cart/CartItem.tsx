'use client';

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CartItem as CartItemType } from '@/data/cart';

interface CartItemProps {
  item: CartItemType;
  onToggleSelect: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onToggleSelect, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card className="w-full rounded-2xl border-0 bg-bg-100 shadow-none">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          {/* 체크박스 */}
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={item.isSelected}
              onChange={() => onToggleSelect(item.id)}
              aria-label={`${item.product.name} 선택`}
            />
          </div>

          {/* 상품 이미지 */}
          <div className="flex-shrink-0">
            <Image
              src={item.product.mainImage}
              alt={item.product.name}
              width={80}
              height={80}
              className="h-20 w-20 rounded-lg object-cover md:h-24 md:w-24"
            />
          </div>

          {/* 상품 정보 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                {/* 상품명 */}
                <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-text-100 md:text-base">
                  {item.product.name}
                </h3>

                {/* 옵션 정보 */}
                <p className="mb-2 text-sm text-text-200 md:text-base">
                  옵션: {item.selectedOption.label}
                </p>

                {/* 수량 */}
                <p className="mb-3 text-sm text-text-200 md:text-base">수량: {item.quantity}개</p>

                {/* 가격 */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-text-100 md:text-xl">
                    {item.product.price.toLocaleString()}원
                  </span>
                  {item.product.originalPrice !== item.product.price && (
                    <span className="text-sm text-text-300 line-through md:text-base">
                      {item.product.originalPrice.toLocaleString()}원
                    </span>
                  )}
                </div>
              </div>

              {/* 삭제 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 flex-shrink-0 p-0 text-text-300 hover:bg-bg-200 hover:text-text-100"
                onClick={() => onRemove(item.id)}
                aria-label="상품 삭제"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* 수량 조절 */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md border-bg-300 p-0 hover:bg-bg-200 active:bg-bg-200 md:h-10 md:w-10"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <div className="flex h-8 w-16 items-center justify-center border-b border-t border-bg-300 bg-bg-100 text-sm font-medium text-text-100 md:h-10 md:w-20 md:text-base">
                  {item.quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md border-bg-300 p-0 hover:bg-bg-200 active:bg-bg-200 md:h-10 md:w-10"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>

              {/* 총 가격 */}
              <span className="text-lg font-bold text-text-100 md:text-xl">
                {(item.product.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
