'use client';

import { useState } from 'react';
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
import { FormField } from '@/components/form/FormField';
import { FORM_STYLES } from '@/constants/form-styles';
import { PRODUCT_CATEGORY_DATA, CAPACITY_UNITS } from '@/data/seller';
import { useFormArray } from '@/hooks/seller/useFormArray';
import { OptionList } from './common/OptionList';
import { SectionHeader } from '@/components/common/SectionHeader';
import type {
  Category,
  Tag,
  CreateProductRequest,
  ProductFormData,
  ProductOption,
  ProductRegistrationProps,
} from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ProductService } from '@/services/productService';
import { SuccessDialog } from '@/components/common/SuccessDialog';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import { validateProductForm } from '@/lib/product/validation';

export function ProductRegistration({ categories, tags }: ProductRegistrationProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    categoryMain: '',
    categoryMiddle: '',
    categorySub: '',
    options: [],
    capacity: '',
    capacityUnit: 'ml',
    specification: '',
    expiryDate: '',
    usage: '',
    manufacturer: '',
    seller: '',
    country: '',
    functionalTest: 'no',
    precautions: '',
    qualityStandard: '',
    customerService: '',
  });

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 옵션 관리 로직을 useFormArray로 대체
  const optionArray = useFormArray<ProductOption>(formData.options);

  // 기존 addOption, removeOption, updateOption, handleImageUpload 대체
  const handleOptionChange = (id: string, field: keyof ProductOption, value: any) => {
    optionArray.update(
      (opt) => opt.id === id,
      (opt) => ({ ...opt, [field]: value }),
    );
  };
  const handleOptionRemove = (id: string) => {
    optionArray.remove((opt) => opt.id === id);
  };
  const handleOptionImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleOptionChange(id, 'image', file);
  };
  const handleAddOption = () => {
    optionArray.add({
      id: Date.now().toString(),
      name: '',
      price: 0,
      image: null,
      fullIngredients: '',
    });
  };

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const handleSuccessDialogClose = () => setSubmitSuccess(false);
  const handleErrorDialogClose = () => setSubmitError(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const validationError = validateProductForm(formData, optionArray, selectedTags);
      if (validationError) {
        setSubmitError(validationError);
        setSubmitLoading(false);
        return;
      }
      // 카테고리 ID 배열 생성 (예시: 마지막 선택된 카테고리까지)
      const categoryIds: number[] = [];
      const findCategoryId = (label: string, cats: Category[]): number | null => {
        for (const cat of cats) {
          if (cat.label === label) return cat.value;
          if (cat.children) {
            const found = findCategoryId(label, cat.children);
            if (found) return found;
          }
        }
        return null;
      };
      if (formData.categoryMain) {
        const id = findCategoryId(formData.categoryMain, categories);
        if (id) categoryIds.push(id);
      }
      if (formData.categoryMiddle) {
        const main = categories.find((c) => c.label === formData.categoryMain);
        if (main && main.children) {
          const id = findCategoryId(formData.categoryMiddle, main.children);
          if (id) categoryIds.push(id);
        }
      }
      if (formData.categorySub) {
        const main = categories.find((c) => c.label === formData.categoryMain);
        const middle = main?.children?.find((c) => c.label === formData.categoryMiddle);
        if (middle && middle.children) {
          const id = findCategoryId(formData.categorySub, middle.children);
          if (id) categoryIds.push(id);
        }
      }
      // 태그 ID 배열
      const tagCategoryIds = selectedTags.map((tag) => tag.value);
      // 옵션
      const productOptions = optionArray.items.map((opt) => ({
        name: opt.name,
        price: opt.price,
        fullIngredients: opt.fullIngredients,
      }));
      // 옵션 이미지
      const optionImages = optionArray.items
        .map((opt) => opt.image)
        .filter((img): img is File => !!img);
      // 상품 공시
      const productNotice = {
        capacity: formData.capacity + (formData.capacityUnit ? `/${formData.capacityUnit}` : ''),
        spec: formData.specification,
        expiry: formData.expiryDate,
        usage: formData.usage,
        manufacturer: formData.manufacturer,
        responsibleSeller: formData.seller,
        countryOfOrigin: formData.country,
        functionalCosmetics: formData.functionalTest === 'yes' ? true : false,
        caution: formData.precautions,
        warranty: formData.qualityStandard,
        customerServiceNumber: formData.customerService,
      };
      const product: CreateProductRequest = {
        name: formData.name,
        description: formData.description,
        categoryIds,
        tagCategoryIds,
        productOptions,
        productNotice,
      };
      await ProductService.createProduct(product, optionImages);
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || '상품 등록에 실패했습니다.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 카테고리/태그 로딩/에러 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 변경 핸들러
  const handleCategoryMainChange = (value: string) => {
    handleInputChange('categoryMain', value);
    handleInputChange('categoryMiddle', '');
    handleInputChange('categorySub', '');
  };

  const handleCategoryMiddleChange = (value: string) => {
    handleInputChange('categoryMiddle', value);
    handleInputChange('categorySub', '');
  };

  const handleCategorySubChange = (value: string) => {
    handleInputChange('categorySub', value);
  };

  // 카테고리 제거 핸들러
  const handleRemoveCategory = (type: 'main' | 'middle' | 'sub') => {
    if (type === 'main') {
      handleInputChange('categoryMain', '');
      handleInputChange('categoryMiddle', '');
      handleInputChange('categorySub', '');
    } else if (type === 'middle') {
      handleInputChange('categoryMiddle', '');
      handleInputChange('categorySub', '');
    } else if (type === 'sub') {
      handleInputChange('categorySub', '');
    }
  };

  // 태그 변경 핸들러
  const handleTagsChange = (newTags: Tag[]) => {
    setSelectedTags(newTags);
  };

  // API 데이터에서 카테고리 가져오기
  const getMainCategories = () => {
    return categories.map((cat: Category) => cat.label);
  };

  const getMiddleCategories = () => {
    if (!formData.categoryMain) return [];
    const mainCategory = categories.find((cat: Category) => cat.label === formData.categoryMain);
    return mainCategory?.children?.map((cat: Category) => cat.label) || [];
  };

  const getSubCategories = () => {
    if (!formData.categoryMiddle) return [];
    const mainCategory = categories.find((cat: Category) => cat.label === formData.categoryMain);
    const middleCategory = mainCategory?.children?.find(
      (cat: Category) => cat.label === formData.categoryMiddle,
    );
    return middleCategory?.children?.map((cat: Category) => cat.label) || [];
  };

  // 태그 비동기 로딩/에러/선택 상태 관리
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [tagLoading, setTagLoading] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTagLoading(true);
    setTagError(null);
    // 비동기 태그 데이터 로딩 (실제 API 연동 시 ProductService.getProductMetadata() 등 사용)
    Promise.resolve(tags)
      .then((data) => setTagList(data))
      .catch((e) => setTagError('태그를 불러오지 못했습니다.'))
      .finally(() => setTagLoading(false));
  }, [tags]);

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) => {
      if (prev.find((t) => t.value === tag.value)) {
        return prev.filter((t) => t.value !== tag.value);
      }
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  };
  const handleTagRemove = (tag: Tag) => {
    setSelectedTags((prev) => prev.filter((t) => t.value !== tag.value));
  };

  // 카테고리 chip 텍스트 생성
  // const categoryChips = [
  //   formData.categoryMain ? { label: formData.categoryMain } : null,
  //   formData.categoryMiddle ? { label: formData.categoryMiddle } : null,
  //   formData.categorySub ? { label: formData.categorySub } : null,
  // ].filter((chip): chip is { label: string } => Boolean(chip));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
      {/* 타이틀 */}
      <h1 className="mb-10 text-center text-3xl font-semibold text-text-100">상품 등록</h1>
      {/* 선택된 카테고리 chip (제거됨) */}
      {/*
      {categoryChips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {categoryChips.map((chip, i) => (
            <Badge key={chip.label} variant="default" className="bg-primary text-white">
              {chip.label}
              {i < categoryChips.length - 1 && <span className="mx-1">&gt;</span>}
            </Badge>
          ))}
        </div>
      )}
      */}
      {/* 선택된 태그 chip (제거됨) */}
      {/*
      {selectedTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.value}
              variant="default"
              className="bg-primary flex items-center gap-1 text-white"
            >
              {tag.label}
              <button
                type="button"
                aria-label="태그 해제"
                onClick={() => handleTagRemove(tag)}
                className="ml-1 focus:outline-none"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}
      */}
      <form onSubmit={handleSubmit} className="space-y-16">
        {/* 상품 기본 정보 */}
        <section>
          <SectionHeader
            title="상품 기본 정보"
            description="판매할 상품의 기본 정보를 입력해주세요"
          />

          <div className="mt-8 space-y-6">
            <FormField label="상품명" required>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="EX) 컬러그램 누디 블러 틴트 20 COLOR"
                className={FORM_STYLES.input.base}
              />
            </FormField>

            <FormField
              label="상품 설명"
              required
              characterCount={{ current: formData.description.length, max: 200 }}
            >
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="EX) 한 번에 터치하고 입술 보정 필터"
                className={FORM_STYLES.textarea.base}
                rows={2}
                maxLength={200}
              />
            </FormField>

            {/* 카테고리 */}
            <FormField label="카테고리" required>
              {isLoading ? (
                <LoadingSkeleton className="h-12 w-full" />
              ) : error ? (
                <div className="text-sm text-red-500">카테고리 정보를 불러오지 못했습니다.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Select value={formData.categoryMain} onValueChange={handleCategoryMainChange}>
                      <SelectTrigger className="h-12 w-1/3 rounded-lg border-bg-300 bg-bg-100 px-4 text-left text-sm text-text-100 placeholder:text-text-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300">
                        <SelectValue placeholder="대분류" />
                      </SelectTrigger>
                      <SelectContent className="z-[80] max-h-60 overflow-auto scroll-smooth bg-bg-100">
                        {getMainCategories().map((category: string) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="cursor-pointer text-text-100 hover:bg-primary-100 hover:text-primary-300 focus:bg-primary-100 focus:text-primary-300"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.categoryMiddle}
                      onValueChange={handleCategoryMiddleChange}
                      disabled={!formData.categoryMain || getMiddleCategories().length === 0}
                    >
                      <SelectTrigger className="h-12 w-1/3 rounded-lg border-bg-300 bg-bg-100 px-4 text-left text-sm text-text-100 placeholder:text-text-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-60">
                        <SelectValue
                          placeholder={
                            formData.categoryMain && getMiddleCategories().length === 0
                              ? '다음 분류가 없습니다.'
                              : '중분류'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="z-[80] max-h-60 overflow-auto scroll-smooth bg-bg-100">
                        {getMiddleCategories().length > 0 &&
                          getMiddleCategories().map((category: string) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="cursor-pointer text-text-100 hover:bg-primary-100 hover:text-primary-300 focus:bg-primary-100 focus:text-primary-300"
                            >
                              {category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.categorySub}
                      onValueChange={handleCategorySubChange}
                      disabled={!formData.categoryMiddle || getSubCategories().length === 0}
                    >
                      <SelectTrigger className="h-12 w-1/3 rounded-lg border-bg-300 bg-bg-100 px-4 text-left text-sm text-text-100 placeholder:text-text-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-60">
                        <SelectValue
                          placeholder={
                            formData.categoryMiddle && getSubCategories().length === 0
                              ? '다음 분류가 없습니다.'
                              : '소분류'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="z-[80] max-h-60 overflow-auto scroll-smooth bg-bg-100">
                        {getSubCategories().length > 0 &&
                          getSubCategories().map((category: string) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="cursor-pointer text-text-100 hover:bg-primary-100 hover:text-primary-300 focus:bg-primary-100 focus:text-primary-300"
                            >
                              {category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* 선택된 카테고리 루트 경로 표시 및 제거 ( > 구분자 사용) (제거됨) */}
                  {/*
                  {(formData.categoryMain || formData.categoryMiddle || formData.categorySub) && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                      <span>선택된 카테고리:</span>
                      {formData.categoryMain && (
                        <span className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1">
                          {formData.categoryMain}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory('main')}
                            className="ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {formData.categoryMiddle && (
                        <>
                          <span className="mx-1">&gt;</span>
                          <span className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1">
                            {formData.categoryMiddle}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory('middle')}
                              className="ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        </>
                      )}
                      {formData.categorySub && (
                        <>
                          <span className="mx-1">&gt;</span>
                          <span className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1">
                            {formData.categorySub}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory('sub')}
                              className="ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                  */}
                </div>
              )}
            </FormField>

            {/* 태그 */}
            <FormField label={`태그 (${selectedTags.length}/3)`} required>
              {isLoading ? (
                <LoadingSkeleton className="h-12 w-full" />
              ) : error ? (
                <div className="text-sm text-red-500">태그 정보를 불러오지 못했습니다.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div
                    className="grid grid-cols-5 gap-2"
                    role="group"
                    aria-label="태그 선택 그리드"
                  >
                    {Array.from({ length: 20 }, (_, i) => tags[i] || null).map((tag, idx) =>
                      tag ? (
                        <button
                          key={tag.value}
                          type="button"
                          className={`h-10 w-full rounded-lg border px-2 text-xs font-medium transition-colors ${
                            selectedTags.some((t) => t.value === tag.value)
                              ? 'border-primary-100 bg-primary-100 text-primary-300 shadow-md'
                              : 'border-bg-300 bg-bg-100 text-text-100 hover:bg-bg-200 hover:text-primary-300'
                          } `}
                          aria-pressed={selectedTags.some((t) => t.value === tag.value)}
                          onClick={() => handleTagToggle(tag)}
                        >
                          <span
                            className={`block w-full truncate text-center ${
                              selectedTags.some((t) => t.value === tag.value)
                                ? 'text-primary-300'
                                : 'text-text-100'
                            }`}
                          >
                            {tag.label}
                          </span>
                        </button>
                      ) : (
                        <div key={idx} />
                      ),
                    )}
                  </div>
                  {/* 선택된 태그 chip - 카테고리 chip과 동일한 형식으로 (제거됨) */}
                  {/*
                  {selectedTags.length > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                      <span>선택된 태그:</span>
                      {selectedTags.map((tag, i) => (
                        <span
                          key={tag.value}
                          className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1"
                        >
                          {tag.label}
                          <button
                            type="button"
                            aria-label="태그 해제"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  */}
                </div>
              )}
            </FormField>
          </div>
        </section>

        {/* 옵션 관리 */}
        <section>
          <SectionHeader
            title="상품 옵션 설정"
            description="판매할 상품의 다양한 옵션을 설정해주세요"
          />

          <div className="mt-8">
            <OptionList
              options={optionArray.items}
              onChange={handleOptionChange}
              onRemove={handleOptionRemove}
              onImageUpload={handleOptionImageUpload}
            />
            <Button
              type="button"
              onClick={handleAddOption}
              className={FORM_STYLES.button.submit + ' mt-4 w-full'}
            >
              옵션 추가하기
            </Button>
          </div>
        </section>

        {/* 화장품 정보제공고시 */}
        <section>
          <SectionHeader
            title="화장품 정보제공고시"
            description="화장품 판매에 따른 필수 정보입니다. 정확하게 입력해주세요."
          />

          <div className="mt-8 space-y-6">
            <div className="flex gap-2">
              <FormField label="내용물의 용량 또는 중량" required className="flex-1">
                <Input
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder=""
                  className={FORM_STYLES.input.base}
                />
              </FormField>
              <FormField label="단위" required className="w-32">
                <Select
                  value={formData.capacityUnit}
                  onValueChange={(value) => handleInputChange('capacityUnit', value)}
                >
                  <SelectTrigger className="h-12 rounded-lg border-bg-300 bg-bg-100 px-4 text-left text-sm text-text-100 placeholder:text-text-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[80] max-h-60 bg-bg-100">
                    {CAPACITY_UNITS.map((unit) => (
                      <SelectItem
                        key={unit}
                        value={unit}
                        className="cursor-pointer text-text-100 hover:bg-primary-100 hover:text-primary-300 focus:bg-primary-100 focus:text-primary-300"
                      >
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="제품 주요 사양" required>
              <Input
                value={formData.specification}
                onChange={(e) => handleInputChange('specification', e.target.value)}
                placeholder="EX) 모든 피부"
                className={FORM_STYLES.input.base}
              />
            </FormField>
            <FormField label="사용기한(또는 개봉 후 사용기간)" required>
              <Input
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                placeholder="EX) 제조일로부터 24개월"
                className={FORM_STYLES.input.base}
              />
            </FormField>
            <FormField label="사용법" required>
              <Textarea
                value={formData.usage}
                onChange={(e) => handleInputChange('usage', e.target.value)}
                placeholder="EX) 적당량의 내용을 손에 덜어 얼굴에 부드럽게 펴 발라줍니다."
                className={FORM_STYLES.textarea.base}
                rows={2}
              />
            </FormField>
            <FormField label="화장품제조업자" required>
              <Input
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                placeholder=""
                className={FORM_STYLES.input.base}
              />
            </FormField>
            <FormField label="화장품책임판매업자" required>
              <Input
                value={formData.seller}
                onChange={(e) => handleInputChange('seller', e.target.value)}
                placeholder=""
                className={FORM_STYLES.input.base}
              />
            </FormField>
            <FormField label="제조국" required>
              <Input
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="대한민국"
                className={FORM_STYLES.input.base}
              />
            </FormField>
            <FormField label="기능성 화장품 식품의약품안전처 심사필 여부" required>
              <div className="mt-2 flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="functionalTest"
                    value="yes"
                    checked={formData.functionalTest === 'yes'}
                    onChange={(e) => handleInputChange('functionalTest', e.target.value)}
                    className="custom-radio"
                  />
                  <span className="text-sm text-text-100">있음</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="functionalTest"
                    value="no"
                    checked={formData.functionalTest === 'no'}
                    onChange={(e) => handleInputChange('functionalTest', e.target.value)}
                    className="custom-radio"
                  />
                  <span className="text-sm text-text-100">없음</span>
                </label>
              </div>
            </FormField>
            <FormField label="사용할 때의 주의사항" required>
              <Textarea
                value={formData.precautions}
                onChange={(e) => handleInputChange('precautions', e.target.value)}
                placeholder=""
                className={FORM_STYLES.textarea.base}
                rows={2}
              />
            </FormField>
            <FormField label="품질보증기준" required>
              <Textarea
                value={formData.qualityStandard}
                onChange={(e) => handleInputChange('qualityStandard', e.target.value)}
                placeholder="EX) 본 상품에 이상이 있을 경우 공정거래위원회 고시 '소비자분쟁 해결기준'에 의해 보상해 드립니다."
                className={FORM_STYLES.textarea.base}
                rows={2}
              />
            </FormField>
            <FormField
              label="소비자상담 전화번호"
              required
              helperText="번호는 하이픈(-)을 포함해서 입력해주세요. 예: 0000-0000"
            >
              <Input
                value={formData.customerService}
                onChange={(e) => handleInputChange('customerService', e.target.value)}
                placeholder="0000-0000"
                className={FORM_STYLES.input.base}
                maxLength={13}
              />
            </FormField>
          </div>
        </section>

        {/* 등록 버튼 */}
        <div className="pt-8">
          <Button
            type="submit"
            className="h-12 w-full rounded-lg bg-primary-300 text-sm font-medium text-text-on transition hover:opacity-80 focus:ring-primary-300 active:opacity-90"
            disabled={submitLoading}
          >
            {submitLoading ? '등록 중...' : '등록하기'}
          </Button>
          <ErrorDialog
            isOpen={!!submitError}
            onClose={handleErrorDialogClose}
            title="상품 등록 실패"
            message={submitError || ''}
          />
          <SuccessDialog
            isOpen={submitSuccess}
            onClose={handleSuccessDialogClose}
            title="상품 등록 완료"
            message="상품이 성공적으로 등록되었습니다."
          />
        </div>
      </form>
    </div>
  );
}
