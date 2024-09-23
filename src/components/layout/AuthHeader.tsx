import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { User } from '@/types/user';

export default function AuthHeader(props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) {
  // const { hasSidebar, toggleSidebar } = useLayout((state) => state);

  const { data: session } = useSession();
  const user: User = session?.user as any;
  const role = useMemo(() => {
    if (user?.role == 'ADMIN') {
      return 'Administrator';
    } else if (user?.role == 'USER') {
      return 'User';
    } else {
      return 'Unknown';
    }
  }, [user]);
  const burgerClass = `w-[19.5px] h-[1.5px] rounded-full transition ease transform duration-300 bg-black `;

  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200 ">
      <div className="px-3 py-3 lg:px-5 lg:pl-3 gorent-container ">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <div
              className={`flex flex-col h-9 w-min  rounded justify-center items-center group cursor-pointer mr-3 lg:hidden`}
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
            >
              <div
                className={`${burgerClass} ${props.sidebarOpen ? 'rotate-45 translate-y-3 my-auto' : 'my-[3px]'}`}
              />
              <div
                className={`${burgerClass} ${props.sidebarOpen ? 'opacity-0 my-auto' : 'my-[3px]'}`}
              />
              <div
                className={`${burgerClass} ${props.sidebarOpen ? '-rotate-45 -translate-y-3 mt-1 my-auto' : 'my-[3px]'}`}
              />
            </div>

            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-[108px] h-[28px] lg:w-[148px] lg:h-[44px]">
                <Image fill src={'/icons/logo.svg'} alt="logo gorent" />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full"
              src={
                user?.image ||
                'https://flowbite-admin-dashboard.vercel.app/images/users/bonnie-green.png'
              }
              alt="Jese image"
            />
            <div className="flex flex-col text-black">
              <span>{user?.fullname || user?.email}</span>
              <span className="text-xs text-gray-500">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
