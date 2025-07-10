import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  sellerSignup,
  checkEmailAvailability,
  checkBusinessNumberAvailability,
  checkBrandNameAvailability,
} from '@/services/auth';
import type { SellerSignupFormData } from '@/types/auth';

interface UseSellerSignupReturn {
  isLoading: boolean;
  errors: Record<string, string>;
  checkEmail: (email: string) => Promise<boolean>;
  checkBusinessNumber: (businessNumber: string) => Promise<boolean>;
  checkBrandName: (name: string) => Promise<boolean>;
  handleSignup: (data: SellerSignupFormData) => Promise<void>;
  clearErrors: () => void;
}

export const useSellerSignup = (): UseSellerSignupReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // 이메일 중복 체크 (회원가입 시에만 사용)
  const checkEmail = useCallback(async (email: string): Promise<boolean> => {
    if (!email) return true;

    try {
      const response = await checkEmailAvailability(email);
      return response.is_available;
    } catch (error: any) {
      console.error('이메일 중복 체크 오류:', error);
      return false;
    }
  }, []);

  // 사업자등록번호 중복 체크 (회원가입 시에만 사용)
  const checkBusinessNumber = useCallback(async (businessNumber: string): Promise<boolean> => {
    if (!businessNumber) return true;

    try {
      const response = await checkBusinessNumberAvailability(businessNumber);
      return response.is_available;
    } catch (error: any) {
      console.error('사업자등록번호 중복 체크 오류:', error);
      return false;
    }
  }, []);

  // 브랜드명 중복 체크 (회원가입 시에만 사용)
  const checkBrandName = useCallback(async (name: string): Promise<boolean> => {
    if (!name) return true;

    try {
      const response = await checkBrandNameAvailability(name);
      return response.is_available;
    } catch (error: any) {
      console.error('브랜드명 중복 체크 오류:', error);
      return false;
    }
  }, []);

  // 회원가입 처리
  const handleSignup = useCallback(
    async (data: SellerSignupFormData): Promise<void> => {
      setIsLoading(true);
      clearErrors();

      try {
        console.log('🚀 회원가입 시작:', data);

        // ✅ 회원가입 시점에 중복 체크 수행
        const [emailAvailable, businessNumberAvailable, brandNameAvailable] = await Promise.all([
          checkEmail(data.email),
          checkBusinessNumber(data.businessNumber),
          checkBrandName(data.name),
        ]);

        console.log('📊 중복 체크 결과:', {
          email: emailAvailable,
          businessNumber: businessNumberAvailable,
          brandName: brandNameAvailable,
        });

        // 중복 체크 실패 시 에러 메시지 설정
        if (!emailAvailable) {
          setErrors((prev) => ({ ...prev, email: '이미 사용 중인 이메일입니다.' }));
        }
        if (!businessNumberAvailable) {
          setErrors((prev) => ({
            ...prev,
            businessNumber: '이미 사용 중인 사업자등록번호입니다.',
          }));
        }
        if (!brandNameAvailable) {
          setErrors((prev) => ({ ...prev, name: '이미 사용 중인 브랜드명입니다.' }));
        }

        // 중복 체크 실패 시 회원가입 중단
        if (!emailAvailable || !businessNumberAvailable || !brandNameAvailable) {
          console.log('❌ 중복 체크 실패로 회원가입 중단');
          return;
        }

        // ✅ 백엔드 회원가입 API 호출
        await sellerSignup(data);

        toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
        router.push('/login?message=회원가입이 완료되었습니다. 로그인해주세요.');
      } catch (error: any) {
        console.error('회원가입 오류:', error);

        // 백엔드에서 받은 에러 코드에 따른 처리
        if (error.code) {
          switch (error.code) {
            case 'DUPLICATE_EMAIL':
              setErrors((prev) => ({ ...prev, email: '이미 사용 중인 이메일입니다.' }));
              break;
            case 'DUPLICATE_BUSINESS_NUMBER':
              setErrors((prev) => ({
                ...prev,
                businessNumber: '이미 사용 중인 사업자등록번호입니다.',
              }));
              break;
            case 'DUPLICATE_BRAND_NAME':
              setErrors((prev) => ({ ...prev, name: '이미 사용 중인 브랜드명입니다.' }));
              break;
            default:
              toast.error(error.message || '회원가입 중 오류가 발생했습니다.');
          }
        } else {
          toast.error(error.message || '회원가입 중 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [checkEmail, checkBusinessNumber, checkBrandName, clearErrors, router],
  );

  return {
    isLoading,
    errors,
    checkEmail,
    checkBusinessNumber,
    checkBrandName,
    handleSignup,
    clearErrors,
  };
};
