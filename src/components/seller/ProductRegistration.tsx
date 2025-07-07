'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, Upload, Plus, X, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface ProductOption {
  id: string;
  name: string;
  price: number;
  image: File | null;
  stock: number;
}

interface ProductFormData {
  name: string;
  description: string;
  categoryMain: string;
  categoryMiddle: string;
  categorySub: string;
  options: ProductOption[];
  // 화장품 정보제공고시
  capacity: string;
  capacityUnit: string;
  specification: string;
  expiryDate: string;
  usage: string;
  manufacturer: string;
  seller: string;
  country: string;
  functionalTest: 'yes' | 'no';
  precautions: string;
  qualityStandard: string;
  customerService: string;
}

const categoryData = {
  main: ['스킨케어', '클렌징', '마스크팩', '메이크업', '선케어', '향수', '헤어케어', '바디케어'],
  middle: {
    스킨케어: ['토너', '에센스', '크림', '로션', '미스트', '오일'],
    클렌징: ['클렌징 폼', '클렌징 오일', '클렌징 워터', '클렌징 티슈'],
    마스크팩: ['시트 마스크', '워시오프 마스크', '슬리핑 마스크'],
    메이크업: ['베이스', '파운데이션', '컨실러', '파우더', '립', '아이'],
    선케어: ['선크림', '선스프레이', '선스틱'],
    향수: ['여성향수', '남성향수', '유니섹스'],
    헤어케어: ['샴푸', '컨디셔너', '트리트먼트', '헤어오일'],
    바디케어: ['바디워시', '바디로션', '핸드크림', '풋크림'],
  },
  sub: {
    토너: ['수분 토너', '진정 토너', '각질 토너', '미백 토너'],
    에센스: ['수분 에센스', '미백 에센스', '안티에이징 에센스'],
    크림: ['수분 크림', '영양 크림', '미백 크림', '안티에이징 크림'],
  },
};

const capacityUnits = ['ml', 'g', '개', '매'];

export function ProductRegistration() {
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

  const addOption = () => {
    const newOption: ProductOption = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      image: null,
      stock: 0,
    };
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const removeOption = (optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((option) => option.id !== optionId),
    }));
  };

  const updateOption = (optionId: string, field: keyof ProductOption, value: any) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === optionId ? { ...option, [field]: value } : option,
      ),
    }));
  };

  const handleImageUpload = (optionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateOption(optionId, 'image', file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('상품 등록:', formData);
    // TODO: API 호출
  };

  const getMiddleCategories = () => {
    return formData.categoryMain
      ? categoryData.middle[formData.categoryMain as keyof typeof categoryData.middle] || []
      : [];
  };

  const getSubCategories = () => {
    return formData.categoryMiddle
      ? categoryData.sub[formData.categoryMiddle as keyof typeof categoryData.sub] || []
      : [];
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-0">
      {/* 타이틀 */}
      <h1 className="mb-10 text-center text-3xl font-semibold text-text-100">상품 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* 상품 기본 정보 */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-text-100">상품 기본 정보</h2>
          <p className="mb-6 text-sm text-text-200">판매할 상품의 기본 정보를 입력해주세요</p>

          <div className="space-y-6">
            <FormField label="상품명" required>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="EX) 컬러그램 누디 블러 틴트 20 COLOR"
                className={FORM_STYLES.input.base}
                required
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
                required
              />
            </FormField>

            {/* 카테고리 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-100">카테고리</label>
              <div className="flex gap-2">
                <Select
                  value={formData.categoryMain}
                  onValueChange={(value) => {
                    handleInputChange('categoryMain', value);
                    handleInputChange('categoryMiddle', '');
                    handleInputChange('categorySub', '');
                  }}
                >
                  <SelectTrigger className="h-12 w-1/3 rounded-lg border-bg-300 bg-bg-100 px-4 text-left text-sm text-text-100 placeholder:text-text-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300">
                    <SelectValue placeholder="대분류" />
                  </SelectTrigger>
                  <SelectContent className="z-[80] max-h-60 bg-bg-100">
                    {categoryData.main.map((category) => (
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
                  onValueChange={(value) => {
                    handleInputChange('categoryMiddle', value);
                    handleInputChange('categorySub', '');
                  }}
                  disabled={!formData.categoryMain}
                >
                  <SelectTrigger className="h-12 w-1/3 rounded-lg border-bg-300 bg-bg-100 px-4 text-left text-sm text-text-100 placeholder:text-text-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-60">
                    <SelectValue placeholder="중분류" />
                  </SelectTrigger>
                  <SelectContent className="z-[80] max-h-60 bg-bg-100">
                    {getMiddleCategories().map((category) => (
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
                  onValueChange={(value) => handleInputChange('categorySub', value)}
                  disabled={!formData.categoryMiddle}
                >
                  <SelectTrigger className="h-12 w-1/3 rounded-lg border-bg-300 bg-bg-100 px-4 text-left text-sm text-text-100 placeholder:text-text-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-60">
                    <SelectValue placeholder="소분류" />
                  </SelectTrigger>
                  <SelectContent className="z-[80] max-h-60 bg-bg-100">
                    {getSubCategories().map((category) => (
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
            </div>
          </div>
        </section>

        {/* 상품 옵션 설정 */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-text-100">상품 옵션 설정</h2>
          <p className="mb-6 text-sm text-text-200">판매할 상품의 다양한 옵션을 설정해주세요</p>

          <div className="space-y-8">
            {formData.options.map((option, index) => (
              <div
                key={option.id}
                className="relative rounded-2xl border border-bg-300 bg-bg-100 p-8"
              >
                <div className="absolute right-6 top-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    className="h-8 w-8 text-text-300 hover:bg-bg-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="mb-6 text-lg font-semibold text-text-100">옵션 {index + 1}</h3>
                <div className="space-y-6">
                  <FormField label="옵션명" required>
                    <Input
                      value={option.name}
                      onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                      placeholder="EX) 07 치크로즈"
                      className={FORM_STYLES.input.base}
                      required
                      maxLength={20}
                    />
                  </FormField>
                  <FormField label="기본 가격" required>
                    <div className="relative">
                      <Input
                        type="number"
                        value={option.price}
                        onChange={(e) => updateOption(option.id, 'price', Number(e.target.value))}
                        placeholder="10,000"
                        className={FORM_STYLES.input.base + ' pr-12'}
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-300">
                        원
                      </span>
                    </div>
                  </FormField>
                  <FormField label="옵션 이미지" required>
                    <div className="cursor-pointer rounded-lg border-2 border-dashed border-bg-300 p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(option.id, e)}
                        className="hidden"
                        id={`image-upload-${option.id}`}
                      />
                      <label
                        htmlFor={`image-upload-${option.id}`}
                        className="flex cursor-pointer flex-col items-center justify-center"
                      >
                        <Upload className="mb-2 h-8 w-8 text-text-300" />
                        <span className="text-sm text-text-300">대표 이미지를 업로드하세요</span>
                      </label>
                      {option.image && (
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <ImageIcon className="h-4 w-4 text-text-300" />
                          <span className="text-sm text-text-200">{option.image.name}</span>
                        </div>
                      )}
                    </div>
                  </FormField>
                  <FormField label="재고수량" required>
                    <Input
                      type="number"
                      value={option.stock}
                      onChange={(e) => updateOption(option.id, 'stock', Number(e.target.value))}
                      placeholder="정산수를 표기해주세요"
                      className={FORM_STYLES.input.base}
                      required
                    />
                  </FormField>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={addOption}
              variant="outline"
              className="mt-2 h-12 w-full border-primary-200 font-semibold text-primary-300"
            >
              옵션 추가하기
            </Button>
          </div>
        </section>

        {/* 화장품 정보제공고시 */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-text-100">화장품 정보제공고시</h2>
          <p className="mb-6 text-sm text-text-200">
            화장품 판매에 따른 필수 정보입니다. 정확하게 입력해주세요.
          </p>

          <div className="space-y-6">
            <div className="flex gap-2">
              <FormField label="내용물의 용량 또는 중량" required className="flex-1">
                <Input
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder=""
                  className={FORM_STYLES.input.base}
                  required
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
                    {capacityUnits.map((unit) => (
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
                required
              />
            </FormField>
            <FormField label="사용기한(또는 개봉 후 사용기간)" required>
              <Input
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                placeholder="EX) 제조일로부터 24개월"
                className={FORM_STYLES.input.base}
                required
              />
            </FormField>
            <FormField label="사용법" required>
              <Textarea
                value={formData.usage}
                onChange={(e) => handleInputChange('usage', e.target.value)}
                placeholder="EX) 적당량의 내용을 손에 덜어 얼굴에 부드럽게 펴 발라줍니다."
                className={FORM_STYLES.textarea.base}
                rows={2}
                required
              />
            </FormField>
            <FormField label="화장품제조업자" required>
              <Input
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                placeholder=""
                className={FORM_STYLES.input.base}
                required
              />
            </FormField>
            <FormField label="화장품책임판매업자" required>
              <Input
                value={formData.seller}
                onChange={(e) => handleInputChange('seller', e.target.value)}
                placeholder=""
                className={FORM_STYLES.input.base}
                required
              />
            </FormField>
            <FormField label="제조국" required>
              <Input
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="대한민국"
                className={FORM_STYLES.input.base}
                required
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
                    required
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
                    required
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
                required
              />
            </FormField>
            <FormField label="품질보증기준" required>
              <Textarea
                value={formData.qualityStandard}
                onChange={(e) => handleInputChange('qualityStandard', e.target.value)}
                placeholder="EX) 본 상품에 이상이 있을 경우 공정거래위원회 고시 '소비자분쟁 해결기준'에 의해 보상해 드립니다."
                className={FORM_STYLES.textarea.base}
                rows={2}
                required
              />
            </FormField>
            <FormField label="소비자상담 전화번호" required>
              <Input
                value={formData.customerService}
                onChange={(e) => handleInputChange('customerService', e.target.value)}
                placeholder="0000-0000"
                className={FORM_STYLES.input.base}
                required
              />
            </FormField>
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
