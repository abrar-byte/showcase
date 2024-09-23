'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { ToastContainer } from 'react-toastify';
import { signIn, signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
// import NotFound from '~/app/not-found';
// import Sidebar from './Sidebar';
import dayjs from 'dayjs';
import AuthHeader from './AuthHeader';
import Loading from '@/components/Loading';
import Footer from '@/components/layout/Footer';
import Header from './Header';
import AuthSidebar from './AuthSidebar';
import NotFound from '@/app/not-found';

const allowedForUserRole = ['favorites', 'orders', 'checkout'];

type Props = {
  children: React.ReactNode;
  hideSidebar?: boolean;
  hideHeader?: boolean;
};
export default function AuthLayout({
  children,
  hideSidebar,
  hideHeader, // session,
  ...props
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const session: any = useSession();
  const role = session?.data?.user?.role;

  useEffect(() => {
    if (session?.status === 'unauthenticated') {
      router.push(`/`);
    }
    if (session?.status === 'authenticated' && session?.data?.expires) {
      const intervalId = setInterval(() => {
        const currentTime = dayjs();
        const sessionExpiryTime = dayjs(session?.data?.expires);

        if (currentTime.isAfter(sessionExpiryTime)) {
          // Waktu sesi telah berakhir, lakukan logout
          signOut({ redirect: false });
          clearInterval(intervalId);
        }
      }, 300000); // Cek setiap 5 menit

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [session?.status]);
  const allowed = useMemo(() => {
    if (role === 'USER') {
      // return allowedForUserRole.includes(pathname?.split('/')[1]);
      return !pathname.includes('dashboard');
    }

    return true;
  }, [role, pathname]);

  if (session?.status == 'loading') {
    return <Loading />;
  }

  if (session?.status == 'authenticated' && allowed) {
    return (
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="relative bg-slate-50">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {!hideHeader && (
            <AuthHeader
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          )}
          <div className="flex h-screen">
            {!hideSidebar && (
              <AuthSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            )}
            <div className="relative flex flex-1 flex-col gorent-container overflow-y-auto overflow-x-hidden lg:mx-3">
              <main className="w-full mx-auto  pt-16 mt-10 min-h-screen">
                {children}
              </main>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  } else {
    return <NotFound />;
  }
}
