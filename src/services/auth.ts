import axiosInstance, { handleApiError } from '@/lib/axios';
import {
  ApiResponseFormat,
  UserInfo,
  SellerSignupRequest,
  SellerSignupResponse,
  AvailabilityResponse,
} from '@/types/api';

// 판매자 로그인 요청 타입
export interface SellerLoginRequest {
  email: string;
  password: string;
}

// 판매자 로그인 응답 타입
export interface SellerLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  member_info: UserInfo;
}

// 소셜 로그인 URL로 리다이렉트 (백엔드에서 직접 처리)
export const redirectToSocialLogin = async (provider: 'kakao' | 'google'): Promise<void> => {
  try {
    // 백엔드에서 소셜 로그인 URL을 가져옴
    const response = await axiosInstance.get<ApiResponseFormat<{ authUrl: string }>>(
      `/auth/social/auth-url/${provider}`,
    );

    // 백엔드에서 제공하는 authUrl로 리다이렉트
    window.location.href = response.data.data.authUrl;
  } catch (error) {
    // API 호출 실패 시 직접 URL 구성 (fallback)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/auth/oauth/${provider}`;
  }
};

// 판매자 로그인
export const sellerLogin = async (
  credentials: SellerLoginRequest,
): Promise<SellerLoginResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponseFormat<SellerLoginResponse>>(
      '/auth/seller/login',
      credentials,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 판매자 회원가입
export const sellerSignup = async (
  signupData: SellerSignupRequest,
): Promise<SellerSignupResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponseFormat<SellerSignupResponse>>(
      '/sellers/signup',
      signupData,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 이메일 중복 체크
export const checkEmailAvailability = async (email: string): Promise<AvailabilityResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponseFormat<AvailabilityResponse>>(
      `/sellers/check/email?email=${encodeURIComponent(email)}`,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 사업자등록번호 중복 체크
export const checkBusinessNumberAvailability = async (
  businessNumber: string,
): Promise<AvailabilityResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponseFormat<AvailabilityResponse>>(
      `/sellers/check/business-number?businessNumber=${encodeURIComponent(businessNumber)}`,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 브랜드명 중복 체크
export const checkBrandNameAvailability = async (name: string): Promise<AvailabilityResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponseFormat<AvailabilityResponse>>(
      `/sellers/check/name?name=${encodeURIComponent(name)}`,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 공통 로그아웃
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    throw handleApiError(error);
  }
};

// 사용자 정보 조회
export const getCurrentUser = async (): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get<ApiResponseFormat<UserInfo>>('/members/me');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
