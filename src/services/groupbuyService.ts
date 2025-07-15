import api from '@/lib/axios';
import type { GroupBuyTop3Response, GroupBuyCreateResponse } from '@/types/groupbuy';

export async function fetchGroupBuyTop3(): Promise<GroupBuyTop3Response> {
  const res = await api.get<GroupBuyTop3Response>('/groupbuys/top3');
  return res.data;
}

export async function fetchGroupBuyCategoryTop6(categoryId: number): Promise<GroupBuyTop3Response> {
  const res = await api.get<GroupBuyTop3Response>(`/groupbuys/${categoryId}/top6`);
  return res.data;
}

export async function fetchGroupBuyCreateData(): Promise<GroupBuyCreateResponse> {
  const res = await api.get<GroupBuyCreateResponse>('/groupbuys/create');
  return res.data;
}

// 공동구매 등록 API (multipart/form-data)
export async function createGroupBuy({
  request,
  thumbnail,
  detailImages,
}: {
  request: any; // 실제 타입은 GroupBuyCreateRequest
  thumbnail: File;
  detailImages: File[];
}): Promise<any> {
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
  formData.append('thumbnail', thumbnail);
  detailImages.forEach((file) => formData.append('detailImages', file));

  const res = await api.post('/groupbuys', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
