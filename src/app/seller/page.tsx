'use client';

import { EmptyPage } from '@/components/seller/common';
import { useAuthGuard } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store';

export default function SellerPage() {
  const { isLoggedIn, isLoading } = useAuthGuard();
  const userInfo = useAuthStore((state) => state.userInfo);
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료되고 로그인하지 않았거나, 판매자가 아닌 경우
    if (!isLoading && (!isLoggedIn || userInfo?.user_type !== 'SELLER')) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, userInfo, router]);

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isLoggedIn || userInfo?.user_type !== 'SELLER') {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-text-200">로딩 중...</div>
      </div>
    );
  }

  return <EmptyPage title="준비중이에요" />;
}
