'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  status: 'active' | 'inactive' | 'draft';
  category: string;
  createdAt: string;
  participants: number;
  targetParticipants: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: '수분 진정 토너',
    image: '/placeholder-product.jpg',
    price: 15000,
    originalPrice: 25000,
    status: 'active',
    category: '스킨케어',
    createdAt: '2024-01-15',
    participants: 45,
    targetParticipants: 50,
  },
  {
    id: '2',
    name: '비타민C 세럼',
    image: '/placeholder-product.jpg',
    price: 28000,
    originalPrice: 45000,
    status: 'active',
    category: '스킨케어',
    createdAt: '2024-01-10',
    participants: 32,
    targetParticipants: 40,
  },
  {
    id: '3',
    name: '클렌징 폼',
    image: '/placeholder-product.jpg',
    price: 12000,
    originalPrice: 20000,
    status: 'draft',
    category: '클렌징',
    createdAt: '2024-01-20',
    participants: 0,
    targetParticipants: 30,
  },
];

function ProductCard({ product }: { product: Product }) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-red-100 text-red-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '진행중';
      case 'inactive':
        return '비활성';
      case 'draft':
        return '임시저장';
      default:
        return '알 수 없음';
    }
  };

  const progress = (product.participants / product.targetParticipants) * 100;

  return (
    <Card className="border-bg-300 bg-bg-100">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-text-100">{product.name}</h3>
                <p className="text-sm text-text-200">{product.category}</p>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowActions(!showActions)}
                  className="h-8 w-8"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>

                {showActions && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-bg-300 bg-bg-100 shadow-lg">
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg-200">
                      <Eye className="h-4 w-4" />
                      보기
                    </button>
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-bg-200">
                      <Edit className="h-4 w-4" />
                      수정
                    </button>
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-bg-200">
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 flex items-center gap-4">
              <span className="text-lg font-bold text-primary-300">
                ₩{product.price.toLocaleString()}
              </span>
              <span className="text-sm text-text-300 line-through">
                ₩{product.originalPrice.toLocaleString()}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(product.status)}`}
              >
                {getStatusText(product.status)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-200">참여자</span>
                <span className="text-text-100">
                  {product.participants}/{product.targetParticipants}명
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-bg-200">
                <div
                  className="h-2 rounded-full bg-primary-300 transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductManagement() {
  return (
    <div className="space-y-6 p-6">
    </div>
  );
}
