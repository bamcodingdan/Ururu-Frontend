'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ScrollToTopButton } from '@/components/common';
import { FORM_STYLES } from '@/constants/form-styles';
import { PRODUCT_CONSTANTS } from '@/constants/product-constants';
import { ProductService } from '@/services/productService';
import type { SellerProduct, SellerProductListResponse } from '@/types/product';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export function ProductManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<SellerProductListResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // 상품 목록 조회
  const fetchProducts = async (page: number = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ProductService.getSellerProducts(page, pageSize);
      setProductData(data);
    } catch (err: any) {
      setError(err.message || '상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleRefresh = () => {
    fetchProducts(currentPage);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
      case 'DELETED':
        return null;
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

  const getTagNames = (tagCategories: any[]) => {
    if (!tagCategories || tagCategories.length === 0) return [];
    return tagCategories.map((tag) => tag.tagCategoryName);
  };

  const products = productData?.content || [];
  const totalElements = productData?.totalElements || 0;
  const totalPages = productData?.totalPages || 0;
  const isFirst = productData?.first || true;
  const isLast = productData?.last || true;

  // 카운트 계산
  const activeCount = products.filter((p) => p.status === 'ACTIVE').length;
  const inactiveCount = products.filter((p) => p.status === 'INACTIVE').length;

  if (error) {
    return <div className="py-20 text-center text-red-500">서버 오류가 발생했습니다.</div>;
  }
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
        <h1 className="mb-10 text-center text-3xl font-semibold text-text-100">상품 관리</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-24 w-full" />
          ))}
        </div>
        <ScrollToTopButton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
      {/* 타이틀 */}
      <h1 className="mb-10 text-center text-3xl font-semibold text-text-100">상품 관리</h1>

      {/* 상단 카운트 3개 */}
      <div className="mx-auto mb-10 flex w-full max-w-md justify-center">
        <div className="flex flex-1 flex-col items-center">
          <span className="text-2xl font-bold text-text-100 md:text-4xl">{totalElements}</span>
          <span className="mt-1 text-center text-sm font-medium text-text-200 md:text-lg">
            전체
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-2xl font-bold text-text-100 md:text-4xl">{activeCount}</span>
          <span className="mt-1 text-center text-sm font-medium text-text-200 md:text-lg">
            판매중
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <span className="text-2xl font-bold text-text-100 md:text-4xl">{inactiveCount}</span>
          <span className="mt-1 text-center text-sm font-medium text-text-200 md:text-lg">
            판매 대기
          </span>
        </div>
      </div>

      {/* 상품 목록 섹션 */}
      <section>
        <SectionHeader title="등록된 상품" description={`총 ${totalElements}개의 상품`} />
        <div className="mt-8">
          {products.length === 0 ? (
            <div className="space-y-6">
              <EmptyState
                icon="📦"
                title="등록된 상품이 없습니다"
                description="첫 번째 상품을 등록해보세요"
              />
              <div className="text-center">
                <Button className={FORM_STYLES.button.submit}>
                  <Plus className="mr-2 h-4 w-4" />
                  상품 등록하기
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="space-y-4"
              style={{
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {products.map((product) => (
                <Card key={product.id} className={FORM_STYLES.card.seller}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <h3 className="flex-1 text-lg font-semibold text-text-100">{product.name}</h3>
                      {getStatusBadge(product.status)}
                    </div>
                    <p className="mb-2 line-clamp-2 text-sm text-text-200">{product.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-200">
                      {getCategoryPath(product.categories) && (
                        <div className="flex items-center gap-1">
                          <span className="text-text-300">카테고리:</span>
                          <span className="font-medium">{getCategoryPath(product.categories)}</span>
                        </div>
                      )}
                      {getTagNames(product.tagCategories).length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-text-300">태그:</span>
                          <div className="flex flex-wrap gap-1">
                            {getTagNames(product.tagCategories).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="rounded-lg border-bg-300 bg-bg-100 px-2 py-0.5 text-xs text-text-200"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-text-300">
                      <span>등록일: {formatDate(product.createdAt)}</span>
                      <span>수정일: {formatDate(product.updatedAt)}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        onClick={() => console.log('View product:', product.id)}
                        className="h-10 rounded-lg border border-primary-300 bg-bg-100 px-6 text-base text-primary-300 shadow-none transition-colors hover:bg-primary-100 active:bg-primary-100 active:text-primary-300"
                      >
                        상세보기
                      </Button>
                      <Button
                        onClick={() => console.log('Edit product:', product.id)}
                        className="h-10 rounded-lg border border-primary-300 bg-bg-100 px-6 text-base text-primary-300 shadow-none transition-colors hover:bg-primary-100 active:bg-primary-100 active:text-primary-300"
                      >
                        수정하기
                      </Button>
                      <Button
                        onClick={() => console.log('Delete product:', product.id)}
                        className="h-10 rounded-lg border border-primary-200 bg-bg-100 px-6 text-base text-primary-200 shadow-none transition-colors hover:bg-primary-100 active:bg-primary-100 active:text-primary-200"
                      >
                        삭제하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isFirst}
            className="h-8 px-3"
          >
            이전
          </Button>
          <span className="text-sm text-text-200">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLast}
            className="h-8 px-3"
          >
            다음
          </Button>
        </div>
      )}

      {/* ScrollToTopButton - 일관된 스크롤 동작 */}
      <ScrollToTopButton />
    </div>
  );
}
