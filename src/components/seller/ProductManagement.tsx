'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ScrollToTopButton } from '@/components/common';
import { FORM_STYLES } from '@/constants/form-styles';
import { PRODUCT_CONSTANTS } from '@/constants/product-constants';
import { Plus, Package, Edit, Trash2, Eye } from 'lucide-react';

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    name: '컬러그램 누디 블러 틴트 20 COLOR',
    category: '립메이크업',
    status: 'active',
    price: 25000,
    stock: 150,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: '우르르 하이드레이팅 세럼 50ml',
    category: '스킨케어',
    status: 'draft',
    price: 35000,
    stock: 0,
    createdAt: '2024-01-10',
  },
  {
    id: 3,
    name: '글램 퍼펙트 파운데이션 30ml',
    category: '베이스메이크업',
    status: 'active',
    price: 45000,
    stock: 75,
    createdAt: '2024-01-05',
  },
];

export function ProductManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState(mockProducts);

  // Mock loading state
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts(mockProducts);
    } catch (err) {
      setError('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">판매중</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">임시저장</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-700">판매중지</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

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

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
        <h1 className="mb-10 text-center text-3xl font-semibold text-text-100">상품 관리</h1>
        <Card className={FORM_STYLES.card.seller}>
          <CardContent className="p-12 text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-2 text-xl font-semibold text-text-100">오류가 발생했습니다</h2>
            <p className="mb-4 text-sm text-text-200">{error}</p>
            <Button onClick={handleRefresh} className={FORM_STYLES.button.submit}>
              다시 시도
            </Button>
          </CardContent>
        </Card>
        <ScrollToTopButton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
      {/* 타이틀 */}
      <h1 className="mb-10 text-center text-3xl font-semibold text-text-100">상품 관리</h1>

      {/* 통계 섹션 */}
      <section>
        <SectionHeader title="상품 통계" description="상품 판매 현황을 한눈에 확인하세요" />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className={FORM_STYLES.card.seller}>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary-300">{products.length}</div>
              <div className="text-sm text-text-200">전체 상품</div>
            </CardContent>
          </Card>
          <Card className={FORM_STYLES.card.seller}>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter((p) => p.status === 'active').length}
              </div>
              <div className="text-sm text-text-200">판매중</div>
            </CardContent>
          </Card>
          <Card className={FORM_STYLES.card.seller}>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {products.filter((p) => p.stock === 0).length}
              </div>
              <div className="text-sm text-text-200">품절</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 상품 목록 섹션 */}
      <section className="mt-16">
        <SectionHeader title="등록된 상품" description="판매 중인 상품들을 관리할 수 있습니다" />

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
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-text-100">{product.name}</h3>
                          {getStatusBadge(product.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-200">
                          <span>카테고리: {product.category}</span>
                          <span>가격: {formatPrice(product.price)}원</span>
                          <span>재고: {product.stock}개</span>
                          <span>등록일: {formatDate(product.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3"
                          onClick={() => console.log('View product:', product.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3"
                          onClick={() => console.log('Edit product:', product.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-red-600 hover:text-red-700"
                          onClick={() => console.log('Delete product:', product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ScrollToTopButton - 일관된 스크롤 동작 */}
      <ScrollToTopButton />
    </div>
  );
}
