import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import type { UserInfo } from '@/types/auth';

// 로그인 폼 데이터 타입
interface LoginFormData {
  email: string;
  password: string;
}

// 회원가입 폼 데이터 타입
interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  brand: string;
  company: string;
  ceo: string;
  businessNumber: string;
  phone: string;
  zipcode: string;
  addressRoad: string;
  addressJibun: string;
  addressDetail: string;
}

// 약관 동의 타입
interface Agreements {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

// 인증 상태 타입
interface AuthState {
  // 로그인 상태
  loginType: 'buyer' | 'seller';
  loginFormData: LoginFormData;
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  isCheckingAuth: boolean; // 인증 확인 중인지 체크

  // 회원가입 상태
  signupFormData: SignupFormData;
  agreements: Agreements;
  brandGuide: string;
  brandGuideType: 'success' | 'error' | 'guide';

  // 액션들
  setLoginType: (type: 'buyer' | 'seller') => void;
  setLoginFormData: (data: Partial<LoginFormData>) => void;
  setSignupFormData: (data: Partial<SignupFormData>) => void;
  setAgreements: (agreements: Partial<Agreements>) => void;
  setBrandGuide: (guide: string, type: 'success' | 'error' | 'guide') => void;
  resetLoginForm: () => void;
  resetSignupForm: () => void;

  // 인증 액션들
  login: (user: UserInfo) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      loginType: 'buyer',
      loginFormData: {
        email: '',
        password: '',
      },
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      isCheckingAuth: false, // 인증 확인 중인지 체크
      signupFormData: {
        email: '',
        password: '',
        passwordConfirm: '',
        brand: '',
        company: '',
        ceo: '',
        businessNumber: '',
        phone: '',
        zipcode: '',
        addressRoad: '',
        addressJibun: '',
        addressDetail: '',
      },
      agreements: {
        all: false,
        terms: false,
        privacy: false,
        marketing: false,
      },
      brandGuide: '',
      brandGuideType: 'guide',

      // 로그인 관련 액션들
      setLoginType: (type) => set({ loginType: type }),
      setLoginFormData: (data) =>
        set((state) => ({
          loginFormData: { ...state.loginFormData, ...data },
        })),
      setSignupFormData: (data) =>
        set((state) => ({
          signupFormData: { ...state.signupFormData, ...data },
        })),
      setAgreements: (agreements) =>
        set((state) => ({
          agreements: { ...state.agreements, ...agreements },
        })),
      setBrandGuide: (guide, type) => set({ brandGuide: guide, brandGuideType: type }),
      resetLoginForm: () =>
        set({
          loginFormData: { email: '', password: '' },
          error: null,
        }),
      resetSignupForm: () =>
        set({
          signupFormData: {
            email: '',
            password: '',
            passwordConfirm: '',
            brand: '',
            company: '',
            ceo: '',
            businessNumber: '',
            phone: '',
            zipcode: '',
            addressRoad: '',
            addressJibun: '',
            addressDetail: '',
          },
          agreements: {
            all: false,
            terms: false,
            privacy: false,
            marketing: false,
          },
          brandGuide: '',
          brandGuideType: 'guide',
          error: null,
        }),

      // 인증 액션들
      login: (user) => set({ isAuthenticated: true, user, error: null }),
      logout: () => set({ isAuthenticated: false, user: null, error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      checkAuth: async () => {
        const state = get();

        // 이미 인증 확인 중이거나 로딩 중이면 스킵
        if (state.isCheckingAuth || state.isLoading) {
          console.log('인증 확인 스킵: 이미 진행 중');
          return;
        }

        // 이미 인증된 상태이면 스킵
        if (state.isAuthenticated && state.user) {
          console.log('인증 확인 스킵: 이미 인증됨');
          return;
        }

        set({ isCheckingAuth: true, isLoading: true });
        try {
          console.log('인증 상태 확인 시작...');
          const response = await api.get('/auth/me');
          console.log('인증 상태 확인 응답:', response.data);

          if (response.data.success && response.data.data?.member_info) {
            set({
              isAuthenticated: true,
              user: response.data.data.member_info,
              error: null,
            });
            console.log('인증 성공:', response.data.data.member_info);
          } else {
            set({ isAuthenticated: false, user: null });
            console.log('인증되지 않은 사용자');
          }
        } catch (error: any) {
          console.error('인증 상태 확인 에러:', error);
          set({ isAuthenticated: false, user: null });
        } finally {
          set({ isLoading: false, isCheckingAuth: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
