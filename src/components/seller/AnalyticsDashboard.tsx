'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Package,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, isPositive, icon }: StatCardProps) {
  return (
    <Card className="border-bg-300 bg-bg-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-200">{title}</p>
            <p className="text-2xl font-bold text-text-100">{value}</p>
            <div className="mt-1 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
              >
                {change}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-primary-100 p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  participants: number;
  conversionRate: number;
  avgOrderValue: number;
}

const mockProductPerformance: ProductPerformance[] = [
  {
    id: '1',
    name: '수분 진정 토너',
    revenue: 675000,
    participants: 45,
    conversionRate: 85,
    avgOrderValue: 15000,
  },
  {
    id: '2',
    name: '비타민C 세럼',
    revenue: 896000,
    participants: 32,
    conversionRate: 78,
    avgOrderValue: 28000,
  },
  {
    id: '3',
    name: '클렌징 폼',
    revenue: 360000,
    participants: 30,
    conversionRate: 92,
    avgOrderValue: 12000,
  },
];

function ProductPerformanceTable() {
  return (
    <Card className="border-bg-300 bg-bg-100">
      <CardHeader>
        <CardTitle className="text-text-100">상품별 성과</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-300">
                <th className="px-4 py-3 text-left text-sm font-medium text-text-200">상품명</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-200">매출</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-200">참여자</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-200">전환율</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-200">
                  평균 주문액
                </th>
              </tr>
            </thead>
            <tbody>
              {mockProductPerformance.map((product) => (
                <tr key={product.id} className="border-b border-bg-200">
                  <td className="px-4 py-3 text-sm text-text-100">{product.name}</td>
                  <td className="px-4 py-3 text-right text-sm text-text-100">
                    ₩{product.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-text-100">
                    {product.participants}명
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-text-100">
                    {product.conversionRate}%
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-text-100">
                    ₩{product.avgOrderValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6 p-6">
    </div>
  );
}
