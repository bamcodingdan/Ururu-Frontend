export interface UserInfo {
  member_id: number;
  email: string;
  nickname: string;
  profile_image: string | null;
  user_type: 'MEMBER' | 'SELLER';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  member_info: UserInfo;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SellerSignupData {
  name: string;
  businessName: string;
  ownerName: string;
  businessNumber: string;
  email: string;
  password: string;
  phone: string;
  image?: string;
  address1: string;
  address2: string;
  mailOrderNumber?: string;
}

export interface AvailabilityCheckResponse {
  is_available: boolean;
  message: string;
}

export interface SellerProfile {
  id: number;
  name: string;
  business_name: string;
  owner_name: string;
  business_number: string;
  email: string;
  phone: string;
  image: string | null;
  address1: string;
  address2: string;
  mail_order_number: string | null;
  created_at: string;
  updated_at: string;
  is_available: boolean;
}

// 소셜 로그인 관련 타입
export type SocialProvider = 'kakao' | 'google';

export interface SocialAuthUrlResponse {
  provider: string;
  authUrl: string;
  state: string;
  redirectUri: string;
}

export interface SocialLoginRequest {
  code: string;
  state?: string;
}
