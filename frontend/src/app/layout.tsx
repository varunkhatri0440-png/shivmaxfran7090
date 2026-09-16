import type { Metadata, Viewport } from 'next';
import { Cinzel, Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import './globals.css';

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#060709',
};

export const metadata: Metadata = {
  title: 'SHIVMAX REAL ESTATE PRIVATE LIMITED',
  description:
    'Experience eternal architectural mastery in Vadodara, Gujarat. Bespoke Vastu-harmonized compounds, sky penthouses, and sovereign private sanctuaries by SHIVMAX REAL ESTATE PRIVATE LIMITED.',
  icons: {
    icon: [
      { url: '/logo/shivmax-crest-hd.png', type: 'image/png' },
      { url: '/logo/shivmax-crest-transparent.png', type: 'image/png' },
    ],
    shortcut: '/logo/shivmax-crest-hd.png',
    apple: '/logo/shivmax-crest-hd.png',
  },
  keywords: [
    'vadodara luxury real estate',
    'vadodara penthouses',
    'alkapuri luxury homes',
    'sevasi private estates',
    'bhayli luxury villas',
    'vastu architecture vadodara',
    'gujrera vadodara',
    'shivmax real estate',
    'shivmax vadodara',
    'sovereign living',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${playfair.variable} ${plusJakartaSans.variable} dark scroll-smooth`}>
      <head>
        <link rel="icon" href="/logo/shivmax-crest-hd.png" type="image/png" />
        <link rel="shortcut icon" href="/logo/shivmax-crest-hd.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo/shivmax-crest-hd.png" />
      </head>
      <body className="font-sans bg-[#060709] text-[#ededed] antialiased overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
