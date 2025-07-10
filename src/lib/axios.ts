import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiError } from '@/types/api';

// 환경변수에서 API URL 가져오기 (개발/운영 환경 분리)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (요청 전에 실행)
axiosInstance.interceptors.request.use(
  (config) => {
    // HttpOnly 쿠키는 자동으로 전송되므로 별도 헤더 설정 불필요
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 (응답 후에 실행) - 토큰 갱신 처리
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 인증이 필요하지 않은 API는 토큰 갱신을 시도하지 않음
      const authRequiredApis = [
        '/auth/me',
        '/members/me',
        '/seller/',
        '/sellers/',
        '/orders/',
        '/mypage/',
        '/cart/',
      ];

      const isAuthRequired = authRequiredApis.some((api) => originalRequest.url?.includes(api));

      if (!isAuthRequired) {
        // 인증이 필요하지 않은 API의 경우 토큰 갱신을 시도하지 않음
        return Promise.reject(error);
      }

      try {
        // 판매자 API인지 확인
        const isSellerApi =
          originalRequest.url?.includes('/seller/') || originalRequest.url?.includes('/sellers/');

        // 판매자 API인 경우 판매자 전용 토큰 갱신, 그 외에는 일반 토큰 갱신
        const refreshEndpoint = isSellerApi ? '/auth/seller/refresh' : '/auth/refresh';

        const response = await axiosInstance.post(refreshEndpoint);

        if (response.status === 200) {
          // 토큰 갱신 성공 시 원래 요청 재시도
          return axiosInstance.request(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        if (typeof window !== 'undefined') {
          // 판매자 API인 경우 판매자 로그인 페이지로, 그 외에는 일반 로그인 페이지로
          const isSellerApi =
            originalRequest.url?.includes('/seller/') || originalRequest.url?.includes('/sellers/');
          const loginPath = isSellerApi ? '/seller-signup' : '/login';
          window.location.href = loginPath;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API 에러 처리 함수
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // 서버에서 응답이 온 경우
    return {
      message: error.response.data?.message || '서버 오류가 발생했습니다.',
      status: error.response.status,
      code: error.response.data?.errorCode,
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

export default axiosInstance;
