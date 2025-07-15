'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/common/SectionHeader';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ScrollToTopButton, ErrorDialog, ConfirmDialog } from '@/components/common';
import { FORM_STYLES } from '@/constants/form-styles';
import { ProductService } from '@/services/productService';
import { useProductStore } from '@/store';
import type { SellerProductDetail, Tag } from '@/types/product';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface ProductDetailProps {
  productId: number;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const { setCurrentProduct, setCurrentProductTags } = useProductStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<SellerProductDetail | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; productName: string }>({
    isOpen: false,
    productName: '',
  });
  const [deleteError, setDeleteError] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ProductService.getSellerProductDetail(productId);
        setProduct(data);
        setCurrentProduct(data); // 스토어에 상품 데이터 저장

        // 상품의 태그 정보를 Tag 형태로 변환하여 스토어에 저장
        if (data.productTags) {
          const productTags: Tag[] = data.productTags.map((tag) => ({
            value: tag.id,
            label: tag.tagCategoryName,
          }));
          setCurrentProductTags(productTags);
        }
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
    if (product) {
      setDeleteConfirm({
        isOpen: true,
        productName: product.name,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // 실제 삭제 API 호출
      await ProductService.deleteProduct(productId);

      // 삭제 후 목록으로 이동
      router.push('/seller/products');
    } catch (error: any) {
      console.error('Delete failed:', error);
      setDeleteError({
        isOpen: true,
        message: error.message || '상품 삭제에 실패했습니다.',
      });
    } finally {
      setDeleteConfirm({ isOpen: false, productName: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, productName: '' });
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
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ko-KR');
  const getCategoryPath = (categories: any[]) => {
    if (!categories || categories.length === 0) return null;
    return categories.map((cat) => cat.name).join(' > ');
  };

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-red-500 md:ml-0">
        서버 오류가 발생했습니다.
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:ml-0 md:px-0">
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
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-red-500 md:ml-0">
        상품을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
      {/* 타이틀 */}
      <div className="relative mb-10">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 rounded-lg border border-bg-300 bg-bg-100 p-0 text-text-200 hover:bg-bg-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-center text-3xl font-semibold text-text-100">상품 상세</h1>
      </div>

      {/* 상품 기본 정보 카드 */}
      <Card className={FORM_STYLES.card.seller + ' mb-12'}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-text-100">상품 기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-6">
            {/* 상품명 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">상품명</div>
              <div className="text-base text-text-100">{product.name}</div>
            </div>
            {/* 상품 설명 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">상품 설명</div>
              <div className="whitespace-pre-line text-base text-text-100">
                {product.description}
              </div>
            </div>
            {/* 카테고리 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">카테고리</div>
              <div className="text-base text-text-100">{getCategoryPath(product.categories)}</div>
            </div>
            {/* 태그 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">태그</div>
              <div className="flex flex-wrap gap-1">
                {product.productTags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="rounded-lg border-bg-300 bg-bg-100 px-2 py-0.5 text-xs text-text-200"
                  >
                    {tag.tagCategoryName}
                  </Badge>
                ))}
              </div>
            </div>
            {/* 상태 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">상태</div>
              <div>{getStatusBadge(product.status)}</div>
            </div>
            {/* 등록일 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">등록일</div>
              <div className="text-base text-text-100">{formatDate(product.createdAt)}</div>
            </div>
            {/* 수정일 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">수정일</div>
              <div className="text-base text-text-100">{formatDate(product.updatedAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상품 옵션 정보 카드 */}
      <Card className={FORM_STYLES.card.seller + ' mb-12'}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-text-100">상품 옵션 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {product.productOptions.map((option, index) => (
            <div key={index} className="rounded-lg border border-bg-300 p-4">
              <div className="mb-4">
                <div className="mb-1 text-sm font-medium text-text-200">옵션명</div>
                <div className="text-base text-text-100">{option.name}</div>
              </div>
              <div className="mb-4">
                <div className="mb-1 text-sm font-medium text-text-200">가격</div>
                <div className="text-base text-text-100">{option.price.toLocaleString()}원</div>
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-text-200">전성분</div>
                <div className="whitespace-pre-line text-base text-text-100">
                  {option.fullIngredients}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 상품 공시 정보 카드 */}
      <Card className={FORM_STYLES.card.seller + ' mb-12'}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-text-100">상품 공시 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 용량 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">용량</div>
              <div className="text-base text-text-100">{product.productNotice.capacity}</div>
            </div>
            {/* 규격 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">규격</div>
              <div className="text-base text-text-100">{product.productNotice.spec}</div>
            </div>
            {/* 유통기한 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">유통기한</div>
              <div className="text-base text-text-100">{product.productNotice.expiry}</div>
            </div>
            {/* 사용법 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">사용법</div>
              <div className="text-base text-text-100">{product.productNotice.usage}</div>
            </div>
            {/* 제조사 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">제조사</div>
              <div className="text-base text-text-100">{product.productNotice.manufacturer}</div>
            </div>
            {/* 화장품책임판매업자 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">화장품책임판매업자</div>
              <div className="text-base text-text-100">
                {product.productNotice.responsibleSeller}
              </div>
            </div>
            {/* 제조국 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">제조국</div>
              <div className="text-base text-text-100">{product.productNotice.countryOfOrigin}</div>
            </div>
            {/* 기능성 화장품 여부 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">
                기능성 화장품 식품의약품안전처 심사필 여부
              </div>
              <div className="text-base text-text-100">
                {product.productNotice.functionalCosmetics ? '있음' : '없음'}
              </div>
            </div>
            {/* 사용할 때의 주의사항 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">사용할 때의 주의사항</div>
              <div className="text-base text-text-100">{product.productNotice.caution}</div>
            </div>
            {/* 품질보증기준 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">품질보증기준</div>
              <div className="text-base text-text-100">{product.productNotice.warranty}</div>
            </div>
            {/* 소비자상담 전화번호 */}
            <div>
              <div className="mb-1 text-sm font-medium text-text-200">소비자상담 전화번호</div>
              <div className="text-base text-text-100">
                {product.productNotice.customerServiceNumber}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수정하기 삭제하기 버튼 */}
      <div className="pt-2">
        <div className="flex gap-4">
          <Button
            onClick={handleDelete}
            className="border-border-300 h-12 flex-1 rounded-lg border bg-bg-100 text-sm font-medium text-text-300 shadow-none transition hover:border-primary-200 hover:text-primary-200"
          >
            삭제하기
          </Button>
          <Button
            onClick={handleEdit}
            className="h-12 flex-1 rounded-lg bg-primary-300 text-sm font-medium text-text-on shadow-none transition hover:opacity-80 focus:ring-primary-300 active:opacity-90"
          >
            수정하기
          </Button>
        </div>
      </div>

      <ScrollToTopButton />

      {/* 삭제 확인 모달창 */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="상품 삭제 확인"
        message={`"${deleteConfirm.productName}"\n\n상품을 삭제하시겠습니까? 삭제하면 복구가 불가능합니다.`}
        confirmText="삭제하기"
        cancelText="취소"
        variant="danger"
      />

      {/* 삭제 에러 모달창 */}
      <ErrorDialog
        isOpen={deleteError.isOpen}
        onClose={() => setDeleteError({ isOpen: false, message: '' })}
        title="상품 삭제 실패"
        message={`"${deleteConfirm.productName}" 상품 삭제에 실패했습니다.\n\n${deleteError.message}`}
      />
    </div>
  );
}
