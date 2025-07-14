'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/common/SectionHeader';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ScrollToTopButton } from '@/components/common';
import { FORM_STYLES } from '@/constants/form-styles';
import { ProductService } from '@/services/productService';
import type { SellerProductDetail } from '@/types/product';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface ProductDetailProps {
  productId: number;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<SellerProductDetail | null>(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ProductService.getSellerProductDetail(productId);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || '상품 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleBack = () => {
    router.push('/seller/products');
  };

  const handleEdit = () => {
    router.push(`/seller/products/${productId}/edit`);
  };

  const handleDelete = () => {
    // TODO: 삭제 확인 다이얼로그 및 삭제 로직 구현
    console.log('Delete product:', productId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <StatusBadge status="in_progress" />;
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center rounded-lg bg-bg-200 px-3 py-1.5 text-xs font-medium text-text-200">
            공구 대기중
          </span>
        );

      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getCategoryPath = (categories: any[]) => {
    if (!categories || categories.length === 0) return null;
    return categories.map((cat) => cat.name).join(' > ');
  };

  if (error) {
    return <div className="py-20 text-center text-red-500">서버 오류가 발생했습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
        <div className="mb-6 flex items-center gap-4">
          <LoadingSkeleton className="h-8 w-8" />
          <LoadingSkeleton className="h-8 w-32" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-48 w-full" />
          ))}
        </div>
        <ScrollToTopButton />
      </div>
    );
  }

  if (!product) {
    return <div className="py-20 text-center text-red-500">상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="h-10 w-10 rounded-lg border border-bg-300 bg-bg-100 p-0 text-text-200 hover:bg-bg-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-text-100">상품 상세</h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleEdit}
            className="h-10 rounded-lg border border-primary-300 bg-bg-100 px-6 text-base text-primary-300 shadow-none transition-colors hover:bg-primary-100 active:bg-primary-100 active:text-primary-300"
          >
            <Edit className="mr-2 h-4 w-4" />
            수정하기
          </Button>
          <Button
            onClick={handleDelete}
            className="h-10 rounded-lg border border-primary-200 bg-bg-100 px-6 text-base text-primary-200 shadow-none transition-colors hover:bg-primary-100 active:bg-primary-100 active:text-primary-200"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제하기
          </Button>
        </div>
      </div>

      {/* 상품 기본 정보 */}
      <Card className={FORM_STYLES.card.seller}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold text-text-100">{product.name}</CardTitle>
              <p className="mt-2 text-sm text-text-200">{product.description}</p>
            </div>
            <div className="ml-4">{getStatusBadge(product.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 카테고리 및 태그 */}
          <div className="flex items-center gap-4">
            {getCategoryPath(product.categories) && (
              <div className="text-sm text-text-100">
                <span className="font-medium">카테고리:</span> {getCategoryPath(product.categories)}
              </div>
            )}
            {product.productTags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-100">태그:</span>
                <div className="flex flex-wrap gap-1">
                  {product.productTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-lg border-bg-300 bg-bg-100 px-2 py-0.5 text-xs text-text-200"
                    >
                      {tag.tagCategoryName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 등록일/수정일 */}
          <div className="flex gap-4 text-sm text-text-300">
            <span>등록일: {formatDate(product.createdAt)}</span>
            <span>수정일: {formatDate(product.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* 상품 옵션 */}
      <section className="mt-8">
        <SectionHeader title="상품 옵션" />
        <div className="mt-4 space-y-4">
          {product.productOptions.map((option) => (
            <Card key={option.id} className={FORM_STYLES.card.seller}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {option.imageUrl && (
                    <img
                      src={option.imageUrl}
                      alt={option.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-100">{option.name}</h3>
                    <p className="mt-1 text-2xl font-bold text-primary-300">
                      {option.price.toLocaleString()}원
                    </p>
                    <p className="mt-2 text-sm text-text-200">{option.fullIngredients}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 화장품 정보제공고시 */}
      <section className="mt-8">
        <SectionHeader title="화장품 정보제공고시" />
        <Card className={FORM_STYLES.card.seller}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <span className="text-sm font-medium text-text-200">내용물의 용량 또는 중량</span>
                <p className="mt-1 text-sm text-text-100">{product.productNotice.capacity}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-text-200">제품 주요 사양</span>
                <p className="mt-1 text-sm text-text-100">{product.productNotice.spec}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-text-200">사용기한</span>
                <p className="mt-1 text-sm text-text-100">{product.productNotice.expiry}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-text-200">화장품제조업자</span>
                <p className="mt-1 text-sm text-text-100">{product.productNotice.manufacturer}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-text-200">화장품책임판매업자</span>
                <p className="mt-1 text-sm text-text-100">
                  {product.productNotice.responsibleSeller}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-text-200">제조국</span>
                <p className="mt-1 text-sm text-text-100">
                  {product.productNotice.countryOfOrigin}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-text-200">사용법</span>
                <p className="mt-1 text-sm text-text-100">{product.productNotice.usage}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-text-200">사용할 때의 주의사항</span>
                <p className="mt-1 text-sm text-text-100">{product.productNotice.caution}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-text-200">품질보증기준</span>
                <p className="mt-1 text-sm text-text-100">{product.productNotice.warranty}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-text-200">기능성 화장품 여부</span>
                <p className="mt-1 text-sm text-text-100">
                  {product.productNotice.functionalCosmetics ? '있음' : '없음'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-text-200">소비자상담 전화번호</span>
                <p className="mt-1 text-sm text-text-100">
                  {product.productNotice.customerServiceNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <ScrollToTopButton />
    </div>
  );
}
