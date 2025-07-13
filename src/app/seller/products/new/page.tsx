'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ProductRegistration } from '@/components/seller/ProductRegistration';
import { ProductService } from '@/services/productService';
import type { Category, Tag } from '@/types/product';

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMetadata = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ProductService.getProductMetadata();
        setCategories(data.categories);
        setTags(data.tags);
      } catch (err: any) {
        if (
          (typeof err.status === 'number' && err.status === 403) ||
          (typeof err.message === 'string' && err.message.includes('status: 403'))
        ) {
          router.replace(`/login?redirect=/seller/products/new`);
        } else {
          setError(err.message || '상품 메타데이터 조회에 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, [router]);

  if (isLoading) {
    return <div className="py-20 text-center text-gray-400">상품 등록 정보를 불러오는 중...</div>;
  }
  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }
  return <ProductRegistration categories={categories} tags={tags} />;
}
