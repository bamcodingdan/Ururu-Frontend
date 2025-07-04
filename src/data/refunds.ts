import { Refund, RefundStatusSummary } from '@/types/refund';

export const refundStatusSummary: RefundStatusSummary = {
  initiated: 2,
  approved: 1,
  rejected: 1,
  completed: 3,
  failed: 1,
};

export const mockRefunds: Refund[] = [
  // 전체 주문 환불 - 단순 변심
  {
    id: '1',
    paymentId: 'payment-001',
    refundNumber: 'RF20241201001',
    type: 'CHANGE_OF_MIND',
    reason: '상품이 마음에 들지 않아서 환불 신청합니다.',
    amount: 89000,
    status: 'INITIATED',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    scope: 'FULL_ORDER',
    items: [
      {
        id: '1-1',
        productId: 'prod-1',
        productName: '[유리알속광/화잘먹앰플] 차앤박 프로폴리스 에너지 액티브 앰플 30ml 2개입',
        productImage:
          'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021315370ko.jpg?l=ko',
        option: '에스네이처 아쿠아 스쿠알란 수분크림 60ml 더블기획(60ml+60ml)',
        quantity: 1,
        price: 89000,
        refundAmount: 89000,
      },
    ],
    estimatedCompletionDate: new Date('2024-12-08'),
  },

  // 전체 주문 환불 - 상품 결함
  {
    id: '2',
    paymentId: 'payment-002',
    refundNumber: 'RF20241128002',
    type: 'DEFECTIVE_PRODUCT',
    reason: '상품에 하자가 있어서 환불 신청합니다.',
    amount: 45000,
    status: 'COMPLETED',
    refundedAt: new Date('2024-12-02'),
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-02'),
    scope: 'FULL_ORDER',
    items: [
      {
        id: '2-1',
        productId: 'prod-2',
        productName: '닥터벨머 시카 리페어 크림',
        productImage:
          'https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0021/A00000021315371ko.jpg?l=ko',
        option: '닥터벨머 시카 리페어 크림 50ml',
        quantity: 2,
        price: 45000,
        refundAmount: 45000,
      },
    ],
  },

  // 개별 공구 환불 - 배송 문제
  {
    id: '3',
    paymentId: 'payment-003',
    refundNumber: 'RF20241125003',
    type: 'DELIVERY_ISSUE',
    reason: '배송이 너무 늦어서 환불 신청합니다.',
    amount: 120000,
    status: 'APPROVED',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-26'),
    scope: 'INDIVIDUAL_GROUP_BUY',
    items: [
      {
        id: '3-1',
        productId: 'prod-3',
        productName: '라네즈 워터뱅크 하이드로 크림',
        productImage:
          'https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0021/A00000021315372ko.jpg?l=ko',
        option: '라네즈 워터뱅크 하이드로 크림 100ml',
        quantity: 1,
        price: 120000,
        refundAmount: 120000,
      },
    ],
    estimatedCompletionDate: new Date('2024-12-10'),
  },

  // 전체 주문 환불 - 상품 결함 (거부됨)
  {
    id: '4',
    paymentId: 'payment-004',
    refundNumber: 'RF20241120004',
    type: 'DEFECTIVE_PRODUCT',
    reason: '상품이 파손되어 와서 환불 신청합니다.',
    amount: 67000,
    status: 'REJECTED',
    rejectReason: '상품 수령 후 7일이 경과하여 환불이 불가능합니다.',
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-22'),
    scope: 'FULL_ORDER',
    items: [
      {
        id: '4-1',
        productId: 'prod-4',
        productName: '이니스프리 그린티 씨드 세럼',
        productImage:
          'https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0021/A00000021315371ko.jpg?l=ko',
        option: '이니스프리 그린티 씨드 세럼 80ml',
        quantity: 1,
        price: 67000,
        refundAmount: 0,
      },
    ],
  },

  // 개별 공구 환불 - 기타 (실패)
  {
    id: '5',
    paymentId: 'payment-005',
    refundNumber: 'RF20241115005',
    type: 'OTHER',
    reason: '다른 상품으로 교환하고 싶어서 환불 신청합니다.',
    amount: 89000,
    status: 'FAILED',
    rejectReason: '환불 처리 중 오류가 발생했습니다.',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-18'),
    scope: 'INDIVIDUAL_GROUP_BUY',
    items: [
      {
        id: '5-1',
        productId: 'prod-5',
        productName: '미샤 타임 레볼루션 앰플',
        productImage:
          'https://image.oliveyoung.co.kr/uploads/images/goods/550/10/0000/0021/A00000021315372ko.jpg?l=ko',
        option: '미샤 타임 레볼루션 앰플 50ml',
        quantity: 1,
        price: 89000,
        refundAmount: 0,
      },
    ],
  },

  // 전체 주문 환불 - 배송 문제
  {
    id: '6',
    paymentId: 'payment-006',
    refundNumber: 'RF20241110006',
    type: 'DELIVERY_ISSUE',
    reason: '배송 중 상품이 파손되어 와서 환불 신청합니다.',
    amount: 34000,
    status: 'COMPLETED',
    refundedAt: new Date('2024-11-17'),
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-17'),
    scope: 'FULL_ORDER',
    items: [
      {
        id: '6-1',
        productId: 'prod-6',
        productName: '토니모리 원더 세라마이드 모이스처 크림',
        productImage:
          'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021315370ko.jpg?l=ko',
        option: '토니모리 원더 세라마이드 모이스처 크림 80ml',
        quantity: 1,
        price: 34000,
        refundAmount: 34000,
      },
    ],
  },

  // 개별 공구 환불 - 단순 변심
  {
    id: '7',
    paymentId: 'payment-007',
    refundNumber: 'RF20241105007',
    type: 'CHANGE_OF_MIND',
    reason: '상품이 설명과 다르게 와서 환불 신청합니다.',
    amount: 156000,
    status: 'COMPLETED',
    refundedAt: new Date('2024-11-12'),
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-12'),
    scope: 'INDIVIDUAL_GROUP_BUY',
    items: [
      {
        id: '7-1',
        productId: 'prod-7',
        productName: '클리오 킬커버 파운데이션',
        productImage:
          'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021315371ko.jpg?l=ko',
        option: '클리오 킬커버 파운데이션 30ml (21호)',
        quantity: 1,
        price: 156000,
        refundAmount: 156000,
      },
    ],
  },

  // 전체 주문 환불 - 기타
  {
    id: '8',
    paymentId: 'payment-008',
    refundNumber: 'RF20241030008',
    type: 'OTHER',
    reason: '개인적인 사정으로 인해 환불 신청합니다.',
    amount: 78000,
    status: 'COMPLETED',
    refundedAt: new Date('2024-11-06'),
    createdAt: new Date('2024-10-30'),
    updatedAt: new Date('2024-11-06'),
    scope: 'FULL_ORDER',
    items: [
      {
        id: '8-1',
        productId: 'prod-8',
        productName: '아누아 365 토너',
        productImage:
          'https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021315370ko.jpg?l=ko',
        option: '아누아 365 토너 500ml',
        quantity: 2,
        price: 78000,
        refundAmount: 78000,
      },
    ],
  },
];
