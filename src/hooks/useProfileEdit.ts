import { useSafeRouter } from '@/hooks';
import { useState, useCallback } from 'react';

import { VALIDATION_CONSTANTS } from '@/constants/validation';
import { GENDER_OPTIONS, DEFAULT_AGREEMENTS } from '@/constants/form-options';
import { checkNicknameDuplicate, updateProfile } from '@/services/memberService';

export const useProfileEdit = () => {
  const router = useSafeRouter();

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState<Date | undefined>(undefined);
  const [phone, setPhone] = useState('');
  const [agreements, setAgreements] = useState(DEFAULT_AGREEMENTS);
  const [profileImg] = useState('/profile-image.svg');
  const [nicknameGuide, setNicknameGuide] = useState('');
  const [nicknameGuideType, setNicknameGuideType] = useState<'success' | 'error' | 'base'>('base');

  const handleNicknameCheck = useCallback(async () => {
    if (!nickname.trim()) {
      setNicknameGuide('닉네임을 입력해주세요.');
      setNicknameGuideType('error');
      return;
    }

    try {
      const isDuplicate = await checkNicknameDuplicate(nickname);
      if (isDuplicate) {
        setNicknameGuide('이미 사용 중인 닉네임입니다.');
        setNicknameGuideType('error');
      } else {
        setNicknameGuide('사용 가능한 닉네임입니다.');
        setNicknameGuideType('success');
      }
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      setNicknameGuide('중복 확인 중 오류가 발생했습니다.');
      setNicknameGuideType('error');
    }
  }, [nickname]);

  const handleNicknameChange = useCallback((value: string) => {
    setNickname(value);
    setNicknameGuide('');
    setNicknameGuideType('base');
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value.replace(/[^0-9]/g, ''));
  }, []);

  const handleAgreementChange = useCallback((field: keyof typeof agreements, checked: boolean) => {
    setAgreements((prev) => ({ ...prev, [field]: checked }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        // 닉네임 중복 확인
        const isDuplicate = await checkNicknameDuplicate(nickname);
        if (isDuplicate) {
          alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 사용해주세요.');
          return;
        }

        // 프로필 수정 API 요청
        const payload: any = {
          nickname: nickname.trim(),
          gender,
          phone: phone.trim(),
        };

        // birth가 있을 때만 추가하고 간단한 날짜 형식으로 변환
        if (birth) {
          const year = birth.getFullYear();
          const month = String(birth.getMonth() + 1).padStart(2, '0');
          const day = String(birth.getDate()).padStart(2, '0');
          payload.birth = `${year}-${month}-${day}`;
        }

        await updateProfile(payload);
        alert('프로필이 성공적으로 수정되었습니다.');
        router.push('/mypage');
      } catch (error) {
        console.error('프로필 수정 실패:', error);
        alert('프로필 수정에 실패했습니다.');
      }
    },
    [nickname, gender, birth, phone, router],
  );

  return {
    // 상태
    nickname,
    gender,
    birth,
    phone,
    agreements,
    profileImg,
    nicknameGuide,
    nicknameGuideType,

    // 핸들러
    handleNicknameChange,
    handleNicknameCheck,
    setGender,
    setBirth,
    handlePhoneChange,
    handleAgreementChange,
    handleSubmit,

    // 상수
    GENDER_OPTIONS,
    VALIDATION_CONSTANTS,
  };
};
