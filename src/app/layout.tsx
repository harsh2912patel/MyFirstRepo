import type { Metadata } from 'next';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import {Dosis} from 'next/font/google';

const dosis = Dosis({subsets: ['latin'], weight: ['400', '500', '600', '700']});

export const metadata: Metadata = {
  title: 'FinEye',
  description: 'Your personal finance manager',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${dosis.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
