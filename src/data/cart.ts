import type { Product } from '@/types/product';
import { mockProductData } from './mock-product';

export interface CartItem {
  id: string;
  product: Product;
  selectedOption: {
    value: string;
    label: string;
  };
  quantity: number;
  isSelected: boolean;
}

export const mockCartData: CartItem[] = [
  {
    id: '1',
    product: mockProductData,
    selectedOption: {
      value: 'option1',
      label: '[태닝 시나모롤]03 베어 그레이프 기획',
    },
    quantity: 1,
    isSelected: true,
  },
  {
    id: '2',
    product: {
      ...mockProductData,
      id: '2',
      name: '[7월올영픽/산리오캐릭터즈] 롬앤 더 쥬시 래스팅 틴트 (+쉐이킹키링증정) 단품/기획 - 2번째 상품',
    },
    selectedOption: {
      value: 'option2',
      label: '[태닝 포차코] 23 피치 피치 미 기획',
    },
    quantity: 2,
    isSelected: true,
  },
  {
    id: '3',
    product: {
      ...mockProductData,
      id: '3',
      name: '[7월올영픽/산리오캐릭터즈] 롬앤 더 쥬시 래스팅 틴트 (+쉐이킹키링증정) 단품/기획 - 3번째 상품',
    },
    selectedOption: {
      value: 'option3',
      label: '[NEW태닝 시나모롤]32태니구아바 기획',
    },
    quantity: 1,
    isSelected: false,
  },
];

export const calculateCartSummary = (cartItems: CartItem[]) => {
  const selectedItems = cartItems.filter((item) => item.isSelected);
  const totalProductPrice = selectedItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const shippingFee = totalProductPrice >= 50000 ? 0 : 3000;
  const totalPrice = totalProductPrice + shippingFee;

  return {
    totalProductPrice,
    shippingFee,
    totalPrice,
    selectedCount: selectedItems.length,
  };
};
