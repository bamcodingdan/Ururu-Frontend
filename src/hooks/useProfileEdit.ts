import { useSafeRouter } from '@/hooks';
import { useState, useCallback } from 'react';

import { VALIDATION_CONSTANTS } from '@/constants/validation';
import { GENDER_OPTIONS, DEFAULT_AGREEMENTS } from '@/constants/form-options';
import { checkNicknameDuplicate } from '@/services/memberService';

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
    (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: 실제 프로필 수정 API 연동 필요
      // TODO: 실제 프로필 수정 API 호출
      // 수정 후 마이페이지로 이동
      router.push('/mypage');
    },
    [router],
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
