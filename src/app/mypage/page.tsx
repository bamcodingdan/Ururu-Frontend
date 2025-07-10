'use client';

import React, { useEffect, useRef } from 'react';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { ProfileCard } from '@/components/mypage/ProfileCard';
import { BeautyProfileSummary } from '@/components/mypage/beauty-profile';
import { MobileSidebarList } from '@/components/mypage/MobileSidebarList';
import { useMyPage } from '@/hooks/useMyPage';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const { hasBeautyProfile, summaryInfo } = useMyPage();
  const { isAuthenticated, user, checkAuth, isLoading, isCheckingAuth } = useAuthStore();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // 인증 상태 확인 (한 번만 실행)
    if (!isAuthenticated && !isLoading && !isCheckingAuth) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, isCheckingAuth, checkAuth]);

  useEffect(() => {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트 (한 번만)
    if (!isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isAuthenticated) {
    return (
      <MyPageLayout>
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="text-sm text-text-200">로딩 중...</div>
        </div>
      </MyPageLayout>
    );
  }

  // 사용자 정보가 없는 경우
  if (!user) {
    return (
      <MyPageLayout>
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="text-sm text-text-200">사용자 정보를 불러올 수 없습니다.</div>
        </div>
      </MyPageLayout>
    );
  }

  return (
    <MyPageLayout>
      {/* 프로필 카드 */}
      <ProfileCard user={user} />

      {/* 뷰티 프로필 요약 카드 */}
      {hasBeautyProfile && <BeautyProfileSummary summaryInfo={summaryInfo} />}

      {/* 모바일/태블릿: 사이드바 리스트 */}
      <MobileSidebarList />
    </MyPageLayout>
  );
}
