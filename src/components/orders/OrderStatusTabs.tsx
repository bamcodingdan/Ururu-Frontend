'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { OrderStatusSummary, OrderStatusFilter } from '@/types/order';
import { useDropdown } from '@/hooks';
import { FORM_STYLES } from '@/constants/form-styles';

interface OrderStatusTabsProps {
  summary: OrderStatusSummary;
  activeFilter: OrderStatusFilter;
  onFilterChange: (filter: OrderStatusFilter) => void;
}

export function OrderStatusTabs({ summary, activeFilter, onFilterChange }: OrderStatusTabsProps) {
  const { isOpen: isDropdownOpen, dropdownRef, toggle, close } = useDropdown();

  const tabs = [
    {
      value: 'all' as const,
      label: '전체',
      count: summary.inProgress + summary.confirmed + summary.refundPending, // failed 제외
    },
    { value: 'in_progress' as const, label: '공구 등록', count: summary.inProgress },
    { value: 'confirmed' as const, label: '공구 확정', count: summary.confirmed },
    { value: 'refund_pending' as const, label: '환불 대기중', count: summary.refundPending },
  ];

  const selectedTab = tabs.find((tab) => tab.value === activeFilter);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggle}
        className={`flex items-center gap-2 rounded-lg border border-bg-300 bg-bg-100 px-3 py-2 text-sm font-medium text-text-100 transition-colors ${FORM_STYLES.hover.bg200}`}
      >
        <span>{selectedTab?.label || '전체'}</span>
        <span className="rounded-full bg-bg-300 px-1.5 py-0.5 text-xs text-text-200">
          {selectedTab?.count || 0}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-bg-300 bg-bg-100 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                onFilterChange(tab.value);
                close();
              }}
              className={`block w-full px-4 py-2 text-left text-sm text-text-100 first:rounded-t-lg last:rounded-b-lg ${FORM_STYLES.hover.bg200}`}
            >
              <div className="flex items-center justify-between">
                <span>{tab.label}</span>
                <span className="rounded-full bg-bg-300 px-1.5 py-0.5 text-xs text-text-200">
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
