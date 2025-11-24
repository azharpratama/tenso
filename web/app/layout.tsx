import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Tenso | DePIN API Network',
  description: 'Decentralized API Monetization & Payment Network',
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
