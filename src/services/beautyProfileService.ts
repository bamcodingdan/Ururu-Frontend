import api from '@/lib/axios';

export interface BeautyProfileRequest {
  skinType: string;
  skinTone: string;
  concerns: string[];
  hasAllergy: boolean;
  allergies: string[];
  interestCategories: string[];
  minPrice: number;
  maxPrice: number;
  additionalInfo: string;
}

export async function updateBeautyProfile(data: BeautyProfileRequest) {
  const response = await api.patch('/members/beauty-profile', data);
  return response.data;
}
