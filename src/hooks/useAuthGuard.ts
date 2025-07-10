import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { getCurrentUser } from '@/services/auth';

export const useAuthGuard = () => {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, setUserInfo, userInfo } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ 클라이언트 상태가 이미 로그아웃 상태라면 서버 확인 생략
        if (!isLoggedIn) {
          setIsLoading(false);
          router.replace('/login');
          return;
        }

        // 서버에 실제 인증 상태 확인 (HttpOnly 쿠키 자동 전송)
        const userInfo = await getCurrentUser();
        setIsLoggedIn(true);
        setUserInfo(userInfo);
        setIsLoading(false);
      } catch (error) {
        // 인증되지 않은 경우 로그인 페이지로 리다이렉트
        console.log('인증이 필요합니다. 로그인 페이지로 이동합니다.');
        setIsLoggedIn(false);
        setUserInfo(null);
        router.replace('/login');
      }
    };

    // 새로고침 시 클라이언트 상태가 초기화되므로 항상 서버에 실제 인증 상태 확인
    checkAuth();
  }, [router, setIsLoggedIn, setUserInfo, isLoggedIn]);

  return { isLoggedIn, isLoading, userInfo };
};
