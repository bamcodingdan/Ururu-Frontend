export interface GroupBuyTop3 {
  id: number;
  title: string;
  thumbnailUrl: string;
  displayFinalPrice: number;
  startPrice: number;
  maxDiscountRate: number;
  endsAt: string;
  orderCount: number;
  createdAt: string;
}

export interface GroupBuyTop3Response {
  success: boolean;
  message: string;
  data: GroupBuyTop3[];
}

// 카테고리별 랭킹 API 응답도 GroupBuyTop3Response와 동일하게 사용 가능

// 공구 등록 API 관련 타입
export interface GroupBuyProductOption {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  fullIngredients: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupBuyProduct {
  productId: number;
  productName: string;
  options: GroupBuyProductOption[];
}

export interface GroupBuyCreateResponse {
  success: boolean;
  message: string;
  data: {
    products: GroupBuyProduct[];
  };
}
