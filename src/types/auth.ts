// 인증 관련 타입 정의
export type LoginType = 'buyer' | 'seller';
export type SocialProvider = 'kakao' | 'google';
export type UserType = 'MEMBER' | 'SELLER';

// 로그인 폼 데이터
export interface LoginFormData {
  email: string;
  password: string;
}

// 판매자 회원가입 폼 데이터
export interface SellerSignupFormData {
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

// 약관 동의 데이터
export interface AgreementData {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

// 인증 상태
export interface AuthState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  loginType: LoginType;
  loginFormData: LoginFormData;
  signupFormData: SellerSignupFormData;
  agreements: AgreementData;
  brandGuide: string;
  brandGuideType: 'success' | 'error' | 'guide';
}

// 사용자 정보
export interface UserInfo {
  member_id: number;
  email: string;
  nickname: string;
  profile_image?: string;
  user_type: UserType;
}

// 인증 에러 타입
export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

// 소셜 로그인 응답
export interface SocialLoginResponse {
  authUrl: string;
}

// 인증 성공 응답 (HttpOnly 쿠키 방식)
export interface AuthSuccessResponse {
  member_info: UserInfo;
  // 토큰은 HttpOnly 쿠키로 관리되므로 클라이언트에서 직접 접근하지 않음
}

// 중복 체크 응답
export interface DuplicateCheckResponse {
  isAvailable: boolean;
  field: string;
}

// 인증 관련 유틸리티 타입
export type AuthAction =
  | { type: 'SET_LOGIN_TYPE'; payload: LoginType }
  | { type: 'SET_LOGIN_FORM_DATA'; payload: Partial<LoginFormData> }
  | { type: 'SET_SIGNUP_FORM_DATA'; payload: Partial<SellerSignupFormData> }
  | { type: 'SET_AGREEMENTS'; payload: Partial<AgreementData> }
  | { type: 'SET_BRAND_GUIDE'; payload: { guide: string; type: 'success' | 'error' | 'guide' } }
  | { type: 'SET_AUTH_STATE'; payload: { isLoggedIn: boolean; userInfo: UserInfo | null } }
  | { type: 'RESET_LOGIN_FORM' }
  | { type: 'RESET_SIGNUP_FORM' }
  | { type: 'LOGOUT' };
