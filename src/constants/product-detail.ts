import type { ProductCategory } from '@/types/product';

export const PRODUCT_DETAIL_TABS = [
  { label: '상품설명' },
  { label: '구매정보' },
  { label: '리뷰(999+)' },
  { label: 'Q&A' },
];

// 브레드크럼 아이템 타입
export interface BreadcrumbItem {
  label: string;
  href: string;
}

// 브레드크럼 데이터 - 카테고리별 매핑
export const CATEGORY_BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
  skincare: [{ label: '스킨케어', href: '/category/skincare' }],
  'skincare-skin-toner': [
    { label: '스킨케어', href: '/category/skincare' },
    { label: '스킨/토너', href: '/category/skincare/skin-toner' },
  ],
  makeup: [{ label: '메이크업', href: '/category/makeup' }],
  'makeup-lip': [
    { label: '메이크업', href: '/category/makeup' },
    { label: '립 메이크업', href: '/category/makeup/lip' },
  ],
};

// 기본 브레드크럼 (카테고리 정보가 없을 때)
export const DEFAULT_PRODUCT_BREADCRUMB: BreadcrumbItem[] = [
  { label: '스킨케어', href: '/category/skincare' },
  { label: '스킨/토너', href: '/category/skincare/skin-toner' },
];

// 브레드크럼 생성 유틸리티 함수
export const generateBreadcrumb = (category: ProductCategory): BreadcrumbItem[] => {
  // 메인 카테고리 확인
  const mainCategory = CATEGORY_BREADCRUMB_MAP[category.main];

  if (!mainCategory) {
    return DEFAULT_PRODUCT_BREADCRUMB;
  }

  // 서브 카테고리가 없으면 메인 카테고리만 반환
  if (!category.sub) {
    return mainCategory;
  }

  // 서브 카테고리 키 생성
  const subCategoryKey = `${category.main}-${category.sub}`;
  const subCategory = CATEGORY_BREADCRUMB_MAP[subCategoryKey];

  // 서브 카테고리가 있으면 반환, 없으면 메인 카테고리 반환
  return subCategory || mainCategory;
};

// 카테고리 ID 배열로부터 브레드크럼 생성 함수
export const generateBreadcrumbFromCategoryIds = (categoryIds: string[]): BreadcrumbItem[] => {
  if (!categoryIds || categoryIds.length === 0) {
    return DEFAULT_PRODUCT_BREADCRUMB;
  }

  // 카테고리가 이미 이름인지 ID인지 확인
  const firstCategory = categoryIds[0];
  const isAlreadyName = !firstCategory.match(/^\d+$/); // 숫자가 아니면 이미 이름

  if (isAlreadyName) {
    // 이미 카테고리 이름이 온 경우

    const breadcrumb: BreadcrumbItem[] = [];

    // 첫 번째와 두 번째 카테고리만 표시 (최대 2개)
    const categoriesToShow = categoryIds.slice(0, 2);

    categoriesToShow.forEach((categoryName, index) => {
      if (categoryName) {
        // URL 경로 생성 (이전 카테고리들을 포함한 경로)
        const pathSegments = categoriesToShow
          .slice(0, index + 1)
          .map((cat) => cat.toLowerCase().replace(/\s+/g, '-'));
        const href = `/category/${pathSegments.join('/')}`;

        breadcrumb.push({
          label: categoryName,
          href: href,
        });
      }
    });

    return breadcrumb;
  }

  // ID인 경우 기본 브레드크럼 반환
  return DEFAULT_PRODUCT_BREADCRUMB;
};
