import { Home, Menu, History, User } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
}

export interface BottomNavItem extends NavItem {
  icon: React.ComponentType<{ className?: string }>;
}

// 메인 네비게이션 아이템 (데스크톱/모바일 공통)
export const MAIN_NAV_ITEMS: NavItem[] = [
  { href: '/ranking', label: '랭킹' },
  { href: '/short', label: '숏구' },
  { href: '/event', label: '이벤트' },
];

// 하단 네비게이션 아이템
export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    href: '/',
    label: '홈',
    icon: Home,
  },
  {
    href: '/category',
    label: '카테고리',
    icon: Menu,
  },
  {
    href: '/history',
    label: '히스토리',
    icon: History,
  },
  {
    href: '/mypage',
    label: '마이페이지',
    icon: User,
  },
];
