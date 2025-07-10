'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { getCurrentUser } from '@/services/auth';

export default function AuthHydrator({ children }: { children: React.ReactNode }) {
  const setIsLoggedIn = useAuthStore((s) => s.setIsLoggedIn);
  const setUserInfo = useAuthStore((s) => s.setUserInfo);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userInfo = await getCurrentUser();
        setIsLoggedIn(true);
        setUserInfo(userInfo);
      } catch (error) {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkAuthStatus();
  }, [setIsLoggedIn, setUserInfo]);

  return <>{children}</>;
}
