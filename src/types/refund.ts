export interface RefundItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  option: string;
  quantity: number;
  price: number;
  refundAmount: number;
}

// 백엔드 ERD에 맞춘 타입 정의
export type RefundType = 'CHANGE_OF_MIND' | 'DEFECTIVE_PRODUCT' | 'DELIVERY_ISSUE' | 'OTHER';
export type RefundStatus = 'INITIATED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'FAILED';
export type RefundScope = 'FULL_ORDER' | 'INDIVIDUAL_GROUP_BUY'; // 전체 주문 환불 vs 개별 공구 환불

export interface Refund {
  id: string;
  paymentId: string; // FK → Payment.id
  refundNumber: string;
  type: RefundType;
  reason: string;
  amount: number; // 환불 금액
  status: RefundStatus;
  rejectReason?: string; // 거부 사유
  refundedAt?: Date; // 환불 완료일
  createdAt: Date;
  updatedAt: Date;

  // 프론트엔드 추가 필드
  scope: RefundScope; // 전체 주문 환불 vs 개별 공구 환불
  items: RefundItem[]; // 환불 상품 목록
  estimatedCompletionDate?: Date; // 예상 완료일
}

export interface RefundStatusSummary {
  initiated: number;
  approved: number;
  rejected: number;
  completed: number;
  failed: number;
}

export type RefundStatusFilter =
  | 'all'
  | 'INITIATED'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'FAILED';
export type RefundTypeFilter =
  | 'all'
  | 'CHANGE_OF_MIND'
  | 'DEFECTIVE_PRODUCT'
  | 'DELIVERY_ISSUE'
  | 'OTHER';

// 환불 타입을 한국어로 변환하는 함수
export const getRefundTypeLabel = (type: RefundType): string => {
  switch (type) {
    case 'CHANGE_OF_MIND':
      return '단순 변심';
    case 'DEFECTIVE_PRODUCT':
      return '상품 결함';
    case 'DELIVERY_ISSUE':
      return '배송 문제';
    case 'OTHER':
      return '기타';
    default:
      return '기타';
  }
};

// 환불 상태를 한국어로 변환하는 함수
export const getRefundStatusLabel = (status: RefundStatus): string => {
  switch (status) {
    case 'INITIATED':
      return '신청됨';
    case 'APPROVED':
      return '승인됨';
    case 'REJECTED':
      return '거부됨';
    case 'COMPLETED':
      return '완료됨';
    case 'FAILED':
      return '실패';
    default:
      return '알 수 없음';
  }
};
