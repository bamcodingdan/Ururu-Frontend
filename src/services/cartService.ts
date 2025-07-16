import api from '@/lib/axios';
import { ApiCartResponse, ApiResponseFormat } from '@/types/api';

/**
 * 장바구니 조회
 * @returns 장바구니 아이템 목록
 */
export async function getCart(): Promise<ApiResponseFormat<ApiCartResponse>> {
  try {
    const response = await api.get<ApiResponseFormat<ApiCartResponse>>('/cart');
    return response.data;
  } catch (error) {
    console.error('장바구니 조회 실패:', error);
    throw error;
  }
}
