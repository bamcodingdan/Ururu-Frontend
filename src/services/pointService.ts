import api from '@/lib/axios';
import { PointTransactionParams, PointTransactionsResponse } from '@/types/point';

// 포인트 거래 내역 조회
export async function getPointTransactions(params: PointTransactionParams = {}) {
  const { type = 'all', source = 'all', page = 1, size = 10 } = params;

  const response = await api.get<{
    success: boolean;
    message: string;
    data: PointTransactionsResponse;
  }>('/member/me/point-transactions', {
    params: {
      ...(type !== 'all' && { type }),
      ...(source !== 'all' && { source }),
      page,
      size,
    },
  });

  return response.data.data;
}
