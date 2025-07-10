'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import { getCurrentUser } from '@/services/auth';

export default function AuthHydrator({ children }: { children: React.ReactNode }) {
  const { setIsLoggedIn, setUserInfo } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // HttpOnly 쿠키는 자동으로 전송되므로 사용자 정보 조회로 인증 상태 확인
        const userInfo = await getCurrentUser();
        setIsLoggedIn(true);
        setUserInfo(userInfo);
      } catch (error) {
        console.error('인증 상태 복원 실패:', error);
        // 에러 발생 시 상태 초기화
        setIsLoggedIn(false);
        setUserInfo(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [setIsLoggedIn, setUserInfo]);

  // 초기화가 완료될 때까지 로딩 상태 표시
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-200">로딩 중...</div>
      </div>
    );
  }

  return <>{children}</>;
}
