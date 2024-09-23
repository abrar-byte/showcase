import React, {
  ReactNode,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import Button from '@/components/Button';
import Image from 'next/image';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import Chevrondown from '@/components/icons/Chevrondown';
import LogoutIcon from '@/components/icons/LogoutIcon';
import DashboardIcon from '@/components/icons/DashboardIcon';
import CarIcon from '@/components/icons/CarIcon';
import OrderIcon from '@/components/icons/OrderIcon';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import GarageIcon from '@/components/icons/GarageIcon';
import OrderManageIcon from '@/components/icons/OrderManageIcon';

interface SidemenuGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
}

const menus = [
  {
    group: '',
    items: [
      { icon: <DashboardIcon />, label: 'Dashboard', href: '/dashboard' },
    ],
    role: ['ADMIN'],
  },
  {
    group: '',
    items: [
      { icon: <GarageIcon />, label: 'Garages', href: '/dashboard/garages' },
    ],
    role: ['ADMIN'],
  },
  {
    group: '',
    items: [{ icon: <CarIcon />, label: 'Cars', href: '/dashboard/cars' }],
    role: ['ADMIN'],
  },

  {
    group: '',
    items: [
      { icon: <OrderManageIcon />, label: 'Orders', href: '/dashboard/orders' },
    ],
    role: ['ADMIN'],
  },

  {
    group: '',
    items: [
      { icon: <FavoriteIcon />, label: 'My Favorites', href: '/favorites' },
    ],
    role: ['ADMIN', 'USER'],
  },

  {
    group: '',

    items: [{ icon: <OrderIcon />, label: 'My Orders', href: '/orders' }],
    role: ['ADMIN', 'USER'],
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export default function AuthSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const session: any = useSession();
  const roleSession = session?.data?.user?.role;
  // if (role === 'USER') {
  //   adminMenus[0].items = [];
  // }

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    setSidebarExpanded(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
    );
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);
  const filteredMenus = menus.filter(({ role }) => role.includes(roleSession));

  return (
    <>
      {sidebarOpen && (
        <div className="bg-black/50 fixed w-full h-full z-[19] top-0" />
      )}
      <aside
        ref={sidebar}
        className={`absolute left-0 top-0 py-6 z-20 border-r border-gray-200 flex h-screen w-64  flex-col justify-between  overflow-y-auto  text-gray-900 bg-white duration-300 ease-linear  lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between lg:justify-center  gap-2 px-4 pt-10">
            <button
              ref={trigger}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              className="block lg:hidden text-xl opacity-50"
            >
              <ArrowBackIcon className="w-6 h-6 stroke-gray-900" />
            </button>
          </div>

          <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear ">
            <nav className="py-4 px-4 lg:px-6 space-y-2">
              {filteredMenus.map(({ group, items }, idx) => (
                <div key={idx}>
                  <h3 className="mb-4 ml-4  font-semibold opacity-50">
                    {group}
                  </h3>
                  <ul className="mb-6 flex flex-col gap-1.5">
                    {items.map((menu, i) => {
                      // const active = pathname?.startsWith(`${menu.href}`);
                      const active = pathname?.includes(menu.href);
                      /* @ts-ignore */
                      return !menu?.subs ? (
                        <li key={i}>
                          <Link
                            href={`${menu.href}`}
                            className={`group capitalize relative flex !items-center gap-2.5 rounded-lg py-2 px-4 font-medium duration-300 ease-in-out text-gray-900 hover:text-white hover:bg-primary   ${
                              active ? 'bg-primary text-white' : ''
                            }`}
                          >
                            {cloneElement(menu.icon, {
                              className: `w-5 h-5 group-hover:fill-white ${
                                active ? 'fill-white' : 'fill-gray-900'
                              }`,
                            })}
                            <span className=""> {menu.label}</span>
                          </Link>
                        </li>
                      ) : (
                        <SideMenuGroup
                          key={i}
                          activeCondition={
                            active || pathname.includes(menu.href)
                          }
                        >
                          {(handleClick, open) => {
                            const activeTitle =
                              pathname.includes(menu.href) || active;
                            return (
                              <>
                                <button
                                  className={`group capitalize relative flex w-full items-center justify-between gap-2.5 rounded-lg py-2 px-4 font-medium  duration-300 ease-in-out text-gray-900 hover:bg-primary  ${
                                    activeTitle ? 'bg-primary text-white' : ''
                                  } `}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    sidebarExpanded
                                      ? handleClick()
                                      : setSidebarExpanded(true);
                                  }}
                                >
                                  <div className="flex items-center gap-4 ">
                                    {cloneElement(menu.icon, {
                                      className: `w-5 h-5 group-hover:fill-white ${
                                        activeTitle
                                          ? 'fill-white'
                                          : 'fill-gray-900'
                                      }`,
                                    })}
                                    {menu.label}
                                  </div>
                                  <Chevrondown
                                    className={`stroke-gray-900 w-5 h-5 ${open ? 'rotate-180' : ''}`}
                                  />
                                </button>
                                <div
                                  className={`translate transform overflow-hidden ${
                                    !open && 'hidden'
                                  }`}
                                >
                                  <div className="mt-2 mb-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                    {
                                      /* @ts-ignore */
                                      menu?.subs &&
                                        /* @ts-ignore */
                                        menu?.subs?.map((sub, i2) => (
                                          <Link
                                            key={i}
                                            href={menu.href + sub.href}
                                            className={`group capitalize relative flex items-center gap-2.5 rounded-lg px-4  duration-300 ease-in-out hover:text-gray-900  hover:font-bold hover:opacity-100 ${
                                              pathname == menu.href + sub.href
                                                ? 'text-gray-900 opacity-100 font-bold'
                                                : 'opacity-50'
                                            } `}
                                          >
                                            {sub.label}
                                          </Link>
                                        ))
                                    }
                                  </div>
                                </div>
                                {/* <!-- Dropdown Menu End --> */}
                              </>
                            );
                          }}
                        </SideMenuGroup>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <Button
          variant="danger"
          className="mx-3"
          // className="flex gap-3 items-center justify-center text-gray-900  bg-primary font-bold w-min mx-auto py-3 px-5 rounded-xl whitespace-nowrap"
          onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
          icon={<LogoutIcon className="fill-white w-5 h-5" />}
        >
          Log out
        </Button>
      </aside>
    </>
  );
}

function SideMenuGroup({ children, activeCondition }: SidemenuGroupProps) {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <li>{children(handleClick, open)}</li>;
}
