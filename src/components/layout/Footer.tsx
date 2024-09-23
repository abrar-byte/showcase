import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const menus = [
  {
    title: 'About',
    items: [
      { href: '#', name: 'How it works' },
      { href: '#', name: 'Featured' },
      { href: '#', name: 'Partnership' },
      { href: '#', name: 'Bussiness Relation' },
    ],
  },
  {
    title: 'Community',
    items: [
      { href: '#', name: 'Events' },
      { href: '#', name: 'Blog' },
      { href: '#', name: 'Podcast' },
      { href: '#', name: 'Invite a friend' },
    ],
  },
  {
    title: 'Socials',
    items: [
      { href: '#', name: 'Discord' },
      { href: '#', name: 'Instagram' },
      { href: '#', name: 'Twitter' },
      { href: '#', name: 'Facebook' },
    ],
  },
];

export default function Footer() {
  return (
    <div className="bg-white shadow pt-10 pb-5 w-full">
      <div className="wrapper ">
        <div className="gorent-container space-y-5 ">
          <div className="grid lg:flex justify-between gap-7 pb-5 w-full">
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-[108px] h-[28px] lg:w-[148px] lg:h-[44px]">
                  <Image fill src={'/icons/logo.svg'} alt="logo gorent" />
                </div>
              </Link>
              <p className="text-neutral-900/60 font-medium w-72">
                Our vision is to provide convenience and help increase your
                sales business.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
              {menus.map((menu, iMenu) => {
                return (
                  <div key={iMenu} className="space-y-5">
                    <h3 className="text-gray-900 text-xl font-semibold mb-10">
                      {menu.title}
                    </h3>
                    <div className="grid gap-4">
                      {menu.items.map((item, iItem) => (
                        <Link
                          href={item.href}
                          key={iItem}
                          className="text-neutral-900/60 font-medium hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid lg:flex  justify-between items-center gap-5 border-t border-neutral-900/20 py-5">
            <p className="text-gray-900 font-semibold order-2 lg:order-1">
              &#169;2022 GORENT. All rights reserved
            </p>
            <div className="flex items-center gap-5 order-1 lg:order-2">
              <Link
                href={'#'}
                className="text-gray-900 font-semibold hover:text-blue-600"
              >
                Privacy & Policy
              </Link>
              <Link
                href={'#'}
                className="text-gray-900 font-semibold hover:text-blue-600"
              >
                Terms & Condition
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
