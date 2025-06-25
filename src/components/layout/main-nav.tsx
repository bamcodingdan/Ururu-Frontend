'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { categoryItems } from '@/data/categories';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="hidden bg-bg-100 desktop:block">
      <div className="container">
        <NavigationMenu className="h-12">
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-pretendard font-normal text-text-200 transition-all hover:bg-bg-200 hover:font-medium">
                카테고리
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-bg-100">
                <ul className="grid w-[600px] gap-3 p-4 md:w-[900px] md:grid-cols-3">
                  {categoryItems.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-bg-200 hover:text-text-200 focus:bg-bg-200 focus:text-text-200"
                        >
                          <div className="font-pretendard text-sm font-medium leading-none text-text-200">
                            {item.title}
                          </div>
                          <div className="mt-2 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="font-pretendard block text-xs font-normal text-text-200 transition-all hover:font-medium hover:text-text-200"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'font-pretendard font-normal text-text-200 transition-all hover:bg-bg-200 hover:font-medium',
                  )}
                >
                  홈
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/ranking" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'font-pretendard font-normal text-text-200 transition-all hover:bg-bg-200 hover:font-medium',
                  )}
                >
                  랭킹
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/short" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'font-pretendard font-normal text-text-200 transition-all hover:bg-bg-200 hover:font-medium',
                  )}
                >
                  숏구
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/event" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'font-pretendard font-normal text-text-200 transition-all hover:bg-bg-200 hover:font-medium',
                  )}
                >
                  이벤트
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
