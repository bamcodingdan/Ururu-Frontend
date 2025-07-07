import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '판매자 센터',
  description: '우르르 판매자 센터에서 상품을 관리하고 공구를 진행하세요.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
