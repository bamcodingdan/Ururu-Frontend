import { useState, useCallback, useEffect } from 'react';
import type { CartItem } from '@/types/cart';
import { getCart } from '@/services/cartService';
import { convertApiCartItemsToCartItems } from '@/lib/cart-utils';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 장바구니 데이터 로드
  const loadCartItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getCart();
      if (response.success) {
        const convertedItems = convertApiCartItemsToCartItems(response.data.cartItems);
        setCartItems(convertedItems);
      } else {
        setError('장바구니를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('장바구니를 불러오는데 실패했습니다.');
      console.error('장바구니 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 장바구니 로드
  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  // 전체 선택/해제
  const toggleSelectAll = useCallback(() => {
    const allSelected = cartItems.every((item) => item.isSelected);
    setCartItems((prev) => prev.map((item) => ({ ...item, isSelected: !allSelected })));
  }, [cartItems]);

  // 개별 상품 선택/해제
  const toggleSelectItem = useCallback((itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isSelected: !item.isSelected } : item)),
    );
  }, []);

  // 수량 변경
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)),
    );
  }, []);

  // 상품 삭제
  const removeItem = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  // 전체 선택 여부
  const isAllSelected = cartItems.length > 0 && cartItems.every((item) => item.isSelected);

  // 부분 선택 여부
  const isPartiallySelected = cartItems.some((item) => item.isSelected) && !isAllSelected;

  return {
    cartItems,
    isLoading,
    error,
    loadCartItems,
    toggleSelectAll,
    toggleSelectItem,
    updateQuantity,
    removeItem,
    isAllSelected,
    isPartiallySelected,
  };
};
