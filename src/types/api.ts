// API 관련 타입 정의

// 기본 API 응답 구조
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

// API 에러 타입
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// 사용자 정보 타입
export interface UserInfo {
  member_id: number;
  email: string;
  nickname: string;
  profile_image?: string;
  user_type: 'MEMBER' | 'SELLER';
}

// 로그인 응답 타입 (HttpOnly 쿠키 방식)
export interface LoginResponse {
  member_info: UserInfo;
  // 토큰은 HttpOnly 쿠키로 관리되므로 클라이언트에서 직접 접근하지 않음
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginationResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

// 검색 파라미터 타입
export interface SearchParams {
  keyword?: string;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 필터 파라미터 타입
export interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  ratings?: number[];
  availability?: 'in_stock' | 'out_of_stock' | 'all';
}
