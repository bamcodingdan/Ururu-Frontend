'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSeller?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  requireSeller = false,
}) => {
  const { user, isAuthenticated, isLoading, isCheckingAuth, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && !isLoading) {
      checkAuth();
    }
  }, [checkAuth, isCheckingAuth, isLoading]);

  useEffect(() => {
    if (!isLoading && !isCheckingAuth) {
      if (requireAuth && !isAuthenticated) {
        // 인증이 필요한 페이지인데 로그인되지 않은 경우
        router.push('/login');
        return;
      }

      if (requireSeller && user?.user_type !== 'SELLER') {
        // 판매자 권한이 필요한 페이지인데 판매자가 아닌 경우
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, user, requireAuth, requireSeller, router, isLoading, isCheckingAuth]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary-300"></div>
          <p className="mt-2 text-sm text-text-200">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
