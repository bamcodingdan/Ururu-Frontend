'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 앱 시작 시 한 번만 인증 상태 확인
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      console.log('AuthProvider: 인증 상태 확인 시작');
      checkAuth();
    }
  }, [checkAuth]);

  return <>{children}</>;
};
