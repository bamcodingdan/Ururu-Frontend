'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { FormField } from '@/components/form/FormField';
import { FORM_STYLES } from '@/constants/form-styles';
import Image from 'next/image';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ImageUploadField, DatePickerField, DiscountTierCard } from './common';
import { useImageValidation } from '@/hooks/seller/useImageValidation';
import { fetchGroupBuyCreateData } from '@/services/groupbuyService';
import type {
  GroupBuyProduct as ApiGroupBuyProduct,
  GroupBuyProductOption,
} from '@/types/groupbuy';

interface DiscountTier {
  id: string;
  minParticipants: number;
  discountRate: number;
}

interface GroupBuyFormProduct {
  id: string;
  productId: string;
  selectedOptions: string[];
  maxQuantityPerPerson: number;
}

interface GroupBuyFormData {
  products: GroupBuyFormProduct[];
  title: string;
  description: string;
  mainImage: File | null;
  startDate: Date | undefined;
  endDate: Date | undefined;
  detailImages: File[];
  discountTiers: DiscountTier[];
}

// OptionSelector: 공구 등록에서 옵션 선택만 하는 체크박스 UI
function OptionSelector({
  options,
  selectedOptions,
  onToggle,
  onOptionDataChange,
  optionData,
}: {
  options: GroupBuyProductOption[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
  onOptionDataChange: (optionId: number, field: 'stock' | 'priceOverride', value: number) => void;
  optionData: Record<number, { stock: number; priceOverride: number }>;
}) {
  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const isSelected = selectedOptions.includes(option.optionName);

        return (
          <Card
            key={`${option.optionId}-${option.optionName}-${index}`}
            className={`flex w-full cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'bg-primary-50 border-primary-300' : 'border-bg-300 bg-bg-100'
            }`}
            onClick={() => onToggle(option.optionName)}
          >
            <CardContent className="flex w-full gap-4 p-4">
              {/* 체크박스 */}
              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(option.optionName)}
                  className={FORM_STYLES.checkbox.base}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* 옵션 이미지 */}
              <div className="relative h-[108px] w-[108px] flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={
                    option.optionUrl !== '/images/default-product-option.jpg'
                      ? option.optionUrl
                      : '/placeholder-product.jpg'
                  }
                  alt={option.optionName}
                  fill
                  className="object-cover"
                  sizes="108px"
                />
              </div>

              {/* 옵션 정보 */}
              <div className="flex flex-1 flex-col gap-2">
                {/* 옵션명 */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-text-100 md:text-base">
                    {option.optionName}
                  </span>
                </div>

                {/* 재고와 공동구매 시작가 입력 - 항상 표시하되 선택되지 않은 경우 비활성화 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs ${isSelected ? 'text-text-200' : 'text-text-300'}`}>
                      공동구매 시작가 *
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={optionData[option.optionId]?.priceOverride || ''}
                      className={`${FORM_STYLES.input.base} ${!isSelected ? 'cursor-not-allowed bg-bg-200 text-text-300' : ''}`}
                      min="0"
                      disabled={!isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          onOptionDataChange(
                            option.optionId,
                            'priceOverride',
                            Number(e.target.value),
                          );
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className={`text-xs ${isSelected ? 'text-text-200' : 'text-text-300'}`}>
                      재고 *
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={optionData[option.optionId]?.stock || ''}
                      className={`${FORM_STYLES.input.base} ${!isSelected ? 'cursor-not-allowed bg-bg-200 text-text-300' : ''}`}
                      min="0"
                      disabled={!isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          onOptionDataChange(option.optionId, 'stock', Number(e.target.value));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function GroupBuyRegistration() {
  // API 데이터 상태
  const [products, setProducts] = useState<ApiGroupBuyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 상품 1개만 선택
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [optionData, setOptionData] = useState<
    Record<number, { stock: number; priceOverride: number }>
  >({});
  const [maxQuantityPerPerson, setMaxQuantityPerPerson] = useState(1);
  const [formData, setFormData] = useState<Omit<GroupBuyFormData, 'products' | 'discountTiers'>>({
    title: '',
    description: '',
    mainImage: null,
    startDate: undefined,
    endDate: undefined,
    detailImages: [],
  });
  const [discountTiers, setDiscountTiers] = useState<DiscountTier[]>([]);

  const selectedProduct = products.find((p) => p.productId.toString() === selectedProductId);
  const { validateImageFile, validateMultipleFiles } = useImageValidation();

  // API 데이터 로드
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchGroupBuyCreateData();
        setProducts(response.data.products);
      } catch (err: any) {
        setError(err.message || '상품 데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option],
    );
  };

  const handleOptionDataChange = (
    optionId: number,
    field: 'stock' | 'priceOverride',
    value: number,
  ) => {
    setOptionData((prev) => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        [field]: value,
      },
    }));
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      alert(error);
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({ ...prev, mainImage: file }));
  };

  const handleDetailImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const { errors, validFiles } = validateMultipleFiles(files, formData.detailImages.length);

    if (errors.length > 0) {
      alert(errors.join('\n'));
      e.target.value = '';
      return;
    }

    setFormData((prev) => ({
      ...prev,
      detailImages: [...prev.detailImages, ...validFiles],
    }));
  };

  const removeDetailImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detailImages: prev.detailImages.filter((_, i) => i !== index),
    }));
  };

  const addDiscountTier = () => {
    const newTier: DiscountTier = {
      id: Date.now().toString(),
      minParticipants: 0,
      discountRate: 0,
    };
    setDiscountTiers((prev) => [...prev, newTier]);
  };

  const removeDiscountTier = (tierId: string) => {
    setDiscountTiers((prev) => prev.filter((tier) => tier.id !== tierId));
  };

  const updateDiscountTier = (tierId: string, field: keyof DiscountTier, value: number) => {
    setDiscountTiers((prev) =>
      prev.map((tier) => (tier.id === tierId ? { ...tier, [field]: value } : tier)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 등록 데이터 구조 예시
    const submitData = {
      ...formData,
      productId: selectedProductId,
      selectedOptions,
      maxQuantityPerPerson,
      discountTiers,
    };
    console.log('공구 등록:', submitData);
    // TODO: API 호출
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
        <div className="text-center">상품 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
        <div className="text-center text-red-500">오류: {error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
      {/* 타이틀 */}
      <h1 className="mb-10 text-center text-3xl font-semibold text-text-100">공구 등록</h1>

      {/* 알림 배너 */}
      <div className="mb-8 flex items-start gap-3 rounded-lg bg-bg-100 p-6 shadow-sm">
        <Image
          src="/ururu-gradient.svg"
          alt="우르르"
          width={24}
          height={24}
          className="h-6 w-6 flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-text-200">
            새로운 상품을 등록하여 공동구매를 시작하세요!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-16">
        {/* 상품 선택 */}
        <section>
          <SectionHeader title="상품 선택" description="공동구매를 진행할 상품을 선택해주세요" />
          <div className="mt-8 space-y-8">
            <FormField label="등록된 상품 선택" required>
              <Select
                value={selectedProductId}
                onValueChange={(value) => {
                  setSelectedProductId(value);
                  setSelectedOptions([]); // 상품 바뀌면 옵션 초기화
                }}
              >
                <SelectTrigger className="h-12 rounded-lg border-bg-300 bg-bg-100 px-4 text-left text-sm text-text-100 placeholder:text-text-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300">
                  <SelectValue placeholder="상품을 선택해주세요" />
                </SelectTrigger>
                <SelectContent className="z-[80] max-h-60 bg-bg-100">
                  {products.map((product) => (
                    <SelectItem
                      key={product.productId}
                      value={product.productId.toString()}
                      className="cursor-pointer text-text-100 hover:bg-primary-100 hover:text-primary-300 focus:bg-primary-100 focus:text-primary-300"
                    >
                      {product.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {selectedProduct && (
              <FormField label="상품 옵션 선택" required>
                <OptionSelector
                  options={selectedProduct.options}
                  selectedOptions={selectedOptions}
                  onToggle={handleOptionToggle}
                  onOptionDataChange={handleOptionDataChange}
                  optionData={optionData}
                />
              </FormField>
            )}

            <FormField label="1인당 최대 구매 수량" required>
              <Input
                type="number"
                value={maxQuantityPerPerson}
                onChange={(e) => setMaxQuantityPerPerson(Number(e.target.value))}
                placeholder="1"
                className={FORM_STYLES.input.base}
                min="1"
                required
              />
            </FormField>
          </div>
        </section>

        {/* 공구 기본 정보 */}
        <section>
          <SectionHeader title="공구 기본 정보" description="공구의 기본 정보를 입력해주세요" />
          <div className="mt-8 space-y-6">
            <FormField
              label="공구 제목"
              required
              characterCount={{ current: formData.title.length, max: 100 }}
            >
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="EX) 수분 진정 토너 공동구매"
                className={FORM_STYLES.input.base}
                maxLength={100}
                required
              />
            </FormField>

            <FormField
              label="공구 설명"
              required
              characterCount={{ current: formData.description.length, max: 1000 }}
            >
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="공구에 대한 상세한 설명을 입력해주세요"
                className={FORM_STYLES.textarea.base}
                rows={4}
                maxLength={1000}
                required
              />
            </FormField>

            <ImageUploadField
              label="대표 이미지 업로드"
              required
              placeholder="대표 이미지를 업로드하세요"
              uploadedFiles={formData.mainImage ? [formData.mainImage] : []}
              onUpload={handleMainImageUpload}
              id="main-image-upload"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DatePickerField
                label="시작일"
                required
                value={formData.startDate}
                onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                placeholder="시작일 선택"
                disabled={(date) => date < new Date()}
              />
              <DatePickerField
                label="종료일"
                required
                value={formData.endDate}
                onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                placeholder="종료일 선택"
                disabled={(date) =>
                  date < new Date() || (formData.startDate ? date < formData.startDate : false)
                }
              />
            </div>
          </div>
        </section>

        {/* 상세 페이지 */}
        <section>
          <SectionHeader title="상세 페이지" description="상세 이미지를 등록해주세요" />
          <div className="mt-8">
            <ImageUploadField
              label="상세 이미지 업로드"
              multiple
              placeholder="상세 이미지를 업로드하세요"
              uploadedFiles={formData.detailImages}
              onUpload={handleDetailImageUpload}
              onRemove={removeDetailImage}
              id="detail-images-upload"
            />
          </div>
        </section>

        {/* 할인 단계 설정 */}
        <section>
          <SectionHeader
            title="할인 단계 설정"
            description="참여 인원에 따른 할인 단계를 설정해주세요"
          />
          <div className="mt-8 space-y-6">
            {discountTiers.map((tier, index) => (
              <DiscountTierCard
                key={tier.id}
                tier={tier}
                index={index}
                onRemove={removeDiscountTier}
                onUpdate={updateDiscountTier}
              />
            ))}
            <Button
              type="button"
              onClick={addDiscountTier}
              className={FORM_STYLES.button.pinkOutline + ' mt-2 h-12 w-full'}
            >
              할인 단계 추가하기
            </Button>
          </div>
        </section>

        {/* 등록 버튼 */}
        <div className="pt-8">
          <Button
            type="submit"
            className="h-12 w-full rounded-lg bg-primary-300 text-sm font-medium text-text-on transition hover:opacity-80 focus:ring-primary-300 active:opacity-90"
          >
            등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}
