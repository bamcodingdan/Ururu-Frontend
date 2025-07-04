import React from 'react';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MOCK_POINT_BALANCE, MOCK_POINT_EARN_METHODS, MOCK_POINT_HISTORY } from '@/data/point';
import { formatPrice } from '@/lib/format-utils';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function NoticeCard() {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg bg-bg-100 p-6 shadow-sm">
      <Image
        src="/ururu-gradient.svg"
        alt="우르르"
        width={24}
        height={24}
        className="h-6 w-6 flex-shrink-0"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-text-200">
          다양한 활동을 통해 포인트를 적립할 수 있어요!
        </p>
      </div>
    </div>
  );
}

function PointStatus() {
  return (
    <section className="flex flex-col items-center justify-center py-6">
      <div className="mb-2 flex items-center">
        <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-full border border-primary-200 bg-bg-100 text-xl font-semibold text-primary-200 shadow-none">
          P
        </span>
        <span className="text-lg font-bold text-text-100">보유 포인트</span>
      </div>
      <div className="mb-1 text-4xl font-semibold text-primary-300">
        {formatPrice(MOCK_POINT_BALANCE)}
      </div>
    </section>
  );
}

function EarnMethods() {
  return (
    <section className="mb-6">
      <h2 className="mb-4 text-lg font-semibold text-text-100">포인트 적립 방법</h2>
      <Accordion type="multiple" className="w-full space-y-2">
        {MOCK_POINT_EARN_METHODS.map((method, index) => (
          <AccordionItem key={method.label} value={`method-${index}`} className="border-bg-300">
            <AccordionTrigger className="py-3 text-text-100 hover:text-primary-300 hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="text-xl">{method.icon}</span>
                <span className="font-medium">{method.label}</span>
                <span className="text-sm font-semibold text-primary-300">+{method.amount}P</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-text-200">
              <div className="px-4 py-2">
                <p className="text-sm">
                  {method.label === '공구 참여' && '공동구매에 참여하면 10P를 적립받을 수 있어요!'}
                  {method.label === '친구 초대' &&
                    '친구를 초대하고 첫 구매를 완료하면 100P를 적립받을 수 있어요!'}
                  {method.label === '리뷰 작성' && '상품 리뷰를 작성하면 50P를 적립받을 수 있어요!'}
                  {method.label === '포토 리뷰' &&
                    '실사용 사진과 함께 리뷰를 작성하면 100P를 적립받을 수 있어요!'}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function PointHistoryList() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-text-100">포인트 적립/사용 내역</h2>
      <div className="space-y-6">
        {MOCK_POINT_HISTORY.map((group) => (
          <div key={group.date}>
            <div className="mb-3 mt-2 text-sm font-semibold text-text-100">{group.date}</div>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-bg-100 shadow-sm px-5 py-4 transition-all duration-200 hover:scale-[1.02]"
                >
                  <div>
                    <div className="mb-1 font-medium text-text-100">{item.title}</div>
                    {item.description && (
                      <div className="whitespace-pre-line text-xs text-text-300">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      'ml-4 text-base font-semibold',
                      item.amount > 0 ? 'text-primary-300' : 'text-text-300',
                    )}
                  >
                    {item.amount > 0
                      ? `+${formatPrice(item.amount)}P`
                      : `${formatPrice(item.amount)}P`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PointPage() {
  return (
    <MyPageLayout>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <NoticeCard />
        <PointStatus />
        <EarnMethods />
        <PointHistoryList />
      </div>
    </MyPageLayout>
  );
}
