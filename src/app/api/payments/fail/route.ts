import { NextRequest, NextResponse } from 'next/server';

// 동적 라우트로 설정 (searchParams 사용을 위해)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    console.log('토스 결제 실패 리다이렉트 처리:', {
      code,
      message,
      orderId,
    });

    // TODO: 실제 백엔드 API 호출로 결제 실패 정보 저장
    // 현재는 모의 데이터로 응답

    // 에러 메시지 매핑
    const getErrorMessage = (errorCode: string | null, errorMessage: string | null) => {
      switch (errorCode) {
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
          return errorMessage || '알 수 없는 오류가 발생했습니다.';
      }
    };

    // 실패 응답
    return NextResponse.json(
      {
        success: false,
        message: '결제에 실패했습니다',
        data: {
          errorCode: code,
          errorMessage: getErrorMessage(code, message),
          orderId,
        },
      },
      { status: 400 },
    );
  } catch (error) {
    console.error('결제 실패 처리 실패:', error);

    return NextResponse.json(
      {
        success: false,
        message: '결제 실패 처리 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}
