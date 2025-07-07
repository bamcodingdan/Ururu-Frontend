'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Eye, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  image: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: '김철수',
    productName: '수분 진정 토너',
    image: '/placeholder-product.jpg',
    quantity: 2,
    totalAmount: 30000,
    status: 'confirmed',
    orderDate: '2024-01-15',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: '이영희',
    productName: '비타민C 세럼',
    image: '/placeholder-product.jpg',
    quantity: 1,
    totalAmount: 28000,
    status: 'shipping',
    orderDate: '2024-01-14',
    deliveryDate: '2024-01-18',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: '박민수',
    productName: '클렌징 폼',
    image: '/placeholder-product.jpg',
    quantity: 3,
    totalAmount: 36000,
    status: 'delivered',
    orderDate: '2024-01-13',
    deliveryDate: '2024-01-16',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: '최지영',
    productName: '수분 진정 토너',
    image: '/placeholder-product.jpg',
    quantity: 1,
    totalAmount: 15000,
    status: 'pending',
    orderDate: '2024-01-16',
  },
];

function OrderCard({ order }: { order: Order }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'shipping':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '주문 대기';
      case 'confirmed':
        return '주문 확정';
      case 'shipping':
        return '배송중';
      case 'delivered':
        return '배송 완료';
      case 'cancelled':
        return '주문 취소';
      default:
        return '알 수 없음';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipping':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-bg-300 bg-bg-100">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
              src={order.image}
              alt={order.productName}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-100">{order.orderNumber}</h3>
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="text-sm text-text-200">{order.customerName}</p>
                <p className="text-sm font-medium text-text-100">{order.productName}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-200">수량</span>
                <span className="text-text-100">{order.quantity}개</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-200">주문 금액</span>
                <span className="font-semibold text-text-100">
                  ₩{order.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-200">주문일</span>
                <span className="text-text-100">{order.orderDate}</span>
              </div>
              {order.deliveryDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-200">배송일</span>
                  <span className="text-text-100">{order.deliveryDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderManagement() {
  return (
    <div className="space-y-6 p-6">
    </div>
  );
}
