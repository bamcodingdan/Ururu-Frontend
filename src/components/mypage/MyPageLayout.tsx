import { ReactNode } from 'react';
import { NoFooterLayout } from '@/components/layout/layouts';
import { Sidebar } from './Sidebar';

interface MyPageLayoutProps {
  children: ReactNode;
  mobileExtra?: ReactNode;
}

export function MyPageLayout({ children, mobileExtra }: MyPageLayoutProps) {
  return (
    <NoFooterLayout className="bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Desktop 사이드바 */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <Sidebar />
          </div>
          {/* 메인 컨텐츠 */}
          <div className="min-w-0 flex-1">
            <div className="mb-6 lg:hidden">
              <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
              <p className="mt-1 text-gray-600">내 정보와 주문 내역을 확인하세요</p>
            </div>
            <div className="space-y-6">
              {children}
              {/* 모바일/태블릿에서만 extra(쇼핑활동 등) 표시 */}
              <div className="block lg:hidden">{mobileExtra}</div>
            </div>
          </div>
        </div>
      </div>
    </NoFooterLayout>
  );
}
