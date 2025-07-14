'use client';

import { Button } from '@/components/ui/button';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { AddressCard } from '@/components/mypage/address';
import { NoticeBanner, PageHeader, LoadingSkeleton } from '@/components/common';
import Link from 'next/link';
import { FORM_STYLES } from '@/constants/form-styles';
import { cn } from '@/lib/utils';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAddressList } from '@/hooks/useAddressList';

function AddressListPageContent() {
  const { addresses, loading, error } = useAddressList();

  if (loading) {
    return (
      <MyPageLayout>
        <div className="flex flex-1 flex-col gap-6 py-4 md:py-6">
          <PageHeader title="배송지 관리" />
          <NoticeBanner message="배송지는 최대 5개까지 등록할 수 있어요" />
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </MyPageLayout>
    );
  }

  if (error) {
    return (
      <MyPageLayout>
        <div className="flex flex-1 flex-col gap-6 py-4 md:py-6">
          <PageHeader title="배송지 관리" />
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-text-300">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              다시 시도
            </Button>
          </div>
        </div>
      </MyPageLayout>
    );
  }

  return (
    <MyPageLayout>
      <div className="flex flex-1 flex-col gap-6 py-4 md:py-6">
        {/* 페이지 헤더 */}
        <PageHeader title="배송지 관리" />

        {/* 안내 배너 */}
        <NoticeBanner message="배송지는 최대 5개까지 등록할 수 있어요" />

        {/* 배송지 리스트 */}
        <div className="flex flex-col gap-4">
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-text-300">등록된 배송지가 없습니다.</p>
            </div>
          ) : (
            addresses.map((address) => <AddressCard key={address.id} address={address} />)
          )}
        </div>

        {/* 배송지 추가 버튼 */}
        <div className="mb-4">
          <Link href="/mypage/address/register">
            <Button variant="outline" className={cn(FORM_STYLES.button.addressAdd)}>
              배송지 추가하기
            </Button>
          </Link>
        </div>
      </div>
    </MyPageLayout>
  );
}

export default function AddressListPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AddressListPageContent />
    </AuthGuard>
  );
}
