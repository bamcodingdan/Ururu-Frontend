import React from 'react';
import { Clock, CheckCircle, XCircle, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status:
    | 'in_progress'
    | 'confirmed'
    | 'failed'
    | 'INITIATED'
    | 'APPROVED'
    | 'REJECTED'
    | 'COMPLETED'
    | 'FAILED';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  let icon, text, bg, textColor;

  // 기존 공구 상태
  if (status === 'in_progress') {
    icon = <Clock className="mr-1 h-4 w-4 text-primary-300" />;
    text = '공구 진행중';
    bg = 'bg-primary-100';
    textColor = 'text-primary-300';
  } else if (status === 'confirmed') {
    icon = <CheckCircle className="mr-1 h-4 w-4 text-primary-300" />;
    text = '공구 확정';
    bg = 'bg-primary-100';
    textColor = 'text-primary-300';
  } else if (status === 'failed') {
    icon = <XCircle className="mr-1 h-4 w-4 text-text-300" />;
    text = '공구 실패';
    bg = 'bg-bg-200';
    textColor = 'text-text-300';
  }
  // 환불 상태
  else if (status === 'INITIATED') {
    icon = <Clock className="mr-1 h-4 w-4 text-primary-300" />;
    text = '신청됨';
    bg = 'bg-primary-100';
    textColor = 'text-primary-300';
  } else if (status === 'APPROVED') {
    icon = <CheckCircle className="mr-1 h-4 w-4 text-primary-300" />;
    text = '승인됨';
    bg = 'bg-primary-100';
    textColor = 'text-primary-300';
  } else if (status === 'REJECTED') {
    icon = <Ban className="mr-1 h-4 w-4 text-text-300" />;
    text = '거부됨';
    bg = 'bg-bg-200';
    textColor = 'text-text-300';
  } else if (status === 'COMPLETED') {
    icon = <CheckCircle className="mr-1 h-4 w-4 text-primary-300" />;
    text = '완료됨';
    bg = 'bg-primary-100';
    textColor = 'text-primary-300';
  } else if (status === 'FAILED') {
    icon = <XCircle className="mr-1 h-4 w-4 text-text-300" />;
    text = '실패';
    bg = 'bg-bg-200';
    textColor = 'text-text-300';
  }

  return (
    <span
      className={`flex items-center rounded-lg px-3 py-1.5 text-xs font-medium ${bg} ${textColor} ${className}`}
    >
      {icon}
      {text}
    </span>
  );
}
