'use client';

import React, { useState, useMemo } from 'react';
import { RefundStatusTabs, RefundCard } from '@/components/refunds';
import { refundStatusSummary, mockRefunds } from '@/data/refunds';
import { RefundStatusFilter, Refund } from '@/types/refund';

export default function RefundsPage() {
  const [activeFilter, setActiveFilter] = useState<RefundStatusFilter>('all');

  const filteredRefunds = useMemo(() => {
    if (activeFilter === 'all') {
      return mockRefunds;
    }
    return mockRefunds.filter((refund: Refund) => refund.status === activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filter: RefundStatusFilter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 py-4 md:py-6">
      {/* 페이지 헤더 */}
      <div className="mb-2">
        <h1 className="text-center text-2xl font-semibold text-text-100">취소/환불 내역</h1>
      </div>

      {/* 상태별 필터 탭 */}
      <RefundStatusTabs
        summary={refundStatusSummary}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* 취소/환불 내역 리스트 */}
      <div className="space-y-4">
        {filteredRefunds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-lg font-medium text-text-200">취소/환불 내역이 없습니다.</div>
            <div className="text-sm text-text-200">안전한 쇼핑을 도와드려요!</div>
          </div>
        ) : (
          filteredRefunds.map((refund: Refund) => <RefundCard key={refund.id} refund={refund} />)
        )}
      </div>
    </div>
  );
}
