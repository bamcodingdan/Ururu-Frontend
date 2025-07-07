import axiosInstance, { handleApiError } from '@/lib/axios';
import { SocialLoginResponse, ApiResponseFormat } from '@/types/api';

// 소셜 로그인 제공자 정보 타입
export interface SocialProviderInfo {
  id: string;
  displayName: string;
  authUrl: string;
  state: string;
}

export interface GetSocialProvidersResponse {
  providers: SocialProviderInfo[];
}

// 소셜 로그인 제공자 목록 조회
export const getSocialProviders = async (): Promise<GetSocialProvidersResponse> => {
  try {
    const response =
      await axiosInstance.get<ApiResponseFormat<GetSocialProvidersResponse>>(
        '/auth/social/providers',
      );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 소셜 로그인 제공자 처리
export const socialLogin = async (provider: string, code: string): Promise<SocialLoginResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponseFormat<SocialLoginResponse>>(
      '/auth/social/sessions',
      {
        provider,
        code,
      },
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 특정 제공자의 인증 URL 가져오기 (직접 OAuth URL 사용)
export const getAuthUrl = async (provider: 'kakao' | 'google'): Promise<string> => {
  const state = Math.random().toString(36).substring(2, 15);
  const isProd = process.env.NODE_ENV === 'production';

  // 환경별 redirect-uri
  const kakaoRedirectUri = isProd
    ? 'https://api.ururu.shop/api/auth/oauth/kakao'
    : 'http://localhost:8080/api/auth/oauth/kakao';
  const googleRedirectUri = isProd
    ? 'https://api.ururu.shop/api/auth/oauth/google'
    : 'http://localhost:8080/api/auth/oauth/google';

  switch (provider) {
    case 'kakao':
      return `https://kauth.kakao.com/oauth/authorize?client_id=488328d3fc3e70249e0d7d98e1afffb7&redirect_uri=${encodeURIComponent(kakaoRedirectUri)}&response_type=code&scope=profile_nickname,profile_image,account_email&state=${state}`;

    case 'google':
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=195286873238-tks2hdhr2he1gshoj3sd89d1o5dm35m7.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(googleRedirectUri)}&response_type=code&scope=openid email profile&state=${state}&access_type=offline&prompt=consent`;

    default:
      throw new Error(`${provider} 제공자를 찾을 수 없습니다.`);
  }
};
