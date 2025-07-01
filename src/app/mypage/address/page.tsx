import { NoFooterLayout } from '@/components/layout/layouts';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/mypage/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { FORM_STYLES } from '@/constants/form-styles';
import { addressListData } from '@/data/address';

export default function AddressListPage() {
  return (
    <NoFooterLayout className="bg-bg-100">
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-start justify-center gap-0 px-6 py-12 md:px-9 lg:flex-row lg:gap-12 lg:px-12">
        {/* 데스크탑: 사이드바 */}
        <div className="hidden w-[256px] flex-shrink-0 pt-8 lg:block">
          <Sidebar />
        </div>
        {/* 메인 컨텐츠 */}
        <main className="mx-auto mt-0 flex w-full max-w-3xl flex-col gap-8 px-0 lg:mt-0">
          {/* 타이틀 */}
          <h1 className="mb-6 text-center text-2xl font-semibold md:text-2xl">배송지 관리</h1>
          {/* 안내 배너 */}
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-bg-100 p-6 shadow-sm">
            <Image
              src="/ururu-gradient.svg"
              alt="우르르"
              width={24}
              height={24}
              className="h-6 w-6 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-300">
                배송지는 최대 5개까지 등록할 수 있어요
              </p>
            </div>
          </div>

          {/* 배송지 리스트 */}
          <div className="flex flex-col gap-4">
            {addressListData.map((address) => (
              <Card
                key={address.id}
                className="w-full rounded-2xl border-0 bg-bg-100 p-6 shadow-sm"
              >
                <CardContent className="p-0">
                  <div className="mb-2 flex items-center">
                    <span className="text-base font-semibold text-text-100">
                      {address.addressName}
                    </span>
                    {address.isDefault && (
                      <span className="ml-2 rounded-full bg-primary-300 px-3 py-1 text-xs font-semibold text-text-on">
                        기본 배송지
                      </span>
                    )}
                  </div>
                  <div className="mb-1 text-xs text-text-300">({address.zipcode})</div>
                  <div className="mb-1 text-sm text-text-200">도로명 : {address.addressRoad}</div>
                  <div className="mb-1 text-sm text-text-200">지번 : {address.addressJibun}</div>
                  <div className="mb-4 text-sm text-text-200">{address.phone}</div>
                  <Link href={`/mypage/address/register?id=${address.id}`}>
                    <Button className={FORM_STYLES.button.pinkOutline + ' h-12 w-full rounded-lg'}>
                      수정하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 배송지 추가 버튼 */}
          <div className="mb-4">
            <Link href="/mypage/address/register">
              <Button variant="outline" className={FORM_STYLES.button.addressAdd}>
                배송지 추가하기
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </NoFooterLayout>
  );
}
