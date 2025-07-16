import React from 'react';
import type { Product, SelectedOption } from '@/types/product';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FORM_STYLES } from '@/constants/form-styles';

interface OptionSelectProps {
  product: Product;
  onSelect: (value: string) => void;
  className?: string;
  placeholder?: string;
  selectedOptions?: SelectedOption[];
}

export const OptionSelect = ({
  product,
  onSelect,
  className = '',
  placeholder = '옵션을 선택해주세요',
  selectedOptions = [],
}: OptionSelectProps) => {
  const allOptionsSelected = selectedOptions.length === product.options.length;
  const currentPlaceholder = allOptionsSelected ? '모든 옵션이 선택되었습니다' : placeholder;

  // 디버깅을 위한 로그
  console.log('OptionSelect - Product options:', product.options);
  console.log('OptionSelect - Selected options:', selectedOptions);
  console.log('OptionSelect - All options selected:', allOptionsSelected);

  // 옵션이 없는 경우 처리
  if (!product.options || product.options.length === 0) {
    return (
      <div className={className}>
        <div className={`${FORM_STYLES.input.base} cursor-not-allowed px-6 text-left opacity-60`}>
          <span className="text-text-300">옵션이 없습니다</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Select onValueChange={onSelect} disabled={allOptionsSelected}>
        <SelectTrigger
          className={`${FORM_STYLES.input.base} px-6 text-left ${
            allOptionsSelected ? 'cursor-not-allowed opacity-60' : ''
          }`}
        >
          <SelectValue placeholder={currentPlaceholder} />
        </SelectTrigger>
        <SelectContent className="z-[80] max-h-60 bg-bg-100">
          {product.options.map((option) => {
            const isSelected = selectedOptions.some((selected) => selected.value === option.id);
            return (
              <SelectItem
                key={option.id}
                value={option.id}
                disabled={isSelected}
                className={`text-sm ${
                  isSelected
                    ? 'cursor-not-allowed text-text-300 line-through'
                    : 'cursor-pointer text-text-100 hover:bg-primary-100 hover:text-primary-300 focus:bg-primary-100 focus:text-primary-300'
                }`}
              >
                <div className="flex flex-col">
                  <span>{option.name}</span>
                  <span className="text-xs text-text-300">{option.price.toLocaleString()}원</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
