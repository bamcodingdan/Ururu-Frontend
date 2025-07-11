'use client';

import React, { useEffect, useState } from 'react';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { ProfileCard } from '@/components/mypage/ProfileCard';
import { BeautyProfileSummary } from '@/components/mypage/beauty-profile';
import { MobileSidebarList } from '@/components/mypage/MobileSidebarList';
import { useMyPage } from '@/hooks/useMyPage';
import { useAuthStore } from '@/store';
import { AuthGuard } from '@/components/auth/AuthGuard';
import api from '@/lib/axios';
import type { UserInfo } from '@/types/auth';

function MyPageContent() {
  const { hasBeautyProfile, summaryInfo } = useMyPage();
  const { user } = useAuthStore();
  const [mypageData, setMypageData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/members/me/mypage');
        console.log('마이페이지 API 응답:', response.data.data);
        setMypageData(response.data.data);
        setError(null);
      } catch (err) {
        console.error('마이페이지 데이터 조회 실패:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <MyPageLayout>
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="text-sm text-text-200">로딩 중...</div>
        </div>
      </MyPageLayout>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <MyPageLayout>
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="text-sm text-text-200">데이터를 불러올 수 없습니다.</div>
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
      {/* 프로필 카드 - API에서 받아온 데이터 전달 */}
      <ProfileCard user={mypageData} />

      {/* 뷰티 프로필 요약 카드 */}
      {hasBeautyProfile && <BeautyProfileSummary summaryInfo={summaryInfo} />}

      {/* 모바일/태블릿: 사이드바 리스트 */}
      <MobileSidebarList />
    </MyPageLayout>
  );
}

export default function MyPage() {
  return (
    <AuthGuard requireAuth={true}>
      <MyPageContent />
    </AuthGuard>
  );
}
