'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Filter from '@/components/icons/Filter';

import Search from '@/components/icons/Search';
import useToggle from '@/stores/toggle';
import Modal from '@/components/Modal';
import Login from '@/components/Login';
import Button from '../Button';
import useDialog from '@/stores/dialog';
import { signOut, useSession } from 'next-auth/react';

import SettingIcon from '../icons/SettingIcon';
import { User } from '@/types/user';
import PersonLineIcon from '../icons/PersonLineIcon';

const menus = [
  { label: 'Home', href: '/' },
  { label: 'Cars', href: '/cars' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const session = useSession();
  const user: User = session?.data?.user as any;
  const isAdmin = user?.role === 'ADMIN';

  const { toggleSidebar } = useToggle((state) => state);
  const { dialog, setDialog } = useDialog();

  const searchParams = useSearchParams();

  const pathname = usePathname();
  const router = useRouter();
  const burgerClass = `w-[19.5px] h-[1.5px] rounded-full transition ease transform duration-300 bg-black `;

  const handleToggle = (e: any) => {
    e.stopPropagation();
    if (!pathname.split('/')[1]) {
      router.push('/cars');
    }
    toggleSidebar();
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    // const query = transformObjectToQueryString({
    //   search: e.target.search.value,
    //   search_keys: 'make,model,name',
    // });
    router.push(`${pathname}?search=${e.target.search.value}`, {
      scroll: false,
    } as any);
  };

  return (
    <section className=" bg-white sticky shadow z-50 w-full">
      <div className="wrapper">
        <div className="py-5 space-y-5 ">
          <div className="gorent-container">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 lg:gap-5">
              <button
                className="lg:hidden flex flex-col h-9 w-min rounded justify-center items-center group cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div
                  className={`${burgerClass} ${
                    isOpen ? 'rotate-45 translate-y-3 my-auto' : 'my-[3px]'
                  }`}
                />
                <div
                  className={`${burgerClass} ${
                    isOpen ? 'opacity-0 my-auto' : 'my-[3px]'
                  }`}
                />
                <div
                  className={`${burgerClass} ${
                    isOpen
                      ? '-rotate-45 -translate-y-3 mt-1 my-auto'
                      : 'my-[3px]'
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  className="relative lg:hidden"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="fixed inset-0 z-[90] bg-black/50" />
                  <div className="absolute top-0 left-0 z-[999] bg-white w-full p-5 flex flex-col items-end gap-7 border-b border-primary">
                    {menus.map((menu, index) => (
                      <Link
                        key={index}
                        href={menu.href}
                        className={
                          (index === 0 && pathname === menu.href) ||
                          (index !== 0 && pathname.includes(menu.href))
                            ? 'text-primary'
                            : ''
                        }
                      >
                        {menu.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-5">
                <div className="flex items-center gap-8">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-[108px] h-[28px] lg:w-[148px] lg:h-[44px]">
                      <Image fill src={'/icons/logo.svg'} alt="logo gorent" />
                    </div>
                  </Link>
                  {menus.map((menu, index) => (
                    <Link
                      key={index}
                      href={menu.href}
                      className={`${
                        (index === 0 && pathname === menu.href) ||
                        (index !== 0 && pathname.includes(menu.href))
                          ? 'text-primary'
                          : ''
                      } hidden lg:block text-sm font-semibold hover:text-primary`}
                    >
                      {menu.label}
                    </Link>
                  ))}
                </div>

                {!pathname?.includes('payment') && (
                  <div className="flex gap-5 items-center justify-center">
                    <form
                      onSubmit={handleSearch}
                      className="h-12 gorent-container min-w-[263px] w-full p-2 lg:p-4 rounded-lg border border-slate-300/40 flex items-center bg-transparent"
                    >
                      <button
                        type="submit"
                        className="fill-slate-500 hover:fill-primary w-5 h-5 lg:w-6 lg:h-6"
                      >
                        <Search className="cursor-pointer fill-slate-500 hover:fill-primary w-5 h-5 lg:w-6 lg:h-6" />
                      </button>
                      <input
                        type="search"
                        name="search"
                        defaultValue={searchParams.get('search') || ''}
                        placeholder="Search something here"
                        className="grow pl-2 lg:pl-auto ring-0 border-none outline-none bg-transparent text-sm text-slate-500"
                      />
                    </form>
                    {pathname?.split('/')[1] === 'cars' && (
                      <button
                        onClick={handleToggle}
                        className="w-14 h-10 rounded-lg flex lg:hidden items-center justify-center cursor-pointer border border-slate-300/40"
                      >
                        <Filter className="stroke-slate-500 hover:stroke-primary w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {session?.status == 'unauthenticated' ? (
                <Button variant="primary" onClick={() => setDialog(true)}>
                  Login
                </Button>
              ) : (
                <Link
                  href={isAdmin ? `/dashboard` : `/favorites`}
                  className="flex items-center gap-1 group"
                >
                  {isAdmin ? (
                    <SettingIcon className="fill-gray-900 w-6 h-6 group-hover:fill-primary" />
                  ) : (
                    <PersonLineIcon className="fill-gray-900 w-6 h-6 group-hover:fill-primary" />
                  )}
                  <span className="text-sm font-semibold group-hover:text-primary">
                    {isAdmin ? 'Dashboard' : 'Me'}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {dialog && (
        <Modal dialogProps={[dialog, setDialog]}>
          <Login setDialog={setDialog} />
        </Modal>
      )}
    </section>
  );
}

// const Burger = ({ isOpen, setIsOpen }: any) => {
//   const genericHamburgerLine = `w-[19.5px] h-[1.5px] rounded-full bg-black transition ease transform duration-300`;

//   return (
//     <button
//       className="flex flex-col h-9 w-min  rounded justify-center items-center group  "
//       onClick={() => setIsOpen(!isOpen)}
//     >
//       <div
//         className={`${genericHamburgerLine} ${
//           isOpen ? 'rotate-45 translate-y-3 my-auto' : 'my-[3px]'
//         }`}
//       />
//       <div
//         className={`${genericHamburgerLine} ${
//           isOpen ? 'opacity-0 my-auto' : 'my-[3px]'
//         }`}
//       />
//       <div
//         className={`${genericHamburgerLine} ${
//           isOpen ? '-rotate-45 -translate-y-3 mt-1 my-auto' : 'my-[3px]'
//         }`}
//       />
//     </button>
//   );
// };
