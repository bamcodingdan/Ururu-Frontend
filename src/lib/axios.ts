import axios, { AxiosError, AxiosResponse } from 'axios';

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// API 에러 타입
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // 쿠키 자동 전송
  timeout: 10000,
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 네트워크 에러 처리
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({
        message: '네트워크 연결을 확인해주세요.',
        status: 0,
        code: 'NETWORK_ERROR',
      });
    }

    // 401 에러 처리 - 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      console.error('Authentication failed:', error);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // 서버 에러 처리
    const errorMessage = error.response?.data?.message || '서버 오류가 발생했습니다.';
    const errorStatus = error.response?.status || 500;
    const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR';

    console.error('API Error:', {
      message: errorMessage,
      status: errorStatus,
      code: errorCode,
      url: error.config?.url,
    });

    return Promise.reject({
      message: errorMessage,
      status: errorStatus,
      code: errorCode,
    });
  },
);

// API 에러 처리 함수
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // 서버에서 응답이 왔지만 에러인 경우
    return {
      message: error.response.data?.message || '서버 오류가 발생했습니다.',
      status: error.response.status,
      code: error.response.data?.code,
    };
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    return {
      message: '서버에 연결할 수 없습니다.',
      status: 0,
    };
  } else {
    // 요청 자체에 문제가 있는 경우
    return {
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      status: 0,
    };
  }
};

export default api;
