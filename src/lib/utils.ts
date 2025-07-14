import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 포인트 관련 변환 함수들
import {
  PointTransactionResponse,
  PointHistoryItem,
  GroupedPointHistory,
  PointHistoryType,
} from '@/types/point';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// source를 한국어로 변환
function getSourceLabel(source: string): string {
  const sourceMap: Record<string, string> = {
    GROUPBUY: '공동 구매',
    REVIEW: '리뷰',
    INVITE: '초대',
    ADMIN: '관리자',
    REFUND: '환불',
  };
  return sourceMap[source] || source;
}

// API 타입을 UI 타입으로 변환
export function convertPointTransaction(transaction: PointTransactionResponse): PointHistoryItem {
  const sourceLabel = getSourceLabel(transaction.source);
  const typeLabel = transaction.type === 'USED' ? '사용' : '적립';

  return {
    id: transaction.id.toString(),
    date: new Date(transaction.createdAt)
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.')
      .replace(/\.$/, ''),
    type: typeLabel as PointHistoryType,
    title: `${sourceLabel} ${typeLabel}`,
    description: transaction.reason,
    amount: transaction.type === 'USED' ? -transaction.amount : transaction.amount,
  };
}

// 포인트 내역을 날짜별로 그룹핑
export function groupPointHistoryByDate(
  transactions: PointTransactionResponse[],
): GroupedPointHistory[] {
  const grouped = transactions.reduce(
    (acc, transaction) => {
      const item = convertPointTransaction(transaction);
      const date = item.date;

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, PointHistoryItem[]>,
  );

  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a)) // 최신 날짜 먼저
    .map(([date, items]) => ({ date, items }));
}
