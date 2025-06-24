import { Inter } from 'next/font/google';
import { metadata } from '@/lib/metadata';
import { viewport } from '@/lib/viewport';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
