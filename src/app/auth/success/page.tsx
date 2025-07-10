'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { getCurrentUser } from '@/services/auth';

export default function AuthSuccessPage() {
  const router = useRouter();
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getCurrentUser();
        setIsLoggedIn(true);
        setUserInfo(userInfo);

        // 사용자 타입에 따라 리다이렉트
        if (userInfo.user_type === 'SELLER') {
          router.replace('/seller');
        } else {
          router.replace('/');
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        setIsLoggedIn(false);
        setUserInfo(null);
        router.replace('/login');
      }
    };

    fetchUser();
  }, [router, setIsLoggedIn, setUserInfo]);

  // 로딩 중에는 아무것도 렌더링하지 않음
  return null;
}
