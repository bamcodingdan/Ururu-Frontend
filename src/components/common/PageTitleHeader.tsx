import React from 'react';

interface PageTitleHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageTitleHeader({ title, description, className = '' }: PageTitleHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="mb-4 text-2xl font-semibold text-text-100 md:text-3xl">{title}</h1>
      {description && <p className="text-sm text-text-200 md:text-base">{description}</p>}
    </div>
  );
}
