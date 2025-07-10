import axiosInstance, { handleApiError } from '@/lib/axios';
import { config, getSocialLoginRedirectUri } from '@/config/environment';
import type {
  LoginFormData,
  SellerSignupFormData,
  UserInfo,
  AuthSuccessResponse,
  DuplicateCheckResponse,
  SocialLoginResponse,
  SocialProvider,
} from '@/types/auth';

// 판매자 로그인
export const sellerLogin = async (credentials: LoginFormData): Promise<AuthSuccessResponse> => {
  try {
    const response = await axiosInstance.post<{ data: AuthSuccessResponse }>(
      '/auth/seller/login',
      credentials,
    );

    // HttpOnly 쿠키는 자동으로 설정되므로 별도 저장 불필요
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 판매자 회원가입
export const sellerSignup = async (signupData: SellerSignupFormData): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.post<{ data: UserInfo }>(
      '/auth/seller/signup',
      signupData,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 이메일 중복 체크
export const checkEmailAvailability = async (email: string): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<{ data: DuplicateCheckResponse }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 사업자등록번호 중복 체크
export const checkBusinessNumberAvailability = async (
  businessNumber: string,
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<{ data: DuplicateCheckResponse }>(
      `/auth/check-business-number?businessNumber=${encodeURIComponent(businessNumber)}`,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 브랜드명 중복 체크
export const checkBrandNameAvailability = async (name: string): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<{ data: DuplicateCheckResponse }>(
      `/auth/check-brand-name?name=${encodeURIComponent(name)}`,
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 소셜 로그인 URL 가져오기
export const getSocialLoginUrl = async (provider: SocialProvider): Promise<string> => {
  try {
    const response = await axiosInstance.get<{ data: SocialLoginResponse }>(
      `/auth/social/auth-url/${provider}`,
    );
    return response.data.data.authUrl;
  } catch (error) {
    // API 호출 실패 시 직접 URL 구성 (fallback)
    const redirectUri = getSocialLoginRedirectUri(provider);
    return `${config.api.baseUrl}/auth/oauth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  }
};

// 소셜 로그인 리다이렉트
export const redirectToSocialLogin = async (provider: SocialProvider): Promise<void> => {
  try {
    const authUrl = await getSocialLoginUrl(provider);
    window.location.href = authUrl;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 로그아웃
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
    // HttpOnly 쿠키는 서버에서 삭제되므로 클라이언트에서 별도 처리 불필요
  } catch (error) {
    // 로그아웃 실패해도 클라이언트 상태는 초기화
    console.error('로그아웃 API 호출 실패:', error);
  }
};

// 현재 사용자 정보 조회
export const getCurrentUser = async (): Promise<UserInfo> => {
  try {
    const response = await axiosInstance.get<{ data: UserInfo }>('/members/me');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 토큰 갱신
export const refreshToken = async (): Promise<AuthSuccessResponse> => {
  try {
    const response = await axiosInstance.post<{ data: AuthSuccessResponse }>('/auth/refresh');
    // HttpOnly 쿠키는 자동으로 설정되므로 별도 저장 불필요
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
