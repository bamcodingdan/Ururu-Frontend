// 토스페이먼츠 API 서비스
export class TossPaymentsService {
  private static getAuthHeader() {
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      throw new Error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.');
    }
    return `Basic ${Buffer.from(secretKey + ':').toString('base64')}`;
  }

  // 결제 상태 확인
  static async getPaymentStatus(paymentKey: string) {
    const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
      method: 'GET',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || '결제 정보를 조회할 수 없습니다.');
    }

    return response.json();
  }

  // 결제 승인
  static async confirmPayment(paymentKey: string, orderId: string, amount: number) {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.message || '결제 승인에 실패했습니다.');
    }

    return response.json();
  }
}
