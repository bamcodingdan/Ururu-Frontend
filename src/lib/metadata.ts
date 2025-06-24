import type { Metadata } from 'next';

export const siteConfig = {
  name: '우르르',
  description: '뷰티 공동구매 커머스',
  url: 'https://ururu-frontend.vercel.app',
  ogImage: '/og-image.png',
  themeColor: '#ff6986',
  keywords: ['우르르', '뷰티 공동구매', '밤코딩단', '뷰티 공구'],
  authors: [{ name: '우르르' }],
};

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: '밤코딩단',
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: '우르르 OG 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon1.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: siteConfig.themeColor,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
  },
};
