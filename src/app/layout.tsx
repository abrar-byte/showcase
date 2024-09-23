import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/autoplay';
import 'react-toastify/dist/ReactToastify.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Providers from '@/providers';

const pjs = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GoRent',
  description: 'The Best Platform for Car Rental',
};

export default function RootLayout({ children, session }: any) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={'/icons/logo.svg'} type="image/*" sizes="any" />
      </head>
      <Providers session={session}>
        <body className={`${pjs.className} bg-neutral-100`}>{children}</body>
      </Providers>
    </html>
  );
}
