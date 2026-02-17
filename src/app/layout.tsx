import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://malloycpa.com'),
  title: {
    default: 'Malloy Accounting LLC — CPA Services in Stockton, CA',
    template: '%s — Malloy Accounting LLC',
  },
  description:
    'Family-owned tax practice servicing individuals and small businesses of the Central Valley. Expert CPA services including tax preparation, planning, and small business accounting.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Malloy Accounting LLC',
    images: [{ url: '/logo.avif', width: 600, height: 600, alt: 'Malloy Accounting LLC' }],
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow bg-white">{children}</main>
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
