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

export function MainNav() {
  const pathname = usePathname();

  const categoryItems = [
    {
      title: '스킨케어',
      href: '/category/skincare',
      subItems: [
        { title: '스킨/토너', href: '/category/skincare/skin-toner' },
        { title: '에센스/세럼/앰플', href: '/category/skincare/essence-serum-ampoule' },
        { title: '크림', href: '/category/skincare/cream' },
        { title: '로션', href: '/category/skincare/lotion' },
        { title: '미스트/오일', href: '/category/skincare/mist-oil' },
        { title: '스킨케어세트', href: '/category/skincare/skincare-set' },
        { title: '스킨케어 디바이스', href: '/category/skincare/skincare-device' },
      ],
    },
    {
      title: '마스크팩',
      href: '/category/mask',
      subItems: [
        { title: '시트팩', href: '/category/mask/sheet-mask' },
        { title: '패드', href: '/category/mask/pad' },
        { title: '페이셜팩', href: '/category/mask/facial-pack' },
        { title: '코팩', href: '/category/mask/nose-pack' },
        { title: '패치', href: '/category/mask/patch' },
      ],
    },
    {
      title: '클렌징',
      href: '/category/cleansing',
      subItems: [
        { title: '클렌징폼/젤', href: '/category/cleansing/cleansing-foam-gel' },
        { title: '오일/밤', href: '/category/cleansing/oil-balm' },
        { title: '워터/밀크', href: '/category/cleansing/water-milk' },
        { title: '필링&스크럽', href: '/category/cleansing/peeling-scrub' },
        { title: '티슈/패드', href: '/category/cleansing/tissue-pad' },
        { title: '립&아이리무버', href: '/category/cleansing/lip-eye-remover' },
        { title: '클렌징 디바이스', href: '/category/cleansing/cleansing-device' },
      ],
    },
    {
      title: '선케어',
      href: '/category/suncare',
      subItems: [
        { title: '선크림', href: '/category/suncare/sun-cream' },
        { title: '선스틱', href: '/category/suncare/sun-stick' },
        { title: '선쿠션', href: '/category/suncare/sun-cushion' },
        { title: '선스프레이/선패치', href: '/category/suncare/sun-spray-patch' },
        { title: '태닝/애프터선', href: '/category/suncare/tanning-after-sun' },
      ],
    },
    {
      title: '메이크업',
      href: '/category/makeup',
      subItems: [
        { title: '립메이크업', href: '/category/makeup/lip-makeup' },
        { title: '베이스메이크업', href: '/category/makeup/base-makeup' },
        { title: '아이메이크업', href: '/category/makeup/eye-makeup' },
      ],
    },
    {
      title: '향수',
      href: '/category/perfume',
      subItems: [
        { title: '액체향수', href: '/category/perfume/liquid-perfume' },
        { title: '고체향수', href: '/category/perfume/solid-perfume' },
        { title: '바디퍼퓸', href: '/category/perfume/body-perfume' },
        { title: '헤어퍼퓸', href: '/category/perfume/hair-perfume' },
      ],
    },
    {
      title: '헤어케어',
      href: '/category/haircare',
      subItems: [
        { title: '샴푸/린스', href: '/category/haircare/shampoo-rinse' },
        { title: '트리트먼트/팩', href: '/category/haircare/treatment-pack' },
        { title: '두피앰플/토닉', href: '/category/haircare/scalp-ampoule-tonic' },
        { title: '헤어에센스', href: '/category/haircare/hair-essence' },
        { title: '염색약/펌', href: '/category/haircare/dye-perm' },
        { title: '헤어기기/브러시', href: '/category/haircare/hair-device-brush' },
        { title: '스타일링', href: '/category/haircare/styling' },
      ],
    },
    {
      title: '바디케어',
      href: '/category/bodycare',
      subItems: [
        { title: '샤워/입욕', href: '/category/bodycare/shower-bath' },
        { title: '로션/오일/미스트', href: '/category/bodycare/lotion-oil-mist' },
        { title: '핸드케어', href: '/category/bodycare/hand-care' },
        { title: '풋케어', href: '/category/bodycare/foot-care' },
        { title: '제모/왁싱', href: '/category/bodycare/hair-removal-waxing' },
        { title: '데오드란트', href: '/category/bodycare/deodorant' },
        { title: '베이비', href: '/category/bodycare/baby' },
      ],
    },
  ];

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
