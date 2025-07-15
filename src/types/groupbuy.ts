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
