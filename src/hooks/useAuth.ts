import { sellerLogin, logout, getCurrentUser } from '@/services/auth';
import { useAuthStore } from '@/store';
import type { SellerLoginRequest } from '@/services/auth';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { setIsLoggedIn, setUserInfo } = useAuthStore();
  const router = useRouter();

  // 판매자 로그인
  const handleSellerLogin = useCallback(
    async (credentials: SellerLoginRequest) => {
      try {
        const response = await sellerLogin(credentials);

        // 로그인 성공 시 상태 업데이트
        setIsLoggedIn(true);
        setUserInfo(response.member_info);

        // 판매자 센터로 리다이렉트
        router.push('/seller');

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
      await logout();
      setIsLoggedIn(false);
      setUserInfo(null);
      // 로그아웃 후 홈페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬 상태는 초기화
      setIsLoggedIn(false);
      setUserInfo(null);
      router.push('/');
    }
  }, [setIsLoggedIn, setUserInfo, router]);

  // 사용자 정보 조회
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

  return {
    handleSellerLogin,
    handleSellerLogout,
    handleGetCurrentUser,
  };
};
