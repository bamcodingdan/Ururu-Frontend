// 에러 코드 정의
export enum ErrorCode {
  // 인증 관련
  INVALID_JWT_TOKEN = 'INVALID_JWT_TOKEN',
  EXPIRED_JWT_TOKEN = 'EXPIRED_JWT_TOKEN',
  MISSING_REFRESH_TOKEN = 'MISSING_REFRESH_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',

  // 로그인 관련
  INVALID_LOGIN_CREDENTIALS = 'INVALID_LOGIN_CREDENTIALS',
  INACTIVE_ACCOUNT = 'INACTIVE_ACCOUNT',

  // 소셜 로그인 관련
  SOCIAL_TOKEN_EXCHANGE_FAILED = 'SOCIAL_TOKEN_EXCHANGE_FAILED',
  SOCIAL_MEMBER_INFO_FAILED = 'SOCIAL_MEMBER_INFO_FAILED',
  UNSUPPORTED_SOCIAL_PROVIDER = 'UNSUPPORTED_SOCIAL_PROVIDER',

  // 기타
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

// 에러 메시지 매핑
const errorMessages: Record<string, string> = {
  [ErrorCode.INVALID_JWT_TOKEN]: '유효하지 않은 토큰입니다.',
  [ErrorCode.EXPIRED_JWT_TOKEN]: '토큰이 만료되었습니다.',
  [ErrorCode.MISSING_REFRESH_TOKEN]: '리프레시 토큰이 없습니다.',
  [ErrorCode.INVALID_REFRESH_TOKEN]: '유효하지 않은 리프레시 토큰입니다.',
  [ErrorCode.INVALID_LOGIN_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다.',
  [ErrorCode.INACTIVE_ACCOUNT]: '비활성화된 계정입니다.',
  [ErrorCode.SOCIAL_TOKEN_EXCHANGE_FAILED]: '소셜 로그인 토큰 교환에 실패했습니다.',
  [ErrorCode.SOCIAL_MEMBER_INFO_FAILED]: '소셜 로그인 사용자 정보 조회에 실패했습니다.',
  [ErrorCode.UNSUPPORTED_SOCIAL_PROVIDER]: '지원하지 않는 소셜 로그인입니다.',
  [ErrorCode.TOO_MANY_REQUESTS]: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.ACCESS_DENIED]: '접근 권한이 없습니다.',
};

// 에러 메시지 가져오기
export const getErrorMessage = (errorCode: string): string => {
  return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.';
};

// API 에러 처리
export const handleApiError = (error: any): { message: string; code?: string } => {
  if (error.response?.data?.code) {
    return {
      message: getErrorMessage(error.response.data.code),
      code: error.response.data.code,
    };
  }

  if (error.response?.data?.message) {
    return {
      message: error.response.data.message,
    };
  }

  if (error.message) {
    return {
      message: error.message,
    };
  }

  return {
    message: '알 수 없는 오류가 발생했습니다.',
  };
};

// 네트워크 에러 확인
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

// 인증 에러 확인
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};

// 권한 에러 확인
export const isPermissionError = (error: any): boolean => {
  return error.response?.status === 403;
};

// 서버 에러 확인
export const isServerError = (error: any): boolean => {
  return error.response?.status >= 500;
};
