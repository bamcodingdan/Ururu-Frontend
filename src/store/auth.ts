import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  LoginType,
  LoginFormData,
  SellerSignupFormData,
  AgreementData,
  AuthState,
  UserInfo,
  AuthAction,
} from '@/types/auth';

// 초기 상태
const initialLoginFormData: LoginFormData = {
  email: '',
  password: '',
};

const initialSignupFormData: SellerSignupFormData = {
  name: '',
  businessName: '',
  ownerName: '',
  businessNumber: '',
  email: '',
  password: '',
  phone: '',
  image: '',
  address1: '',
  address2: '',
  mailOrderNumber: '',
};

const initialAgreements: AgreementData = {
  all: false,
  terms: false,
  privacy: false,
  marketing: false,
};

const initialState: AuthState = {
  isLoggedIn: false,
  userInfo: null,
  loginType: 'buyer',
  loginFormData: initialLoginFormData,
  signupFormData: initialSignupFormData,
  agreements: initialAgreements,
  brandGuide: '',
  brandGuideType: 'guide',
};

// 액션 타입
interface AuthActions {
  // 로그인 타입 설정
  setLoginType: (type: LoginType) => void;

  // 로그인 폼 데이터 설정
  setLoginFormData: (data: Partial<LoginFormData>) => void;

  // 회원가입 폼 데이터 설정
  setSignupFormData: (data: Partial<SellerSignupFormData>) => void;

  // 약관 동의 설정
  setAgreements: (agreements: Partial<AgreementData>) => void;

  // 브랜드 가이드 설정
  setBrandGuide: (guide: string, type: 'success' | 'error' | 'guide') => void;

  // 인증 상태 설정
  setIsLoggedIn: (loggedIn: boolean) => void;
  setUserInfo: (user: UserInfo | null) => void;

  // 폼 리셋
  resetLoginForm: () => void;
  resetSignupForm: () => void;

  // 로그아웃
  logout: () => void;
}

// 스토어 타입
type AuthStore = AuthState & AuthActions;

// 약관 동의 로직
const updateAgreements = (
  currentAgreements: AgreementData,
  updates: Partial<AgreementData>,
): AgreementData => {
  const newAgreements = { ...currentAgreements, ...updates };

  // "전체 동의" 체크박스가 변경된 경우 모든 개별 약관 동기화
  if ('all' in updates) {
    newAgreements.terms = updates.all!;
    newAgreements.privacy = updates.all!;
    newAgreements.marketing = updates.all!;
  } else {
    // 개별 약관이 변경된 경우 "전체 동의" 상태 업데이트
    newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
  }

  return newAgreements;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 로그인 타입 설정
      setLoginType: (type) => set({ loginType: type }),

      // 로그인 폼 데이터 설정
      setLoginFormData: (data) =>
        set((state) => ({
          loginFormData: { ...state.loginFormData, ...data },
        })),

      // 회원가입 폼 데이터 설정
      setSignupFormData: (data) =>
        set((state) => ({
          signupFormData: { ...state.signupFormData, ...data },
        })),

      // 약관 동의 설정
      setAgreements: (updates) =>
        set((state) => ({
          agreements: updateAgreements(state.agreements, updates),
        })),

      // 브랜드 가이드 설정
      setBrandGuide: (guide, type) => set({ brandGuide: guide, brandGuideType: type }),

      // 인증 상태 설정
      setIsLoggedIn: (loggedIn) =>
        set((state) => ({
          isLoggedIn: loggedIn,
          userInfo: loggedIn ? state.userInfo : null, // 로그아웃 시 사용자 정보도 초기화
        })),

      setUserInfo: (user) =>
        set({
          userInfo: user,
          isLoggedIn: user !== null, // 사용자 정보가 있으면 로그인 상태 true
        }),

      // 폼 리셋
      resetLoginForm: () => set({ loginFormData: initialLoginFormData }),

      resetSignupForm: () =>
        set({
          signupFormData: initialSignupFormData,
          agreements: initialAgreements,
          brandGuide: '',
          brandGuideType: 'guide',
        }),

      // 로그아웃
      logout: () => {
        // HttpOnly 쿠키는 서버에서 삭제되므로 클라이언트에서 별도 처리 불필요
        set({
          isLoggedIn: false,
          userInfo: null,
        });
      },
    }),
    {
      name: 'auth-store',
    },
  ),
);
