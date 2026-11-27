import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@yuhshi/tokens/tokens.css';
import './globals.css';

const figtree = localFont({
  src: [
    { path: './fonts/Figtree_400Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/Figtree_600SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/Figtree_700Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yuhshi.com'),
  title: 'Yuhshi: Don’t collect followers. Collect the world.',
  description:
    'Meet real people from all 195 countries through short cultural exchanges. Collect stamps in your passport, learn words and make friends across the world. Free, safe and built for every phone.',
  alternates: { canonical: '/' },
  icons: { icon: [{ url: '/yuhshi-favicon-light.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }], apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    siteName: 'Yuhshi',
    title: 'Yuhshi: Don’t collect followers. Collect the world.',
    description: 'Meet real people from all 195 countries through short cultural exchanges.',
    url: 'https://yuhshi.com',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#171923' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={figtree.variable}>
      <body>{children}</body>
    </html>
  );
}
