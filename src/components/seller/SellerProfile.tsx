'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, User, Mail, Phone, MapPin, Building, Key, Trash2, Camera } from 'lucide-react';
import Image from 'next/image';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  bio: string;
  profileImage: string;
  address: string;
  businessNumber: string;
}

export function SellerProfile() {
  return <div className="space-y-6 p-6"></div>;
}
