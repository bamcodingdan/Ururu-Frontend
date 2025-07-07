import { useCallback, useState } from 'react';
import { getAuthUrl } from '@/services/auth';

interface UseSocialLoginReturn {
  isLoading: boolean;
  error: string | null;
  handleKakaoLogin: () => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  clearError: () => void;
}

export const useSocialLogin = (): UseSocialLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 카카오 로그인 (리다이렉트 방식)
  const handleKakaoLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authUrl = await getAuthUrl('kakao');
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || '카카오 로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }, []);

  // 구글 로그인 (리다이렉트 방식)
  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authUrl = await getAuthUrl('google');
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || '구글 로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    handleKakaoLogin,
    handleGoogleLogin,
    clearError,
  };
};
