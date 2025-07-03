'use client';

import React from 'react';
import { NoFooterLayout } from '@/components/layout/layouts';
import { CartItem as CartItemComponent, CartSelectAll, CartSummary } from '@/components/cart';
import { useCart } from '@/hooks/useCart';
import { mockCartData, calculateCartSummary, type CartItem } from '@/data/cart';

// 빈 장바구니 컴포넌트
function EmptyCart() {
  return (
    <NoFooterLayout>
      <div className="container mx-auto max-w-4xl px-6 py-8 md:px-8 md:py-12">
        <h1 className="mb-8 text-center text-2xl font-semibold text-text-100 md:text-3xl">
          장바구니
        </h1>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-lg text-text-200 md:text-xl">장바구니가 비어있습니다.</p>
        </div>
      </div>
    </NoFooterLayout>
  );
}

// 장바구니 목록 컴포넌트
function CartList({
  cartItems,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}: {
  cartItems: CartItem[];
  onToggleSelect: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}) {
  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <CartItemComponent
          key={item.id}
          item={item}
          onToggleSelect={onToggleSelect}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default function CartPage() {
  const {
    cartItems,
    toggleSelectAll,
    toggleSelectItem,
    updateQuantity,
    removeItem,
    isAllSelected,
    isPartiallySelected,
  } = useCart(mockCartData);

  const summary = calculateCartSummary(cartItems);

  const handlePurchase = () => {
    // TODO: 결제 페이지로 이동
    console.log('구매하기 클릭');
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <NoFooterLayout>
      <div className="container mx-auto max-w-4xl px-6 py-8 md:px-8 md:py-12">
        {/* 페이지 타이틀 */}
        <h1 className="mb-8 text-center text-2xl font-semibold text-text-100 md:text-3xl">
          장바구니
        </h1>

        <div className="space-y-6">
          {/* 전체 선택 */}
          <CartSelectAll
            isAllSelected={isAllSelected}
            isPartiallySelected={isPartiallySelected}
            onToggleSelectAll={toggleSelectAll}
            selectedCount={summary.selectedCount}
            totalCount={cartItems.length}
          />

          {/* 상품 리스트 */}
          <CartList
            cartItems={cartItems}
            onToggleSelect={toggleSelectItem}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />

          {/* 결제 요약 */}
          <CartSummary
            totalProductPrice={summary.totalProductPrice}
            shippingFee={summary.shippingFee}
            totalPrice={summary.totalPrice}
            selectedCount={summary.selectedCount}
            onPurchase={handlePurchase}
          />
        </div>
      </div>
    </NoFooterLayout>
  );
}
