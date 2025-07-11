// 에러 코드 정의
export enum ErrorCode {
  // 인증 관련
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // 로그인 관련
  INVALID_LOGIN_CREDENTIALS = 'INVALID_LOGIN_CREDENTIALS',
  INACTIVE_ACCOUNT = 'INACTIVE_ACCOUNT',

  // 소셜 로그인 관련
  SOCIAL_LOGIN_FAILED = 'SOCIAL_LOGIN_FAILED',
  SOCIAL_MEMBER_INFO_FAILED = 'SOCIAL_MEMBER_INFO_FAILED',
  UNSUPPORTED_SOCIAL_PROVIDER = 'UNSUPPORTED_SOCIAL_PROVIDER',

  // 기타
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  ACCESS_DENIED = 'ACCESS_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

// 에러 메시지 매핑
const errorMessages: Record<string, string> = {
  [ErrorCode.UNAUTHORIZED]: '인증이 필요합니다.',
  [ErrorCode.FORBIDDEN]: '접근 권한이 없습니다.',
  [ErrorCode.INVALID_LOGIN_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다.',
  [ErrorCode.INACTIVE_ACCOUNT]: '비활성화된 계정입니다.',
  [ErrorCode.SOCIAL_LOGIN_FAILED]: '소셜 로그인에 실패했습니다.',
  [ErrorCode.SOCIAL_MEMBER_INFO_FAILED]: '소셜 로그인 사용자 정보 조회에 실패했습니다.',
  [ErrorCode.UNSUPPORTED_SOCIAL_PROVIDER]: '지원하지 않는 소셜 로그인입니다.',
  [ErrorCode.TOO_MANY_REQUESTS]: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.ACCESS_DENIED]: '접근 권한이 없습니다.',
  [ErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
};

// 에러 메시지 가져오기
export const getErrorMessage = (errorCode: string): string => {
  return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.';
};

// API 에러 처리
export const handleApiError = (error: any): { message: string; code?: string } => {
  if (error.response) {
    // 서버에서 응답이 왔지만 에러인 경우
    const status = error.response.status;
    const code = error.response.data?.code;
    const message = error.response.data?.message;

    switch (status) {
      case 401:
        return { message: message || '인증이 필요합니다.', code: code || ErrorCode.UNAUTHORIZED };
      case 403:
        return { message: message || '접근 권한이 없습니다.', code: code || ErrorCode.FORBIDDEN };
      case 429:
        return {
          message: message || '요청이 너무 많습니다.',
          code: code || ErrorCode.TOO_MANY_REQUESTS,
        };
      default:
        return { message: message || '서버 오류가 발생했습니다.', code };
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    return { message: '서버에 연결할 수 없습니다.', code: ErrorCode.NETWORK_ERROR };
  } else {
    // 요청 자체에 문제가 있는 경우
    return { message: error.message || '알 수 없는 오류가 발생했습니다.' };
  }
};

// 네트워크 에러 확인
export const isNetworkError = (error: any): boolean => {
  return !error.response && error.request;
};

// 인증 에러 확인
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401 || error.response?.status === 403;
};

// 권한 에러 확인
export const isPermissionError = (error: any): boolean => {
  return error.response?.status === 403;
};

// 서버 에러 확인
export const isServerError = (error: any): boolean => {
  return error.response?.status >= 500;
};
