export interface CartProduct {
  id: string;
  name: string;
  mainImage: string;
  price: number;
  originalPrice: number;
  discountRate: number;
}

export interface CartItem {
  id: string;
  product: CartProduct;
  selectedOption: {
    value: string;
    label: string;
  };
  quantity: number;
  isSelected: boolean;
}
