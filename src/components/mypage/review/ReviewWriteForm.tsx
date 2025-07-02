'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form';
import { Star, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FORM_STYLES } from '@/constants/form-styles';
import Image from 'next/image';

interface ReviewData {
  rating: number;
  moisturizing: string;
  soothing: string;
  irritation: string;
  images: File[];
  text: string;
}

const initialReviewData: ReviewData = {
  rating: 4,
  moisturizing: '',
  soothing: '',
  irritation: '',
  images: [],
  text: '',
};

export function ReviewWriteForm() {
  const [reviewData, setReviewData] = useState<ReviewData>(initialReviewData);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  // 컴포넌트 언마운트 시 객체 URL 정리
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      objectUrlsRef.current.clear();
    };
  }, []);

  const createObjectUrl = (file: File): string => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.add(url);
    return url;
  };

  const revokeObjectUrl = (url: string) => {
    URL.revokeObjectURL(url);
    objectUrlsRef.current.delete(url);
  };

  const handleRatingChange = (rating: number) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  const handleAttributeChange = (
    attribute: keyof Pick<ReviewData, 'moisturizing' | 'soothing' | 'irritation'>,
    value: string,
  ) => {
    setReviewData((prev) => ({ ...prev, [attribute]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setReviewData((prev) => ({ ...prev, text: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (reviewData.images.length + files.length <= 5) {
      setReviewData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const handleImageRemove = (index: number) => {
    const fileToRemove = reviewData.images[index];
    if (fileToRemove instanceof File) {
      const url = URL.createObjectURL(fileToRemove);
      revokeObjectUrl(url);
    }

    setReviewData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('리뷰 데이터:', reviewData);
    // TODO: API 호출 로직 추가
  };

  return (
    <Card className="w-full rounded-2xl border-0 bg-bg-100 px-4 py-6 shadow-none md:px-8">
      <CardContent className="p-0">
        <h1 className="mb-6 text-center text-2xl font-semibold md:text-2xl">리뷰 작성</h1>

        {/* 알림 박스 */}
        <div className="mb-8 flex items-start gap-3 rounded-lg bg-bg-100 p-6 shadow-sm">
          <Image
            src="/ururu-gradient.svg"
            alt="우르르"
            width={24}
            height={24}
            className="h-6 w-6 flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-text-300">
              리뷰를 작성하면 <span className="font-semibold text-primary-200">50P</span>를 획득할
              수 있어요!
              <span className="font-semibold text-primary-200"> 포토 리뷰</span>라면{' '}
              <span className="font-semibold text-primary-200">100P</span>!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* 별점 평가 */}
          <FormField label="상품은 어땠나요?" required>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="flex h-10 w-10 items-center justify-center md:h-12 md:w-12"
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors md:h-10 md:w-10',
                      star <= reviewData.rating
                        ? 'fill-primary-200 text-primary-200'
                        : 'text-bg-300',
                    )}
                  />
                </button>
              ))}
            </div>
          </FormField>

          {/* 보습력 */}
          <FormField label="보습력" required>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { value: 'good', label: '촉촉함이 오래가요' },
                { value: 'normal', label: '무난해요' },
                { value: 'bad', label: '건조함이 느껴져요' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAttributeChange('moisturizing', option.value)}
                  className={cn(
                    FORM_STYLES.button.selectable.base,
                    reviewData.moisturizing === option.value
                      ? FORM_STYLES.button.selectable.selected
                      : FORM_STYLES.button.selectable.unselected,
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>

          {/* 진정 */}
          <FormField label="진정" required>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { value: 'good', label: '피부 진정에 좋아요' },
                { value: 'normal', label: '무난해요' },
                { value: 'bad', label: '진정 효과가 없어요' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAttributeChange('soothing', option.value)}
                  className={cn(
                    FORM_STYLES.button.selectable.base,
                    reviewData.soothing === option.value
                      ? FORM_STYLES.button.selectable.selected
                      : FORM_STYLES.button.selectable.unselected,
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>

          {/* 자극도 */}
          <FormField label="자극도" required>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { value: 'good', label: '자극 없이 순해요' },
                { value: 'normal', label: '무난해요' },
                { value: 'bad', label: '자극적이에요' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAttributeChange('irritation', option.value)}
                  className={cn(
                    FORM_STYLES.button.selectable.base,
                    reviewData.irritation === option.value
                      ? FORM_STYLES.button.selectable.selected
                      : FORM_STYLES.button.selectable.unselected,
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>

          {/* 리뷰 이미지 첨부 */}
          <FormField
            label="리뷰 이미지 첨부"
            helperText="실사용 이미지를 첨부하면 더욱 유용한 리뷰가 돼요 (최대 5장)"
          >
            <div className="space-y-4">
              {/* 업로드 버튼 */}
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  disabled={reviewData.images.length >= 5}
                />
                <div
                  className={cn(
                    'flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors md:h-32',
                    reviewData.images.length >= 5
                      ? 'cursor-not-allowed border-bg-300 bg-bg-200'
                      : 'hover:bg-primary-50 border-bg-300 bg-bg-100 hover:border-primary-300',
                  )}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-6 w-6 text-text-300 md:h-8 md:w-8" />
                    <span className="text-sm text-text-300">
                      {reviewData.images.length >= 5
                        ? '최대 5장까지 업로드 가능합니다'
                        : '이미지를 업로드하세요'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 업로드된 이미지 리스트 */}
              {reviewData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {reviewData.images.map((file, index) => (
                    <div key={index} className="group relative">
                      <div className="relative aspect-square overflow-hidden rounded-lg shadow-sm">
                        <Image
                          src={createObjectUrl(file)}
                          alt={`업로드된 이미지 ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-text-100 text-text-on opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="m-1 truncate text-xs text-text-300">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          {/* 텍스트 리뷰 */}
          <FormField
            label="솔직한 상품 리뷰를 남겨주세요"
            required
            characterCount={{ current: reviewData.text.length, max: 500 }}
          >
            <textarea
              value={reviewData.text}
              onChange={handleTextChange}
              placeholder="꿀팁 가득, 상세한 리뷰를 작성해보세요!"
              className={
                FORM_STYLES.textarea.base +
                ' ' +
                FORM_STYLES.textarea.focus +
                ' min-h-[120px] w-full'
              }
              rows={5}
            />
          </FormField>

          {/* 제출 버튼 */}
          <Button type="submit" className={FORM_STYLES.button.submit + ' mt-6 text-sm font-medium'}>
            리뷰 작성 완료
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
