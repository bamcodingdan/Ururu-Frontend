import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth';
import { toast } from 'sonner';

export const useLogout = () => {
  const { setIsLoggedIn, setUserInfo } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // ✅ 백엔드 logout API 호출 (Redis 토큰 삭제)
      await logout();

      // ✅ 로그아웃 성공 시 클라이언트 상태 초기화
      setIsLoggedIn(false);
      setUserInfo(null);

      toast.success('로그아웃되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // ✅ 로그아웃 실패해도 클라이언트 상태는 초기화
      setIsLoggedIn(false);
      setUserInfo(null);
      toast.error('로그아웃 중 오류가 발생했습니다.');
      router.push('/');
    }
  };

  return { handleLogout };
};
