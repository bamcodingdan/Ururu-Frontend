'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth, isCheckingAuth, isAuthenticated } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 인증 상태 확인
    const initializeAuth = async () => {
      if (hasInitialized.current) {
        return;
      }

      try {
        hasInitialized.current = true;
        await checkAuth();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
    };

    // 이미 인증 확인 중이 아니고, 아직 초기화하지 않은 경우에만 실행
    if (!isCheckingAuth && !hasInitialized.current) {
      initializeAuth();
    }
  }, []); // 의존성 배열을 비워서 한 번만 실행

  return <>{children}</>;
};
