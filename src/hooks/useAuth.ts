import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sellerLogin, logout, getCurrentUser, refreshSellerToken } from '@/services/auth';
import { useAuthStore } from '@/store';
import type { LoginFormData, UserInfo } from '@/types/auth';

export const useAuth = () => {
  const { setIsLoggedIn, setUserInfo } = useAuthStore();
  const router = useRouter();

  // 판매자 로그인
  const handleSellerLogin = useCallback(
    async (credentials: LoginFormData) => {
      try {
        const response = await sellerLogin(credentials);

        // 로그인 성공 시 상태 업데이트
        setIsLoggedIn(true);
        setUserInfo(response.member_info);

        // 판매자는 판매자 센터로, 일반 회원은 메인 홈으로 리다이렉트
        if (response.member_info.user_type === 'SELLER') {
          router.push('/seller');
        } else {
          router.push('/');
        }

        return response;
      } catch (error: any) {
        // 로그인 실패 시 상태 초기화
        setIsLoggedIn(false);
        setUserInfo(null);
        throw error;
      }
    },
    [setIsLoggedIn, setUserInfo, router],
  );

  // 판매자 로그아웃
  const handleSellerLogout = useCallback(async () => {
    try {
      // ✅ 백엔드 logout API 호출 (Redis 토큰 삭제)
      await logout();

      // ✅ 로그아웃 성공 시 클라이언트 상태 초기화
      setIsLoggedIn(false);
      setUserInfo(null);

      // ✅ 로그아웃 후 홈페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // ✅ 로그아웃 실패해도 클라이언트 상태는 초기화
      setIsLoggedIn(false);
      setUserInfo(null);
      router.push('/');
    }
  }, [setIsLoggedIn, setUserInfo, router]);

  // 판매자 전용 토큰 갱신
  const handleSellerTokenRefresh = useCallback(async () => {
    try {
      const response = await refreshSellerToken();

      // 토큰 갱신 성공 시 사용자 정보 업데이트
      setIsLoggedIn(true);
      setUserInfo(response.member_info);

      return response;
    } catch (error: any) {
      // 토큰 갱신 실패 시 로그아웃 처리
      setIsLoggedIn(false);
      setUserInfo(null);
      router.push('/seller-signup');
      throw error;
    }
  }, [setIsLoggedIn, setUserInfo, router]);

  // 사용자 정보 조회 (새로고침 시에도 로그인 상태 유지)
  const handleGetCurrentUser = useCallback(async () => {
    try {
      const userInfo = await getCurrentUser();
      setIsLoggedIn(true);
      setUserInfo(userInfo);
      return userInfo;
    } catch (error) {
      setIsLoggedIn(false);
      setUserInfo(null);
      throw error;
    }
  }, [setIsLoggedIn, setUserInfo]);

  // 인증 상태 확인 (공개 페이지용)
  const checkAuthStatus = useCallback(async () => {
    try {
      const userInfo = await getCurrentUser();
      setIsLoggedIn(true);
      setUserInfo(userInfo);
      return { isLoggedIn: true, userInfo };
    } catch (error) {
      setIsLoggedIn(false);
      setUserInfo(null);
      return { isLoggedIn: false, userInfo: null };
    }
  }, [setIsLoggedIn, setUserInfo]);

  return {
    handleSellerLogin,
    handleSellerLogout,
    handleSellerTokenRefresh,
    handleGetCurrentUser,
    checkAuthStatus,
  };
};
