import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Tenso | DePIN API Network',
  description: 'Decentralized API Monetization & Payment Network. Built on x402 Protocol and Base.',
  openGraph: {
    title: 'Tenso | DePIN API Network',
    description: 'Decentralized API Monetization & Payment Network. Built on x402 Protocol and Base.',
    url: 'https://tenso.network',
    siteName: 'Tenso',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tenso | DePIN API Network',
    description: 'Decentralized API Monetization & Payment Network. Built on x402 Protocol and Base.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/globe.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0C0D10] text-white">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
