'use client';

import { CustomLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, PasswordStrengthIndicator } from '@/components/form';
import { Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useSellerSignup } from '@/hooks/useSellerSignup';
import {
  checkPasswordLength,
  checkPasswordHasLetter,
  checkPasswordHasNumber,
  checkPasswordHasSpecial,
} from '@/lib/password-utils';
import { formatPhoneNumber, formatBusinessNumber } from '@/lib/format-utils';
import { FORM_STYLES } from '@/constants/form-styles';
import type { SellerSignupRequest } from '@/types/api';

export default function SellerSignUpPage() {
  const {
    isLoading,
    errors,
    checkEmail,
    checkBusinessNumber,
    checkBrandName,
    handleSignup,
    clearErrors,
  } = useSellerSignup();

  const [formData, setFormData] = useState<SellerSignupRequest>({
    name: '',
    businessName: '',
    ownerName: '',
    businessNumber: '',
    email: '',
    password: '',
    phone: '',
    image: '',
    address1: '',
    address2: '',
    mailOrderNumber: '',
  });

  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  // 입력 필드 변경 핸들러
  const handleInputChange = useCallback(
    (field: keyof SellerSignupRequest, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // 실시간 중복 체크
      if (field === 'email' && value) {
        checkEmail(value);
      } else if (field === 'businessNumber' && value) {
        checkBusinessNumber(value);
      } else if (field === 'name' && value) {
        checkBrandName(value);
      }
    },
    [checkEmail, checkBusinessNumber, checkBrandName],
  );

  // 약관 동의 변경 핸들러
  const handleAgreementChange = useCallback((field: keyof typeof agreements, checked: boolean) => {
    setAgreements((prev) => {
      const newAgreements = { ...prev, [field]: checked };

      // 전체 동의 처리
      if (field === 'all') {
        return {
          all: checked,
          terms: checked,
          privacy: checked,
          marketing: checked,
        };
      }

      // 개별 동의 시 전체 동의 상태 업데이트
      const allChecked = newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
      return { ...newAgreements, all: allChecked };
    });
  }, []);

  // 폼 유효성 검사
  const isFormValid = useCallback(() => {
    return (
      formData.name &&
      formData.businessName &&
      formData.ownerName &&
      formData.businessNumber &&
      formData.email &&
      formData.password &&
      formData.phone &&
      formData.address1 &&
      formData.address2 &&
      formData.mailOrderNumber &&
      agreements.terms &&
      agreements.privacy &&
      Object.keys(errors).length === 0
    );
  }, [formData, agreements, errors]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isFormValid()) {
        await handleSignup(formData);
      }
    },
    [isFormValid, handleSignup, formData],
  );

  return (
    <CustomLayout showTopBar={false} showSearchBar={false} showMainNav={false} showFooter={false}>
      <div className="bg-bg-100">
        {/* 회원가입 컨테이너 */}
        <div className="container mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-4 tablet:max-w-lg desktop:max-w-xl">
          {/* 로고 */}
          <div className="mb-6 flex justify-center pt-8">
            <Link href="/" aria-label="우르르 홈으로 이동">
              <Image
                src="/ururu-full-logo.png"
                alt="우르르"
                width={120}
                height={32}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* 안내 문구 */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-xl font-semibold text-text-100">판매자 회원가입</h1>
            <p className="text-sm font-normal text-text-200">
              우르르와 함께 성장하는 비즈니스를 경험하세요
            </p>
          </div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 브랜드명 */}
            <FormField label="브랜드명" required>
              <Input
                id="name"
                type="text"
                placeholder="브랜드명을 입력하세요"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={FORM_STYLES.input.base + ' ' + FORM_STYLES.input.focus}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </FormField>

            {/* 사업자명 */}
            <FormField label="사업자명" required>
              <Input
                id="businessName"
                type="text"
                placeholder="사업자명을 입력하세요"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className={FORM_STYLES.input.base + ' ' + FORM_STYLES.input.focus}
                required
              />
            </FormField>

            {/* 대표자명 */}
            <FormField label="대표자명" required>
              <Input
                id="ownerName"
                type="text"
                placeholder="대표자명을 입력하세요"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className={FORM_STYLES.input.base + ' ' + FORM_STYLES.input.focus}
                required
              />
            </FormField>

            {/* 사업자등록번호 */}
            <FormField label="사업자등록번호" required>
              <Input
                id="businessNumber"
                type="text"
                placeholder="1234567890"
                value={formatBusinessNumber(formData.businessNumber)}
                onChange={(e) =>
                  handleInputChange('businessNumber', e.target.value.replace(/[^0-9]/g, ''))
                }
                className={FORM_STYLES.input.base + ' ' + FORM_STYLES.input.focus}
                maxLength={12}
                required
              />
              {errors.businessNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.businessNumber}</p>
              )}
            </FormField>

            {/* 이메일 */}
            <FormField label="이메일" required>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={FORM_STYLES.input.base + ' ' + FORM_STYLES.input.focus}
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </FormField>

            {/* 비밀번호 */}
            <FormField
              label="비밀번호"
              required
              helperText="영문, 숫자, 특수문자(@$!%*#?&) 포함 8자 이상"
              characterCount={{ current: formData.password?.length || 0, max: 50 }}
            >
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={FORM_STYLES.input.base}
                maxLength={50}
                required
              />
            </FormField>
            <PasswordStrengthIndicator
              password={formData.password}
              checkPasswordLength={checkPasswordLength}
              checkPasswordHasLetter={checkPasswordHasLetter}
              checkPasswordHasNumber={checkPasswordHasNumber}
              checkPasswordHasSpecial={checkPasswordHasSpecial}
            />

            {/* 전화번호 */}
            <FormField
              label="전화번호"
              required
              helperText="하이픈(-)을 제외하고 숫자만 입력해주세요"
              characterCount={{ current: formData.phone?.length || 0, max: 11 }}
            >
              <Input
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={formatPhoneNumber(formData.phone)}
                onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                className={FORM_STYLES.input.base}
                maxLength={13}
                required
              />
            </FormField>

            {/* 주소 */}
            <FormField label="주소" required>
              <div className="mb-2 flex gap-2">
                <div className={FORM_STYLES.zipcode.display}>우편번호</div>
                <button
                  type="button"
                  className={FORM_STYLES.button.pinkOutline + ' h-12 min-w-[120px] rounded-lg'}
                >
                  우편 번호
                </button>
              </div>
              <Input
                type="text"
                placeholder="도로명"
                value={formData.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
                className={FORM_STYLES.input.base + ' mb-2'}
                required
              />
              <Input
                type="text"
                placeholder="지번"
                value={formData.address2}
                onChange={(e) => handleInputChange('address2', e.target.value)}
                className={FORM_STYLES.input.base}
                required
              />
            </FormField>

            {/* 통신판매업 신고번호 */}
            <FormField label="통신판매업 신고번호" required>
              <Input
                id="mailOrderNumber"
                type="text"
                placeholder="2023-서울강남-1234"
                value={formData.mailOrderNumber}
                onChange={(e) => handleInputChange('mailOrderNumber', e.target.value)}
                className={FORM_STYLES.input.base + ' ' + FORM_STYLES.input.focus}
                required
              />
            </FormField>

            {/* 약관 동의 */}
            <div className="mt-6 space-y-3">
              <label className={FORM_STYLES.checkbox.container}>
                <input
                  type="checkbox"
                  checked={agreements.all}
                  onChange={(e) => handleAgreementChange('all', e.target.checked)}
                  className={FORM_STYLES.checkbox.base}
                />
                <span className="text-sm font-medium leading-relaxed text-text-100">
                  전체 약관에 동의합니다
                </span>
              </label>

              <div className="ml-7 space-y-2">
                <label className={FORM_STYLES.checkbox.container}>
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={(e) => handleAgreementChange('terms', e.target.checked)}
                    className={FORM_STYLES.checkbox.base}
                  />
                  <span className={FORM_STYLES.checkbox.label}>
                    <span className="text-primary-300 underline">이용약관</span>에 동의합니다 (필수)
                  </span>
                </label>

                <label className={FORM_STYLES.checkbox.container}>
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={(e) => handleAgreementChange('privacy', e.target.checked)}
                    className={FORM_STYLES.checkbox.base}
                  />
                  <span className={FORM_STYLES.checkbox.label}>
                    <span className="text-primary-300 underline">개인정보처리방침</span>에
                    동의합니다 (필수)
                  </span>
                </label>

                <label className={FORM_STYLES.checkbox.container}>
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={(e) => handleAgreementChange('marketing', e.target.checked)}
                    className={FORM_STYLES.checkbox.base}
                  />
                  <span className={FORM_STYLES.checkbox.label}>
                    마케팅 정보 수신에 동의합니다 (선택)
                  </span>
                </label>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={FORM_STYLES.button.submit}
            >
              <Store className="h-4 w-4" />
              {isLoading ? '회원가입 중...' : '판매자 회원가입'}
            </Button>
          </form>

          {/* 로그인 이동 */}
          <div className="mt-6 text-center">
            <span className="text-sm text-text-200">이미 계정이 있으신가요? </span>
            <Link
              href="/login"
              className="text-sm font-medium text-primary-300 transition-colors hover:text-primary-200"
            >
              로그인
            </Link>
          </div>

          {/* 안내 문구 */}
          <div className="mt-6 text-center">
            <p className="text-xs text-text-300">
              회원가입 시, <span className="underline">이용약관</span> 및{' '}
              <span className="underline">개인정보처리방침</span>에 동의한 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </div>
    </CustomLayout>
  );
}
