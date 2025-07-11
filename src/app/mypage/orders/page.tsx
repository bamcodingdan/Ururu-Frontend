'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OrderStatusTabs, OrderCard } from '@/components/orders';
import { EmptyState, PageHeader } from '@/components/common';
import { orderStatusSummary, mockOrders } from '@/data/orders';
import { OrderStatusFilter } from '@/types/order';
import { useAuthStore } from '@/store';

export default function OrdersPage() {
  const { isAuthenticated, isLoading, isCheckingAuth } = useAuthStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<OrderStatusFilter>('all');
  const hasRedirected = useRef(false);

  // failed 상태 주문 제외하고 필터링
  const filteredOrders = useMemo(() => {
    const validOrders = mockOrders.filter((order) => order.status !== 'failed');

    if (activeFilter === 'all') {
      return validOrders;
    }

    return validOrders.filter((order) => order.status === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (!isLoading && !isCheckingAuth && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, isCheckingAuth, router]);

  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col gap-6 py-4 md:py-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-text-200">로딩 중...</div>
        </div>
      </div>
    );
  }

  const handleFilterChange = (filter: OrderStatusFilter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 py-4 md:py-6">
      {/* 페이지 헤더 */}
      <PageHeader title="주문/배송 조회" />

      {/* 통계 정보 */}
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex justify-center gap-4 md:gap-16">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-text-100 md:text-4xl">
              {orderStatusSummary.inProgress}
            </span>
            <span className="mt-2 whitespace-nowrap text-center text-sm font-medium text-text-200 md:text-lg">
              공구 진행중
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-text-100 md:text-4xl">
              {orderStatusSummary.confirmed}
            </span>
            <span className="mt-2 whitespace-nowrap text-center text-sm font-medium text-text-200 md:text-lg">
              공구 확정
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-text-100 md:text-4xl">
              {orderStatusSummary.refundPending}
            </span>
            <span className="mt-2 whitespace-nowrap text-center text-sm font-medium text-text-200 md:text-lg">
              환불 대기중
            </span>
          </div>
        </div>
      </div>

      {/* 상태별 필터 탭 */}
      <OrderStatusTabs
        summary={orderStatusSummary}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* 주문 내역 리스트 */}
      <div className="space-y-12">
        {filteredOrders.length === 0 ? (
          <EmptyState title="주문 내역이 없습니다." description="첫 주문을 시작해보세요!" />
        ) : (
          filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
