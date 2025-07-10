'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { CustomLayout } from '@/components/layout';

export default function AuthSuccessPage() {
  const { checkAuth, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 인증 상태 확인
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // 인증 완료 후 적절한 페이지로 리다이렉트
    if (isAuthenticated && user) {
      if (user.user_type === 'SELLER') {
        router.push('/seller');
      } else {
        router.push('/mypage');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <CustomLayout showTopBar={false} showSearchBar={false} showMainNav={false} showFooter={false}>
      <div className="flex min-h-screen items-center justify-center bg-bg-100">
        <div className="text-center">
          <div className="mb-4 text-6xl">✅</div>
          <h1 className="mb-2 text-xl font-semibold text-text-100">로그인 성공!</h1>
          <p className="text-text-200">잠시 후 자동으로 이동됩니다...</p>
        </div>
      </div>
    </CustomLayout>
  );
}
