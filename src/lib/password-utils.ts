import { VALIDATION_CONSTANTS } from '@/constants/validation';

// 비밀번호 길이 체크 (8자 이상)
export const checkPasswordLength = (password: string): boolean => {
  return password.length >= 8;
};

// 영문 포함 체크
export const checkPasswordHasLetter = (password: string): boolean => {
  return /[A-Za-z]/.test(password);
};

// 숫자 포함 체크
export const checkPasswordHasNumber = (password: string): boolean => {
  return /\d/.test(password);
};

// 특수문자 포함 체크 (백엔드 정규식과 일치)
export const checkPasswordHasSpecial = (password: string): boolean => {
  return /[@$!%*#?&]/.test(password);
};

// 전체 비밀번호 유효성 검사 (백엔드 정규식과 일치)
export const isPasswordValid = (password: string): boolean => {
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return pattern.test(password);
};

// 비밀번호 일치 여부 확인
export const isPasswordMatch = (password: string, passwordConfirm: string) => {
  return password && passwordConfirm && password === passwordConfirm;
};

// 비밀번호 확인 메시지
export const getPasswordConfirmMessage = (password: string, passwordConfirm: string) => {
  if (!passwordConfirm) return '';
  if (password === passwordConfirm) {
    return '비밀번호가 일치합니다.';
  } else {
    return '비밀번호가 일치하지 않습니다.';
  }
};

// 글자 수 표시 함수
export const getLength = (value: string, max: number) => `${value?.length || 0}/${max}자`;
