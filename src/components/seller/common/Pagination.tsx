import { Button } from '@/components/ui/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPageButtons?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 10,
  className = '',
}: PaginationProps) {
  const pageCount = Math.min(maxPageButtons, totalPages);
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="h-10 w-10 rounded-lg border border-primary-300 bg-bg-100 px-0 font-semibold text-primary-300 transition-colors hover:bg-primary-100"
        aria-label="이전 페이지"
      >
        <ChevronsLeft className="h-5 w-5" />
      </Button>
      {Array.from({ length: pageCount }).map((_, idx) => (
        <Button
          key={idx}
          onClick={() => onPageChange(idx)}
          className={
            'h-10 w-10 rounded-lg border px-0 font-semibold transition-colors ' +
            (currentPage === idx
              ? 'border-primary-300 bg-primary-300 text-text-on'
              : 'border-primary-300 bg-bg-100 text-primary-300 hover:bg-primary-100')
          }
        >
          {idx + 1}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="h-10 w-10 rounded-lg border border-primary-300 bg-bg-100 px-0 font-semibold text-primary-300 transition-colors hover:bg-primary-100"
        aria-label="다음 페이지"
      >
        <ChevronsRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
