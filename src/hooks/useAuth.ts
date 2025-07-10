import { useAuthStore } from '@/store/auth';
import api from '@/lib/axios';
import type { UserInfo, SellerSignupData } from '@/types/auth';

// 소셜 로그인 훅
export const useSocialLogin = () => {
  const { login, setLoading, setError } = useAuthStore();

  const initiateSocialLogin = async (provider: 'kakao' | 'google') => {
    try {
      console.log(`소셜 로그인 시작: ${provider}`);
      setLoading(true);
      setError(null);

      // OAuth URL 생성
      const response = await api.get(`/auth/social/auth-url/${provider}`);
      console.log('소셜 로그인 응답:', response.data);

      const { authUrl } = response.data.data;

      // OAuth 페이지로 리다이렉트
      console.log('OAuth URL로 리다이렉트:', authUrl);
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('소셜 로그인 에러:', error);
      console.error('에러 응답:', error.response?.data);
      setError(error.response?.data?.message || '소셜 로그인 URL 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { initiateSocialLogin };
};

// 판매자 로그인 훅
export const useSellerLogin = () => {
  const { login, setLoading, setError } = useAuthStore();

  const sellerLogin = async (email: string, password: string) => {
    try {
      console.log('판매자 로그인 시작:', { email });
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/seller/login', {
        email,
        password,
      });

      console.log('판매자 로그인 응답:', response.data);

      if (response.data.success) {
        login(response.data.data.member_info);
      }
    } catch (error: any) {
      console.error('판매자 로그인 에러:', error);
      console.error('에러 응답:', error.response?.data);
      setError(error.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { sellerLogin };
};

// 판매자 회원가입 훅
export const useSellerSignup = () => {
  const { setLoading, setError } = useAuthStore();

  const sellerSignup = async (signupData: SellerSignupData) => {
    try {
      console.log('판매자 회원가입 시작:', signupData);
      setLoading(true);
      setError(null);

      const response = await api.post('/sellers/signup', signupData);

      console.log('판매자 회원가입 응답:', response.data);

      if (response.data.success) {
        return response.data.data;
      }
    } catch (error: any) {
      console.error('판매자 회원가입 에러:', error);
      console.error('에러 응답:', error.response?.data);
      setError(error.response?.data?.message || '회원가입에 실패했습니다.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { sellerSignup };
};

// 중복 체크 훅
export const useAvailabilityCheck = () => {
  const checkEmail = async (email: string) => {
    try {
      console.log('이메일 중복 체크:', email);
      const response = await api.get(`/sellers/check/email?email=${email}`);
      console.log('이메일 중복 체크 응답:', response.data);
      return response.data.data.is_available;
    } catch (error: any) {
      console.error('이메일 중복 체크 에러:', error);
      console.error('에러 응답:', error.response?.data);
      throw error;
    }
  };

  const checkBusinessNumber = async (businessNumber: string) => {
    try {
      console.log('사업자등록번호 중복 체크:', businessNumber);
      const response = await api.get(
        `/sellers/check/business-number?businessNumber=${businessNumber}`,
      );
      console.log('사업자등록번호 중복 체크 응답:', response.data);
      return response.data.data.is_available;
    } catch (error: any) {
      console.error('사업자등록번호 중복 체크 에러:', error);
      console.error('에러 응답:', error.response?.data);
      throw error;
    }
  };

  const checkBrandName = async (name: string) => {
    try {
      console.log('브랜드명 중복 체크:', name);
      const response = await api.get(`/sellers/check/name?name=${name}`);
      console.log('브랜드명 중복 체크 응답:', response.data);
      return response.data.data.is_available;
    } catch (error: any) {
      console.error('브랜드명 중복 체크 에러:', error);
      console.error('에러 응답:', error.response?.data);
      throw error;
    }
  };

  return { checkEmail, checkBusinessNumber, checkBrandName };
};

// 로그아웃 훅
export const useLogout = () => {
  const { logout, setLoading, setError } = useAuthStore();

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.post('/auth/logout');
      logout();
    } catch (error: any) {
      setError(error.response?.data?.message || '로그아웃에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout };
};

// 판매자 프로필 조회 훅
export const useSellerProfile = () => {
  const { setLoading, setError } = useAuthStore();

  const getSellerProfile = async (sellerId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/sellers/${sellerId}`);

      if (response.data.success) {
        return response.data.data;
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '프로필 조회에 실패했습니다.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { getSellerProfile };
};
