'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';

interface PointUsageProps {
  availablePoint: number;
  pointAmount: number;
  onPointAmountChange: (amount: number) => void;
  onUseAllPoints: () => void;
}

export function PointUsage({
  availablePoint,
  pointAmount,
  onPointAmountChange,
  onUseAllPoints,
}: PointUsageProps) {
  return (
    <div className="space-y-4">
      {/* 보유 포인트 안내 */}
      <p className="text-base text-text-100">
        <span className="font-semibold text-primary-100">
          우르르 포인트 {availablePoint.toLocaleString()}P
        </span>
      </p>

      {/* 포인트 입력 */}
      <div className="flex gap-3">
        <FormField label="포인트 입력" className="flex-1">
          <Input
            type="number"
            placeholder="0P"
            value={pointAmount}
            onChange={(e) => onPointAmountChange(Number(e.target.value) || 0)}
            className="text-right"
          />
        </FormField>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onUseAllPoints}
            className="hover:bg-primary-50 border-primary-100 text-primary-100"
          >
            전액 사용
          </Button>
        </div>
      </div>
    </div>
  );
}
