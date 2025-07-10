// API 응답 기본 타입
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 에러 응답 타입 (HTTP 에러 처리용)
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// 백엔드 API 응답 형식
export interface ApiResponseFormat<T> {
  success: boolean;
  message: string;
  data: T;
}

// 사용자 정보 타입
export interface UserInfo {
  member_id: number;
  email: string;
  nickname: string;
  profile_image?: string;
  user_type: 'MEMBER' | 'SELLER';
}
// 토큰 정보 타입
export interface TokenInfo {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// 로그인 응답 타입
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  member_info: UserInfo;
}

// 판매자 회원가입 요청 타입
export interface SellerSignupRequest {
  name: string; // 브랜드명
  businessName: string; // 사업자명
  ownerName: string; // 대표자명
  businessNumber: string; // 사업자등록번호
  email: string; // 이메일
  password: string; // 비밀번호
  phone: string; // 전화번호
  image?: string; // 브랜드 대표 이미지 (선택)
  address1: string; // 주소1
  address2: string; // 주소2
  mailOrderNumber: string; // 통신판매업 신고번호
}

// 판매자 회원가입 응답 타입
export interface SellerSignupResponse {
  id: number;
  name: string;
  businessName: string;
  ownerName: string;
  businessNumber: string;
  email: string;
  phone: string;
  image?: string;
  address1: string;
  address2: string;
  mailOrderNumber: string;
  createdAt: string;
  updatedAt: string;
}

// 중복 체크 응답 타입
export interface AvailabilityResponse {
  isAvailable: boolean;
  field: string;
}
