import { useSafeRouter } from '@/hooks';
import { useState, useCallback } from 'react';
import { BeautyProfileFormData } from '@/types/form';
import {
  SKIN_TYPE_OPTIONS,
  SKIN_TONE_OPTIONS,
  SKIN_CONCERN_OPTIONS,
  SKIN_REACTION_OPTIONS,
  INTEREST_CATEGORY_OPTIONS,
  BEAUTY_PROFILE_CONSTANTS,
} from '@/constants/beauty-profile';
import { updateBeautyProfile } from '@/services/beautyProfileService';

const INITIAL_BEAUTY_PROFILE_DATA: BeautyProfileFormData = {
  skinType: 'neutral',
  skinTone: 'neutral',
  skinConcerns: ['none'],
  skinReaction: 'no',
  interestCategories: ['none'],
  minPrice: '',
  maxPrice: '',
  productRequest: '',
};

export const useBeautyProfileEdit = () => {
  const router = useSafeRouter();

  const [beautyProfileData, setBeautyProfileData] = useState<BeautyProfileFormData>(
    INITIAL_BEAUTY_PROFILE_DATA,
  );

  const handleInputChange = useCallback(
    (field: keyof BeautyProfileFormData, value: string | string[]) => {
      setBeautyProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSkinConcernToggle = useCallback((concern: string) => {
    setBeautyProfileData((prev) => {
      if (concern === 'none') {
        return {
          ...prev,
          skinConcerns: ['none'],
        };
      } else {
        const newConcerns = prev.skinConcerns.includes(concern)
          ? prev.skinConcerns.filter((c) => c !== concern)
          : prev.skinConcerns.length < 3
            ? [...prev.skinConcerns.filter((c) => c !== 'none'), concern]
            : prev.skinConcerns.filter((c) => c !== 'none');

        return {
          ...prev,
          skinConcerns: newConcerns.length > 0 ? newConcerns : ['none'],
        };
      }
    });
  }, []);

  const handleInterestCategoryToggle = useCallback((category: string) => {
    setBeautyProfileData((prev) => {
      if (category === 'none') {
        return {
          ...prev,
          interestCategories: ['none'],
        };
      } else {
        const newCategories = prev.interestCategories.includes(category)
          ? prev.interestCategories.filter((c) => c !== category)
          : [...prev.interestCategories.filter((c) => c !== 'none'), category];

        return {
          ...prev,
          interestCategories: newCategories.length > 0 ? newCategories : ['none'],
        };
      }
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // 알러지 입력값: skinReaction이 'no'가 아니면 productRequest 필드(알러지 입력란)에서 공백으로 split
        const allergies =
          beautyProfileData.skinReaction !== 'no' && beautyProfileData.productRequest
            ? beautyProfileData.productRequest.split(' ').filter(Boolean)
            : [];
        // 폼 데이터를 API 요청 형식에 맞게 변환
        const payload = {
          skinType: beautyProfileData.skinType,
          skinTone: beautyProfileData.skinTone,
          concerns: beautyProfileData.skinConcerns.filter((c) => c !== 'none'),
          hasAllergy: beautyProfileData.skinReaction !== 'no',
          allergies,
          interestCategories: beautyProfileData.interestCategories.filter((c) => c !== 'none'),
          minPrice: Number(beautyProfileData.minPrice) || 0,
          maxPrice: Number(beautyProfileData.maxPrice) || 0,
          additionalInfo: '',
        };
        await updateBeautyProfile(payload);
        router.push('/mypage');
      } catch (error) {
        alert('뷰티프로필 수정에 실패했습니다.');
      }
    },
    [beautyProfileData, router],
  );

  return {
    beautyProfileData,
    handleInputChange,
    handleSkinConcernToggle,
    handleInterestCategoryToggle,
    handleSubmit,
    // 상수들
    SKIN_TYPE_OPTIONS,
    SKIN_TONE_OPTIONS,
    SKIN_CONCERN_OPTIONS,
    SKIN_REACTION_OPTIONS,
    INTEREST_CATEGORY_OPTIONS,
    BEAUTY_PROFILE_CONSTANTS,
  };
};
