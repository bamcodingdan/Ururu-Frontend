import { Button } from '@/components/ui/button';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { AddressCard } from '@/components/mypage/address';
import { NoticeBanner } from '@/components/common';
import Link from 'next/link';
import { FORM_STYLES } from '@/constants/form-styles';
import { addressListData } from '@/data/address';
import { cn } from '@/lib/utils';

export default function AddressListPage() {
  return (
    <MyPageLayout>
      <div className="flex flex-1 flex-col gap-6 py-4 md:py-6">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-center text-2xl font-semibold text-text-100">배송지 관리</h1>
        </div>

        {/* 안내 배너 */}
        <NoticeBanner message="배송지는 최대 5개까지 등록할 수 있어요" />

      {/* 배송지 리스트 */}
      <div className="flex flex-col gap-4">
        {addressListData.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </div>

      {/* 배송지 추가 버튼 */}
      <div className="mb-4">
        <Link href="/mypage/address/register">
          <Button
            variant="outline"
            className={cn(
              'h-12 w-full rounded-lg border-bg-300 bg-bg-100 text-text-300 transition-colors hover:border-primary-300 hover:bg-bg-100 hover:text-primary-300',
            )}
          >
            배송지 추가하기
          </Button>
        </Link>
      </div>
      </div>
    </MyPageLayout>
  );
}
