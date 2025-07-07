'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Plus,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, isPositive, icon }: StatCardProps) {
  return (
    <Card className="border-bg-300 bg-bg-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-200">{title}</p>
            <p className="text-2xl font-bold text-text-100">{value}</p>
            <div className="mt-1 flex items-center gap-1">
              <ArrowUpRight
                className={cn('h-4 w-4', isPositive ? 'text-green-500' : 'text-red-500')}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive ? 'text-green-500' : 'text-red-500',
                )}
              >
                {change}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-primary-100 p-3">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonText: string;
}

function QuickActionCard({ title, description, icon, href, buttonText }: QuickActionCardProps) {
  return (
    <Card className="border-bg-300 bg-bg-100">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary-100 p-3">{icon}</div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-text-100">{title}</h3>
            <p className="mb-4 text-sm text-text-200">{description}</p>
            <Link href={href}>
              <Button className="bg-primary-300 text-text-on hover:bg-primary-200">
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SellerDashboard() {
  return <div className="space-y-6 p-6"></div>;
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
