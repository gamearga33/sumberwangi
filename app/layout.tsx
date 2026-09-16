import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sumber Wangi — Sentuhan Keharuman Abadi | Koleksi Parfum Mewah',
  description:
    'Brand parfum artisanal Indonesia dengan bibit wewangian premium berkonsentrasi tinggi, tahan hingga 14+ jam. Temukan aroma khas Anda untuk pria, wanita, dan unisex.',
  keywords: [
    'Sumber Wangi',
    'parfum lokal',
    'parfum pria',
    'parfum wanita',
    'parfum tahan lama',
    'parfum oud',
    'minyak wangi mewah',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-500/30 selection:text-amber-950 dark:bg-stone-950 dark:text-stone-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
