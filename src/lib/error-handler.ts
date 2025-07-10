import { config, isProduction } from '@/config/environment';
import type { AuthError } from '@/types/auth';

// 에러 레벨 타입
export type ErrorLevel = 'info' | 'warn' | 'error' | 'fatal';

// 에러 컨텍스트 타입
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

// 에러 로깅 함수
export const logError = (
  error: Error | string,
  level: ErrorLevel = 'error',
  context?: ErrorContext,
) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = error instanceof Error ? error.stack : undefined;

  const logData = {
    timestamp: new Date().toISOString(),
    level,
    message: errorMessage,
    stack: errorStack,
    environment: isProduction() ? 'production' : 'development',
    ...context,
  };

  // 개발 환경에서는 콘솔에 출력
  if (!isProduction()) {
    console.group(`[${level.toUpperCase()}] ${errorMessage}`);
    console.log('Context:', context);
    console.log('Stack:', errorStack);
    console.groupEnd();
  }

  // 운영 환경에서는 에러 로깅 서비스로 전송
  if (isProduction()) {
    // TODO: 실제 에러 로깅 서비스 연동 (Sentry, LogRocket 등)
    // logToService(logData);
  }
};

// 인증 에러 처리
export const handleAuthError = (error: any): AuthError => {
  let authError: AuthError = {
    message: '인증 중 오류가 발생했습니다.',
  };

  if (error.response) {
    // 서버 응답이 있는 경우
    const { status, data } = error.response;

    switch (status) {
      case 400:
        authError.message = data?.message || '잘못된 요청입니다.';
        authError.field = data?.field;
        break;
      case 401:
        authError.message = '이메일 또는 비밀번호가 올바르지 않습니다.';
        break;
      case 403:
        authError.message = '접근 권한이 없습니다.';
        break;
      case 409:
        authError.message = data?.message || '이미 존재하는 정보입니다.';
        authError.field = data?.field;
        break;
      case 422:
        authError.message = data?.message || '입력 정보를 확인해주세요.';
        authError.field = data?.field;
        break;
      case 500:
        authError.message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        break;
      default:
        authError.message = data?.message || '알 수 없는 오류가 발생했습니다.';
    }

    authError.code = data?.code;
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    authError.message = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
  } else {
    // 요청 자체에 문제가 있는 경우
    authError.message = error.message || '알 수 없는 오류가 발생했습니다.';
  }

  // 에러 로깅
  logError(error, 'error', {
    component: 'auth',
    action: 'authentication',
    additionalData: {
      errorType: 'auth',
      errorCode: authError.code,
      errorField: authError.field,
    },
  });

  return authError;
};

// 폼 검증 에러 처리
export const handleValidationError = (field: string, message: string): AuthError => {
  return {
    message,
    field,
    code: 'VALIDATION_ERROR',
  };
};

// 네트워크 에러 처리
export const handleNetworkError = (error: any): AuthError => {
  logError(error, 'error', {
    component: 'network',
    action: 'api_request',
  });

  return {
    message: '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.',
    code: 'NETWORK_ERROR',
  };
};

// 타임아웃 에러 처리
export const handleTimeoutError = (): AuthError => {
  return {
    message: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
    code: 'TIMEOUT_ERROR',
  };
};
