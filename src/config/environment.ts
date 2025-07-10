// 환경별 설정 타입 정의
interface EnvironmentConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    socialLogin: {
      kakao: {
        clientId: string;
        redirectUri: {
          dev: string;
          prod: string;
        };
      };
      google: {
        clientId: string;
        redirectUri: {
          dev: string;
          prod: string;
        };
      };
    };
  };
  app: {
    name: string;
    version: string;
    url: {
      dev: string;
      prod: string;
    };
  };
}

// 환경별 설정
const getEnvironmentConfig = (): EnvironmentConfig => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
      timeout: 10000,
    },
    auth: {
      socialLogin: {
        kakao: {
          clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '',
          redirectUri: {
            dev:
              process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI_DEV ||
              'http://localhost:8080/auth/oauth/kakao',
            prod:
              process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI_PROD ||
              'https://www.ururu.shop/auth/oauth/kakao',
          },
        },
        google: {
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          redirectUri: {
            dev:
              process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI_DEV ||
              'http://localhost:8080/auth/oauth/google',
            prod:
              process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI_PROD ||
              'https://www.ururu.shop/auth/oauth/google',
          },
        },
      },
    },
    app: {
      name: process.env.NEXT_PUBLIC_APP_NAME || '우르르',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      url: {
        dev: 'http://localhost:3000',
        prod: 'https://www.ururu.shop',
      },
    },
  };
};

export const config = getEnvironmentConfig();

// 환경 유틸리티 함수들
export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () => process.env.NODE_ENV === 'development';

// API URL 헬퍼
export const getApiUrl = (endpoint: string) => `${config.api.baseUrl}${endpoint}`;

// 소셜 로그인 리다이렉트 URI 헬퍼
export const getSocialLoginRedirectUri = (provider: 'kakao' | 'google') => {
  const isProd = isProduction();
  const providerConfig = config.auth.socialLogin[provider];

  return isProd ? providerConfig.redirectUri.prod : providerConfig.redirectUri.dev;
};
