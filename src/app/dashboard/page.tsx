'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
  id: number;
  nickname: string;
  email: string;
  profileImage?: string;
  role: string;
  point: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/members/me', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('인증 실패');
      }

      const data = await res.json();
      setUser(data.data); // API 응답 구조에 맞게 조정
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">우르르 대시보드</h1>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 환영 메시지 */}
          <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {user?.profileImage ? (
                    <img className="h-16 w-16 rounded-full" src={user.profileImage} alt="프로필" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300">
                      <span className="text-xl font-semibold text-gray-600">
                        {user?.nickname?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    안녕하세요, {user?.nickname || '사용자'}님! 👋
                  </h2>
                  <p className="text-gray-600">우르르에 오신 것을 환영합니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 사용자 정보 카드 */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
                      <span className="text-sm font-medium text-white">👤</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">닉네임</dt>
                      <dd className="text-lg font-medium text-gray-900">{user?.nickname || '-'}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
                      <span className="text-sm font-medium text-white">📧</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">이메일</dt>
                      <dd className="text-lg font-medium text-gray-900">{user?.email || '-'}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
                      <span className="text-sm font-medium text-white">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">포인트</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.point?.toLocaleString() || '0'} P
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 주요 기능 메뉴 */}
          <div className="rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">주요 기능</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <button className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                  <div className="mb-2 text-2xl">🛍️</div>
                  <div className="text-sm font-medium">쇼핑하기</div>
                </button>
                <button className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                  <div className="mb-2 text-2xl">📦</div>
                  <div className="text-sm font-medium">주문내역</div>
                </button>
                <button className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                  <div className="mb-2 text-2xl">⭐</div>
                  <div className="text-sm font-medium">리뷰관리</div>
                </button>
                <button className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                  <div className="mb-2 text-2xl">👤</div>
                  <div className="text-sm font-medium">마이페이지</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
