import axiosInstance, { handleApiError } from '@/lib/axios';
import { SocialLoginResponse, ApiResponseFormat } from '@/types/api';

// 환경변수 상수 선언 (빌드 타임에 값이 주입됨)
export const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
export const KAKAO_REDIRECT_URI_DEV = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI_DEV;
export const KAKAO_REDIRECT_URI_PROD = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI_PROD;
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const GOOGLE_REDIRECT_URI_DEV = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI_DEV;
export const GOOGLE_REDIRECT_URI_PROD = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI_PROD;

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
  // 환경변수 값 확인용 로그 (상수 사용)
  // console.log('KAKAO_CLIENT_ID:', KAKAO_CLIENT_ID);
  // console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
  // console.log('KAKAO_REDIRECT_URI_DEV:', KAKAO_REDIRECT_URI_DEV);
  // console.log('GOOGLE_REDIRECT_URI_DEV:', GOOGLE_REDIRECT_URI_DEV);

  if (!KAKAO_CLIENT_ID || !GOOGLE_CLIENT_ID) {
    throw new Error('OAuth 클라이언트 ID가 설정되지 않았습니다.');
  }
  const state = Math.random().toString(36).substring(2, 15);
  const isProd = process.env.NODE_ENV === 'production';

  // 환경별 redirect-uri (상수 사용)
  const kakaoRedirectUri = isProd ? KAKAO_REDIRECT_URI_PROD : KAKAO_REDIRECT_URI_DEV;
  const googleRedirectUri = isProd ? GOOGLE_REDIRECT_URI_PROD : GOOGLE_REDIRECT_URI_DEV;

  switch (provider) {
    case 'kakao':
      return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(kakaoRedirectUri!)}&response_type=code&scope=profile_nickname,profile_image,account_email&state=${state}`;
    case 'google':
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(googleRedirectUri!)}&response_type=code&scope=openid email profile&state=${state}&access_type=offline&prompt=consent`;
    default:
      throw new Error(`${provider} 제공자를 찾을 수 없습니다.`);
  }
};
