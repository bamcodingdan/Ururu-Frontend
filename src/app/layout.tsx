import { Inter } from 'next/font/google';
import { metadata } from '@/lib/metadata';
import { HeadTags } from '@/components/layout/head-tags';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <HeadTags />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
