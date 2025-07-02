'use client';

import React, { useState } from 'react';
import { MyPageLayout } from '@/components/mypage/MyPageLayout';
import { ReviewWriteForm } from '@/components/mypage/review/ReviewWriteForm';

export default function ReviewWritePage() {
  return (
    <MyPageLayout>
      <ReviewWriteForm />
    </MyPageLayout>
  );
}
