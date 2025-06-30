import { myPageData } from '@/data/mypage';
import {
  Package,
  CreditCard,
  Star,
  MapPin,
  LogOut,
  UserX,
  Shield,
  FileText,
  ChevronRight,
} from 'lucide-react';

const iconMap = {
  Package,
  CreditCard,
  Star,
  MapPin,
  LogOut,
  UserX,
  Shield,
  FileText,
};

const sectionList = [
  {
    title: '쇼핑 활동',
    items: [
      { icon: 'Package', label: '취소/반품 내역', href: '/mypage/returns' },
      { icon: 'CreditCard', label: '우르르 포인트 내역', href: '/mypage/points' },
      { icon: 'Star', label: '나의 리뷰', href: '/mypage/reviews' },
      { icon: 'MapPin', label: '배송지 관리', href: '/mypage/addresses' },
    ],
  },
  {
    title: '계정 관리',
    items: [
      { icon: 'LogOut', label: '로그아웃', href: '/logout' },
      { icon: 'UserX', label: '회원탈퇴', href: '/mypage/withdraw' },
    ],
  },
  {
    title: '도움말',
    items: [
      { icon: 'Shield', label: '개인정보 처리방침', href: '/privacy' },
      { icon: 'FileText', label: '서비스 이용약관', href: '/terms' },
    ],
  },
];

export function ShoppingActivities() {
  return (
    <div className="divide-y divide-gray-100 rounded-2xl bg-white px-6 py-4 shadow-[0_4px_24px_0_rgba(0,0,0,0.06)]">
      {sectionList.map((section, idx) => (
        <div key={section.title} className={idx !== 0 ? 'pt-4' : ''}>
          <div className="mb-2 text-sm font-semibold text-gray-900">{section.title}</div>
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-pink-50"
                  >
                    <Icon className="mr-3 h-5 w-5 shrink-0 text-gray-400 group-hover:text-pink-400" />
                    <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-pink-400" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
