import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '우르르 - 뷰티 공동구매 커머스',
  description:
    '함께하면 더 저렴한 뷰티 상품을 만나보세요. 스킨케어, 메이크업, 마스크팩 등 다양한 뷰티 상품을 공동구매로 합리적인 가격에 구매하세요.',
  keywords: [
    '뷰티',
    '공동구매',
    '스킨케어',
    '메이크업',
    '마스크팩',
    '클렌징',
    '선케어',
    '향수',
    '헤어케어',
    '바디케어',
    '우르르',
  ],
  openGraph: {
    title: '우르르 - 뷰티 공동구매 커머스',
    description: '함께하면 더 저렴한 뷰티 상품을 만나보세요.',
    type: 'website',
    url: 'https://www.ururu.shop',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
