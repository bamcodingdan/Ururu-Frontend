'use client';

export function TopBar() {
  return (
    <div className="desktop:block bg-bg-100 hidden">
      <div className="container">
        <div className="flex h-12 items-center justify-end">
          <nav className="flex items-center space-x-6">
            <a
              href="/login"
              className="text-text-200 hover:text-text-100 text-sm transition-colors"
            >
              로그인
            </a>
            <a href="/cart" className="text-text-200 hover:text-text-100 text-sm transition-colors">
              장바구니
            </a>
            <a
              href="/history"
              className="text-text-200 hover:text-text-100 text-sm transition-colors"
            >
              히스토리
            </a>
            <a
              href="/orders"
              className="text-text-200 hover:text-text-100 text-sm transition-colors"
            >
              주문배송
            </a>
            <a
              href="/mypage"
              className="text-text-200 hover:text-text-100 text-sm transition-colors"
            >
              마이페이지
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
