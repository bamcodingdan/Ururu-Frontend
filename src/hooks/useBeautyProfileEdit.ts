import { useSafeRouter } from '@/hooks';
import { useState, useCallback, useEffect } from 'react';
import { BeautyProfileFormData } from '@/types/form';
import {
  SKIN_TYPE_OPTIONS,
  SKIN_TONE_OPTIONS,
  SKIN_CONCERN_OPTIONS,
  SKIN_REACTION_OPTIONS,
  INTEREST_CATEGORY_OPTIONS,
  BEAUTY_PROFILE_CONSTANTS,
} from '@/constants/beauty-profile';
import { updateBeautyProfile, getBeautyProfile } from '@/services/beautyProfileService';

const INITIAL_BEAUTY_PROFILE_DATA: BeautyProfileFormData = {
  skinType: 'NEUTRAL',
  skinTone: 'NEUTRAL',
  skinConcerns: ['none'],
  skinReaction: 'no',
  interestCategories: ['none'],
  minPrice: '',
  maxPrice: '',
  productRequest: '',
  allergyInput: '',
};

export const useBeautyProfileEdit = () => {
  const router = useSafeRouter();

  const [beautyProfileData, setBeautyProfileData] = useState<BeautyProfileFormData>(
    INITIAL_BEAUTY_PROFILE_DATA,
  );
  const [isLoading, setIsLoading] = useState(true);

  // 기존 뷰티프로필 데이터 가져오기
  useEffect(() => {
    const fetchBeautyProfile = async () => {
      try {
        const profileData = await getBeautyProfile();
        console.log('기존 뷰티프로필 데이터:', profileData);

        // API 응답을 폼 데이터 형식으로 변환
        const transformedData: BeautyProfileFormData = {
          skinType: profileData.skin_type || 'NEUTRAL',
          skinTone: profileData.skin_tone || 'NEUTRAL',
          skinConcerns:
            profileData.concerns && profileData.concerns.length > 0
              ? profileData.concerns.map(
                  (concern: string) =>
                    SKIN_CONCERN_OPTIONS.find((opt) => opt.label === concern)?.value || concern,
                )
              : ['none'],
          skinReaction: profileData.has_allergy ? 'yes' : 'no',
          interestCategories:
            profileData.interest_categories && profileData.interest_categories.length > 0
              ? profileData.interest_categories.map(
                  (category: string) =>
                    INTEREST_CATEGORY_OPTIONS.find((opt) => opt.label === category)?.value ||
                    category,
                )
              : ['none'],
          minPrice: profileData.min_price ? profileData.min_price.toString() : '',
          maxPrice: profileData.max_price ? profileData.max_price.toString() : '',
          productRequest: profileData.additional_info || '',
          allergyInput:
            profileData.allergies && profileData.allergies.length > 0
              ? profileData.allergies.join(' ')
              : '',
        };

        console.log('변환된 폼 데이터:', transformedData);
        setBeautyProfileData(transformedData);
      } catch (error) {
        console.error('뷰티프로필 데이터 가져오기 실패:', error);
        // 에러가 발생해도 기본값으로 시작
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeautyProfile();
  }, []);

  const handleInputChange = useCallback(
    (field: keyof BeautyProfileFormData, value: string | string[]) => {
      setBeautyProfileData((prev) => {
        // allergyInput만 별도로 처리
        if (field === 'allergyInput') {
          return { ...prev, allergyInput: value as string };
        }
        return { ...prev, [field]: value };
      });
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
        // 알러지 입력값: skinReaction이 'no'가 아니면 allergyInput 필드에서 공백으로 split
        const allergies =
          beautyProfileData.skinReaction !== 'no' && beautyProfileData.allergyInput
            ? beautyProfileData.allergyInput.split(' ').filter(Boolean)
            : [];

        // 영어 value를 한국어 label로 변환
        const concerns = beautyProfileData.skinConcerns
          .filter((c) => c !== 'none')
          .map((value) => SKIN_CONCERN_OPTIONS.find((opt) => opt.value === value)?.label || value);

        const interestCategories = beautyProfileData.interestCategories
          .filter((c) => c !== 'none')
          .map(
            (value) => INTEREST_CATEGORY_OPTIONS.find((opt) => opt.value === value)?.label || value,
          );

        // 폼 데이터를 API 요청 형식에 맞게 변환
        const payload = {
          skinType: beautyProfileData.skinType,
          skinTone: beautyProfileData.skinTone,
          concerns,
          hasAllergy: beautyProfileData.skinReaction !== 'no',
          allergies,
          interestCategories,
          minPrice: Number(beautyProfileData.minPrice) || 0,
          maxPrice: Number(beautyProfileData.maxPrice) || 0,
          additionalInfo: beautyProfileData.productRequest || '',
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
    isLoading,
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
