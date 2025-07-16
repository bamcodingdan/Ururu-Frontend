import api from '@/lib/axios';
import {
  ApiCartResponse,
  ApiResponseFormat,
  ApiUpdateCartQuantityRequest,
  ApiUpdateCartQuantityResponse,
  ApiDeleteCartItemResponse,
} from '@/types/api';

/**
 * 장바구니 조회
 * @returns 장바구니 아이템 목록
 */
export async function getCart(): Promise<ApiResponseFormat<ApiCartResponse>> {
  try {
    const response = await api.get<ApiResponseFormat<ApiCartResponse>>('/cart');
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 장바구니 수량 변경
 * @param cartItemId - 변경할 장바구니 아이템 ID
 * @param quantityChange - 변경할 수량 (양수: 증가, 음수: 감소)
 * @returns 변경된 장바구니 아이템 정보
 */
export async function updateCartQuantity(
  cartItemId: number,
  quantityChange: number,
): Promise<ApiResponseFormat<ApiUpdateCartQuantityResponse>> {
  try {
    const response = await api.put<ApiResponseFormat<ApiUpdateCartQuantityResponse>>(
      `/cart/items/${cartItemId}`,
      { quantityChange },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 장바구니 아이템 삭제
 * @param cartItemId - 삭제할 장바구니 아이템 ID
 * @returns 삭제 성공 응답
 */
export async function deleteCartItem(
  cartItemId: number,
): Promise<ApiResponseFormat<ApiDeleteCartItemResponse>> {
  try {
    const response = await api.delete<ApiResponseFormat<ApiDeleteCartItemResponse>>(
      `/cart/items/${cartItemId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
