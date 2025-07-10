'use client';

import React from 'react';
import { CustomLayout } from '@/components/layout/layouts';
import { HistoryProductGrid, EmptyHistoryState } from '@/components/history';
import { PageTitleHeader } from '@/components/common';
import { useHistory } from '@/hooks';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoadingSkeleton } from '@/components/common';

export default function HistoryPage() {
  const { isLoggedIn, isLoading } = useAuthGuard();
  const { historyProducts, hasProducts, isClient } = useHistory();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSkeleton className="h-8 w-8" />
        <span className="ml-2 text-gray-600">로딩 중...</span>
      </div>
    );
  }

  // 서버사이드 렌더링 중에는 로딩 상태 표시
  if (!isClient) {
    return (
      <CustomLayout
        showTopBar={true}
        showSearchBar={true}
        showMainNav={true}
        showFooter={true}
        showBottomNav={true}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 py-8 md:px-9 md:py-10 xl:px-12">
          <div className="flex items-center justify-center py-16">
            <div className="text-text-200">로딩 중...</div>
          </div>
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout
      showTopBar={true}
      showSearchBar={true}
      showMainNav={true}
      showFooter={true}
      showBottomNav={true}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 py-8 md:px-9 md:py-10 xl:px-12">
        <PageTitleHeader title="최근 본 상품" description="최근에 조회한 상품들을 확인해보세요" />

        {hasProducts ? <HistoryProductGrid products={historyProducts} /> : <EmptyHistoryState />}
      </div>
    </CustomLayout>
  );
}
