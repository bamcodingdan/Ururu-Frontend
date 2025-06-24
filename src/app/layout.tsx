import { Inter } from 'next/font/google';
import './globals.css';
import { metadata, viewport } from '@/lib/metadata';

const inter = Inter({ subsets: ['latin'] });

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Android Web App 대응용 */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
