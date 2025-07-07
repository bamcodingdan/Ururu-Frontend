'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Play, Pause, Eye, Edit, Users, Calendar, Target } from 'lucide-react';
import Image from 'next/image';

interface GroupBuy {
  id: string;
  productName: string;
  image: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  currentParticipants: number;
  targetParticipants: number;
  startDate: string;
  endDate: string;
  progress: number;
  revenue: number;
}

const mockGroupBuys: GroupBuy[] = [
  {
    id: '1',
    productName: '수분 진정 토너',
    image: '/placeholder-product.jpg',
    status: 'active',
    currentParticipants: 45,
    targetParticipants: 50,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    progress: 90,
    revenue: 675000,
  },
  {
    id: '2',
    productName: '비타민C 세럼',
    image: '/placeholder-product.jpg',
    status: 'completed',
    currentParticipants: 40,
    targetParticipants: 40,
    startDate: '2024-01-10',
    endDate: '2024-02-10',
    progress: 100,
    revenue: 1120000,
  },
  {
    id: '3',
    productName: '클렌징 폼',
    image: '/placeholder-product.jpg',
    status: 'paused',
    currentParticipants: 15,
    targetParticipants: 30,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    progress: 50,
    revenue: 180000,
  },
];

function GroupBuyCard({ groupBuy }: { groupBuy: GroupBuy }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '진행중';
      case 'paused':
        return '일시정지';
      case 'completed':
        return '완료';
      case 'draft':
        return '임시저장';
      default:
        return '알 수 없음';
    }
  };

  return (
    <Card className="border-bg-300 bg-bg-100">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image
              src={groupBuy.image}
              alt={groupBuy.productName}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-text-100">{groupBuy.productName}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(groupBuy.status)}`}
                  >
                    {getStatusText(groupBuy.status)}
                  </span>
                  <span className="text-sm text-text-200">
                    ₩{groupBuy.revenue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                {groupBuy.status === 'active' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                {groupBuy.status === 'paused' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-text-200" />
                  <span className="text-text-200">참여자</span>
                </div>
                <span className="text-text-100">
                  {groupBuy.currentParticipants}/{groupBuy.targetParticipants}명
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-bg-200">
                <div
                  className="h-2 rounded-full bg-primary-300 transition-all"
                  style={{ width: `${Math.min(groupBuy.progress, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-text-200" />
                  <span className="text-text-200">기간</span>
                </div>
                <span className="text-text-100">
                  {groupBuy.startDate} ~ {groupBuy.endDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GroupBuyManagement() {
  return (
    <div className="space-y-6 p-6">
    </div>
  );
}
