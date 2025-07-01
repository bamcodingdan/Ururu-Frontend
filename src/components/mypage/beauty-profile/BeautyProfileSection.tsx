import React from 'react';
import { SelectableButton } from '@/components/ui/selectable-button';

interface BeautyProfileSectionProps {
  title: string;
  options: readonly { readonly label: string; readonly value: string }[];
  selectedValues: string | string[];
  isMultiple?: boolean;
  isDisabled?: boolean;
  description?: string;
  layout?: 'grid' | 'flex';
}

export function BeautyProfileSection({
  title,
  options,
  selectedValues,
  isMultiple = false,
  isDisabled = true,
  description,
  layout = 'grid',
}: BeautyProfileSectionProps) {
  const isSelected = (value: string) => {
    if (isMultiple) {
      return Array.isArray(selectedValues) && selectedValues.includes(value);
    }
    return selectedValues === value;
  };

  const renderOptions = () => {
    const containerClass =
      layout === 'flex' ? 'flex gap-2' : 'grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4';

    return (
      <div className={containerClass}>
        {options.map((option) => (
          <SelectableButton
            key={option.value}
            value={option.value}
            label={option.label}
            isSelected={isSelected(option.value)}
            isDisabled={isDisabled}
            onClick={() => {}}
            className={layout === 'flex' ? 'min-w-0 flex-1' : ''}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text-100">{title}</h2>
      {description && <p className="text-sm text-text-200">{description}</p>}
      {renderOptions()}
    </div>
  );
}
