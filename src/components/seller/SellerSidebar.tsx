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
    icon: <BarChart3 className="h-4 w-4" />,
    label: '통계',
    href: '/seller/analytics',
  },
  {
    icon: <FileText className="h-4 w-4" />,
    label: '주문 관리',
    href: '/seller/orders',
  },
  {
    icon: <Store className="h-4 w-4" />,
    label: '스토어 설정',
    href: '/seller/settings',
  },
  {
    icon: <User className="h-4 w-4" />,
    label: '프로필 수정',
    href: '/seller/profile',
  },
  {
    icon: <LogOut className="h-4 w-4" />,
    label: '로그아웃',
    href: '/login',
  },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-bg-300 bg-bg-100">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-bg-300 p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src="/profile-image.svg"
              alt="프로필"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-text-100">우르르</p>
            <p className="truncate text-xs text-text-200">ururu@ururu.com</p>
          </div>
        </div>
      </div>

      {/* 메인 메뉴 */}
      <nav className="flex-1 space-y-2 p-4">
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
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
