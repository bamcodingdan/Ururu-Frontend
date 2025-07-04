'use client';

import Link from 'next/link';
import { useSafePathname } from '@/hooks';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export function MobileNav() {
  const { pathname } = useSafePathname();

  const navItems = [
    { href: '/ranking', label: '랭킹' },
    { href: '/short', label: '숏구' },
    { href: '/event', label: '이벤트' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="bg-bg-100 desktop:hidden">
      <div className="px-6">
        <NavigationMenu className="h-12">
          <NavigationMenuList className="space-x-2">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'font-pretendard font-normal text-text-200 transition-all hover:bg-bg-200 hover:font-medium',
                      isActive(item.href) && 'font-medium text-primary-300',
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
