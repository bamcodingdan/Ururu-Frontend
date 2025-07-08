'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Package,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  User,
  Plus,
  Users,
  FileText,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SELLER_PROFILE } from '@/data/seller';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    label: '대시보드',
    href: '/seller',
  },
  {
    icon: <Package className="h-4 w-4" />,
    label: '상품 관리',
    href: '/seller/products',
  },
  {
    icon: <Plus className="h-4 w-4" />,
    label: '상품 등록',
    href: '/seller/products/new',
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: '공구 관리',
    href: '/seller/group-buys',
  },
  {
    icon: <Plus className="h-4 w-4" />,
    label: '공구 등록',
    href: '/seller/group-buys/new',
  },
  {
    icon: <FileText className="h-4 w-4" />,
    label: '주문 관리',
    href: '/seller/orders',
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    label: '통계 분석',
    href: '/seller/analytics',
  },
  {
    icon: <User className="h-4 w-4" />,
    label: '프로필',
    href: '/seller/profile',
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: '스토어 설정',
    href: '/seller/settings',
  },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-bg-300 bg-bg-100">
      {/* 로고 */}
      <div className="flex h-16 items-center justify-center border-b border-bg-300">
        <Link href="/seller" className="flex items-center gap-2">
          <Image
            src="/ururu-gradient.svg"
            alt="우르르"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-semibold text-text-100">판매자 센터</span>
        </Link>
      </div>

      {/* 프로필 */}
      <div className="border-b border-bg-300 p-4">
        <div className="flex items-center gap-3">
          <Image
            src={SELLER_PROFILE.avatar}
            alt={SELLER_PROFILE.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-100">{SELLER_PROFILE.name}</p>
            <p className="truncate text-xs text-text-200">{SELLER_PROFILE.email}</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-300'
                  : 'text-text-200 hover:bg-bg-200 hover:text-text-100',
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 로그아웃 */}
      <div className="border-t border-bg-300 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-200 transition-colors hover:bg-bg-200 hover:text-text-100">
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
