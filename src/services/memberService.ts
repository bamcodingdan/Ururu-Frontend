import api from '@/lib/axios';

export async function checkNicknameDuplicate(nickname: string): Promise<boolean> {
  // 한국어 닉네임을 고려하여 URL 인코딩
  const encodedNickname = encodeURIComponent(nickname);
  const response = await api.get(`/members/nicknames/${encodedNickname}/exists`);
  // exists: true면 중복, false면 사용 가능
  return response.data.data.exists;
}
