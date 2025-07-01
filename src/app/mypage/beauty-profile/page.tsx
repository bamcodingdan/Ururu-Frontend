'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/mypage/Sidebar';
import { NoFooterLayout } from '@/components/layout/layouts';
import { Card, CardContent } from '@/components/ui/card';
import { SelectableButton } from '@/components/ui/selectable-button';
import { Badge } from '@/components/ui/badge';
import { Edit, Info, DollarSign, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SKIN_TYPE_OPTIONS,
  SKIN_TONE_OPTIONS,
  SKIN_CONCERN_OPTIONS,
  SKIN_REACTION_OPTIONS,
  INTEREST_CATEGORY_OPTIONS,
} from '@/constants/beauty-profile';
import { beautyProfileData } from '@/data/mypage';

export default function BeautyProfilePage() {
  // 실제로는 API에서 가져올 데이터 (현재는 mock 데이터 사용)
  const profileData = beautyProfileData.withProfile;

  // 뷰티 프로필이 있는지 확인
  const hasBeautyProfile = profileData.skinType && profileData.skinTone;

  // 옵션에서 라벨 찾기 함수
  const findLabel = (
    options: readonly { readonly label: string; readonly value: string }[],
    value: string,
  ) => {
    return options.find((option) => option.value === value)?.label || value;
  };

  // 선택된 항목들의 라벨 찾기 함수
  const findSelectedLabels = (
    options: readonly { readonly label: string; readonly value: string }[],
    values: string[],
  ) => {
    return values.map((value) => findLabel(options, value));
  };

  return (
    <NoFooterLayout className="bg-bg-100">
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-start justify-center gap-0 px-6 py-12 md:px-9 lg:flex-row lg:gap-12 lg:px-12">
        {/* 데스크탑: 사이드바 */}
        <div className="hidden w-[256px] flex-shrink-0 pt-8 lg:block">
          <Sidebar />
        </div>
        {/* 메인 컨텐츠 */}
        <main className="mx-auto mt-0 flex w-full max-w-3xl flex-col gap-8 px-0 lg:mt-0">
          <Card className="w-full rounded-2xl border-0 bg-bg-100 px-4 py-6 shadow-none md:px-8">
            <CardContent className="p-0">
              <h1 className="mb-6 text-center text-2xl font-semibold md:text-2xl">뷰티 프로필</h1>

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
                    뷰티 프로필을 설정하면 회원님만의 맞춤 서비스가 제공돼요!
                  </p>
                </div>
              </div>

              {!hasBeautyProfile ? (
                // 뷰티 프로필이 없을 때
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-bg-200 p-6">
                    <Edit className="h-12 w-12 text-text-300" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-text-100">
                    뷰티 프로필을 작성해보세요
                  </h2>
                  <p className="mb-6 text-text-200">
                    나만의 뷰티 프로필을 작성하면 맞춤형 상품을 추천받을 수 있어요
                  </p>
                  <Link href="/mypage/beauty-profile/edit">
                    <Button className="h-12 w-full rounded-lg border border-primary-300 bg-bg-100 text-primary-300 transition-colors hover:bg-primary-100">
                      뷰티 프로필 작성하기
                    </Button>
                  </Link>
                </div>
              ) : (
                // 뷰티 프로필이 있을 때
                <div className="w-full space-y-8">
                  {/* 1. 피부 타입 */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-text-100">
                      피부 타입
                    </h2>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                      {SKIN_TYPE_OPTIONS.map((option) => {
                        const isSelected = profileData.skinType === option.value;
                        return (
                          <SelectableButton
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={isSelected}
                            isDisabled={true}
                            onClick={() => {}}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. 피부 톤 */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-text-100">
                      피부 톤
                    </h2>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                      {SKIN_TONE_OPTIONS.map((option) => {
                        const isSelected = profileData.skinTone === option.value;
                        return (
                          <SelectableButton
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={isSelected}
                            isDisabled={true}
                            onClick={() => {}}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. 피부 고민 */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-text-100">피부 고민 (최대 3개)</h2>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                      {SKIN_CONCERN_OPTIONS.map((option) => {
                        const isSelected = profileData.skinConcerns.includes(option.value);
                        return (
                          <SelectableButton
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={isSelected}
                            isDisabled={true}
                            onClick={() => {}}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. 특정 화장품 사용 후 이상 경험 여부 */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-text-100">
                      특정 화장품 사용 후 이상 경험 여부
                    </h2>
                    <p className="text-sm text-text-200">
                      피부가 예민하거나, 특정 화장품 사용 후 발진, 가려움 등을 경험한 적이 있나요?
                    </p>
                    <div className="flex gap-2">
                      {SKIN_REACTION_OPTIONS.map((option) => {
                        const isSelected = profileData.skinReaction === option.value;
                        return (
                          <SelectableButton
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={isSelected}
                            isDisabled={true}
                            onClick={() => {}}
                            className="min-w-0 flex-1"
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. 관심 카테고리 */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-text-100">
                      관심 카테고리
                    </h2>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                      {INTEREST_CATEGORY_OPTIONS.map((option) => {
                        const isSelected = profileData.interestCategories.includes(option.value);
                        return (
                          <SelectableButton
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            isSelected={isSelected}
                            isDisabled={true}
                            onClick={() => {}}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. 선호 가격대 */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-text-100">선호 가격대</h2>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="rounded-lg border border-bg-300 bg-bg-200 px-4 py-3 text-sm text-text-200">
                          {profileData.minPrice
                            ? Number(profileData.minPrice).toLocaleString()
                            : '최소 가격'}
                          원
                        </div>
                      </div>
                      <div className="flex items-center text-text-300">~</div>
                      <div className="flex-1">
                        <div className="rounded-lg border border-bg-300 bg-bg-200 px-4 py-3 text-sm text-text-200">
                          {profileData.maxPrice
                            ? Number(profileData.maxPrice).toLocaleString()
                            : '최대 가격'}
                          원
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 7. 상품 추천 요청 */}
                  {profileData.productRequest && (
                    <div className="space-y-3">
                      <h2 className="text-lg font-semibold text-text-100">
                        이런 상품을 추천해주세요
                      </h2>
                      <div className="rounded-lg border border-bg-300 bg-bg-200 p-4">
                        <p className="text-sm leading-relaxed text-text-100">
                          {profileData.productRequest}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 뷰티 프로필 수정하기 버튼 */}
                  <div className="pt-6">
                    <Link href="/mypage/beauty-profile/edit">
                      <Button className="h-12 w-full rounded-lg border border-primary-300 bg-bg-100 text-primary-300 transition-colors hover:bg-primary-100">
                        뷰티 프로필 수정하기
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </NoFooterLayout>
  );
}
