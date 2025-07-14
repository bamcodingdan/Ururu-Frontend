import { useState, useEffect, useCallback } from 'react';
import { useSafeSearchParams, useSafeRouter } from '@/hooks';
import { mockAddressData, AddressData } from '@/data/address';
import { postShippingAddress } from '@/services/memberService';

export const useAddress = () => {
  const router = useSafeRouter();
  const searchParams = useSafeSearchParams();
  const addressId = searchParams.get('id');
  const isEditMode = Boolean(addressId);

  const [addressData, setAddressData] = useState<Omit<AddressData, 'id'>>({
    addressName: '',
    isDefault: false,
    phone: '',
    zonecode: '',
    address1: '',
    address2: '',
    addressDetail: '',
  });

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && addressId && mockAddressData[Number(addressId)]) {
      const existingData = mockAddressData[Number(addressId)];
      const { id, ...dataWithoutId } = existingData;
      setAddressData(dataWithoutId);
    }
  }, [isEditMode, addressId]);

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setAddressData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isEditMode) {
        // 수정 모드는 아직 미구현
        router.push('/mypage/address');
        return;
      }
      try {
        await postShippingAddress({
          label: addressData.addressName,
          phone: addressData.phone,
          zonecode: addressData.zonecode,
          address1: addressData.address1,
          address2: addressData.address2,
          isDefault: addressData.isDefault,
        });
        router.push('/mypage/address');
      } catch (err) {
        alert('배송지 등록에 실패했습니다.');
        console.error('배송지 등록 오류:', err);
      }
    },
    [addressData, router, isEditMode],
  );

  const resetForm = useCallback(() => {
    setAddressData({
      addressName: '',
      isDefault: false,
      phone: '',
      zonecode: '',
      address1: '',
      address2: '',
      addressDetail: '',
    });
  }, []);

  return {
    addressData,
    isEditMode,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
};
