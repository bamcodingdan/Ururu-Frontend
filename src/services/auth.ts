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
    const response = await axiosInstance.post<{ data: UserInfo }>('/sellers/signup', signupData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 이메일 중복 체크
export const checkEmailAvailability = async (email: string): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<{ data: DuplicateCheckResponse }>(
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
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<{ data: DuplicateCheckResponse }>(
      `/sellers/check/business-number?businessNumber=${encodeURIComponent(businessNumber)}`,
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
      `/sellers/check/name?name=${encodeURIComponent(name)}`,
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

// ✅ RTR 방식 로그아웃 (Redis 토큰 삭제 포함)
export const logout = async (): Promise<void> => {
  try {
    // Authorization 헤더가 있으면 Redis 토큰도 삭제
    const accessToken = getAccessTokenFromCookie();
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    await axiosInstance.post('/auth/logout', {}, { headers });

    // ✅ 개선사항: Redis의 모든 리프레시 토큰이 삭제됨
    console.log('RTR 방식 로그아웃 완료: Redis 토큰 삭제됨');
  } catch (error) {
    // 로그아웃 실패해도 클라이언트 상태는 초기화
    console.error('로그아웃 API 호출 실패:', error);
  }
};

// ✅ 판매자 전용 로그아웃 (RTR 방식)
export const sellerLogout = async (): Promise<void> => {
  try {
    const accessToken = getAccessTokenFromCookie();
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    await axiosInstance.post('/auth/seller/logout', {}, { headers });

    console.log('판매자 RTR 방식 로그아웃 완료: Redis 토큰 삭제됨');
  } catch (error) {
    console.error('판매자 로그아웃 API 호출 실패:', error);
  }
};

// 쿠키에서 액세스 토큰 추출 (로그아웃용)
const getAccessTokenFromCookie = (): string => {
  if (typeof document === 'undefined') return '';

  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find((cookie) => cookie.trim().startsWith('access_token='));
  return accessTokenCookie ? accessTokenCookie.split('=')[1] : '';
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

// ✅ RTR 방식 토큰 갱신 (개선된 보안)
export const refreshToken = async (): Promise<AuthSuccessResponse> => {
  try {
    const response = await axiosInstance.post<{ data: AuthSuccessResponse }>('/auth/refresh');

    // ✅ RTR 방식: 기존 토큰이 즉시 무효화되고 새 토큰이 발급됨
    console.log('RTR 방식 토큰 갱신 완료');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
