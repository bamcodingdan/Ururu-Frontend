// 유효성 검사 관련 상수들
export const VALIDATION_CONSTANTS = {
  // 비밀번호 관련
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
    SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/,
    LETTERS: /[a-zA-Z]/,
    NUMBERS: /[0-9]/,
  },

  // 입력 필드 최대 길이
  MAX_LENGTHS: {
    NICKNAME: 14,
    BRAND: 20,
    COMPANY: 20,
    CEO: 20,
    BUSINESS_NUMBER: 10,
    PHONE: 11,
    EMAIL: 100,
  },

  // 전화번호 관련
  PHONE: {
    MAX_LENGTH: 11,
    FORMATTED_MAX_LENGTH: 13,
  },

  // 사업자등록번호 관련
  BUSINESS_NUMBER: {
    MAX_LENGTH: 10,
    FORMATTED_MAX_LENGTH: 12,
  },

  // 생년월일 관련
  BIRTH: {
    MIN_YEAR: 1900,
    MAX_YEAR: new Date().getFullYear(),
  },
} as const;

// 성별 옵션
export const GENDER_OPTIONS = [
  { label: '여성', value: 'female' },
  { label: '남성', value: 'male' },
  { label: '선택 안함', value: 'none' },
] as const;

// 피부 타입 옵션
export const SKIN_TYPE_OPTIONS = [
  { label: '지성', value: 'oily' },
  { label: '건성', value: 'dry' },
  { label: '복합성', value: 'combination' },
  { label: '민감성', value: 'sensitive' },
  { label: '약건성', value: 'slightly_dry' },
  { label: '트러블성', value: 'trouble' },
  { label: '중성', value: 'normal' },
] as const;

// 피부 톤 옵션
export const SKIN_TONE_OPTIONS = [
  { label: '쿨톤', value: 'cool' },
  { label: '웜톤', value: 'warm' },
  { label: '봄웜톤', value: 'spring_warm' },
  { label: '여름쿨톤', value: 'summer_cool' },
  { label: '가을웜톤', value: 'autumn_warm' },
  { label: '겨울쿨톤', value: 'winter_cool' },
  { label: '뉴트럴톤', value: 'neutral' },
] as const;

// 피부 고민 옵션
export const SKIN_CONCERN_OPTIONS = [
  { label: '잡티', value: 'blemishes' },
  { label: '미백', value: 'whitening' },
  { label: '주름', value: 'wrinkles' },
  { label: '각질', value: 'dead_skin' },
  { label: '트러블', value: 'trouble' },
  { label: '민감성', value: 'sensitive' },
  { label: '블랙헤드', value: 'blackheads' },
  { label: '피지과다', value: 'excess_oil' },
  { label: '모공', value: 'pores' },
  { label: '탄력', value: 'elasticity' },
  { label: '홍조', value: 'redness' },
  { label: '아토피', value: 'atopy' },
  { label: '다크서클', value: 'dark_circles' },
  { label: '없음', value: 'none' },
] as const;

// 이상 경험 여부 옵션
export const SKIN_REACTION_OPTIONS = [
  { label: '있음', value: 'yes' },
  { label: '없음', value: 'no' },
] as const;

// 관심 카테고리 옵션
export const INTEREST_CATEGORY_OPTIONS = [
  { label: '스킨케어', value: 'skincare' },
  { label: '마스크팩', value: 'mask' },
  { label: '클렌징', value: 'cleansing' },
  { label: '선케어', value: 'suncare' },
  { label: '메이크업', value: 'makeup' },
  { label: '향수', value: 'perfume' },
  { label: '헤어케어', value: 'haircare' },
  { label: '바디케어', value: 'bodycare' },
  { label: '없음', value: 'none' },
] as const;

// 약관 동의 기본값
export const DEFAULT_AGREEMENTS = {
  terms: true,
  privacy: true,
  marketing: false,
  location: false,
};
