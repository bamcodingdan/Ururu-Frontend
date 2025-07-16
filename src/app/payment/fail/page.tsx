'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NoFooterLayout } from '@/components/layout/layouts';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { toast } from 'sonner';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 파라미터 추출
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (message) {
      toast.error(`결제 실패: ${message}`);
    }
  }, [message]);

  const getErrorMessage = () => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다.';
      case 'FORBIDDEN_REQUEST':
        return '잘못된 요청입니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거부했습니다.';
      case 'NOT_SUPPORTED_CARD_TYPE':
        return '지원되지 않는 카드입니다.';
      case 'FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING':
        return '결제 시스템 처리 중 오류가 발생했습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 처리가 중단되었습니다.';
      default:
        return message || '알 수 없는 오류가 발생했습니다.';
    }
  };

  return (
    <NoFooterLayout>
      <div className="container mx-auto max-w-4xl px-6 py-8 md:px-8 md:py-12">
        <Card className="rounded-2xl border-0 bg-bg-100 shadow-none">
          <CardContent className="px-6 py-8 text-center">
            <div className="mb-4 text-4xl">❌</div>
            <h1 className="mb-4 text-2xl font-semibold text-text-100">결제 실패</h1>
            <p className="mb-8 text-text-200">{getErrorMessage()}</p>

            {orderId && (
              <div className="mb-8 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-text-200">주문번호:</span>
                  <span className="text-text-100">{orderId}</span>
                </div>
                {code && (
                  <div className="flex justify-between">
                    <span className="text-text-200">오류 코드:</span>
                    <span className="text-text-100">{code}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/cart')}
                className="hover:bg-primary-400 w-full bg-primary-300"
              >
                장바구니로 돌아가기
              </Button>
              <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                홈으로 가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </NoFooterLayout>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton lines={5} className="h-screen" />}>
      <PaymentFailContent />
    </Suspense>
  );
}
