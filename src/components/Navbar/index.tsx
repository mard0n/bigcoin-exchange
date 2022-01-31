import { Menu, Transition } from '@headlessui/react';
import React, { FC, Fragment, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import useStore from '../../state';

const CustomNavLink = ({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `pr-6 hover:text-black ${isActive ? 'text-bold' : 'text-gray-500'}`
    }
  >
    {children}
  </NavLink>
);

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => {
  const { isAuth, username } = useStore((state: any) => ({
    isAuth: state.isAuth,
    username: state.username,
  }));
  return (
    <header className="bg-white border-b sticky top-0 z-20">
      <div className="container mx-auto flex h-20 justify-between items-center">
        <div className="flex items-center">
          <div className="uppercase font-bold text-xl">BigCoin Exchange</div>
          <nav className="ml-14">
            <CustomNavLink to="/">Home</CustomNavLink>
            <CustomNavLink to="/trade">Trade</CustomNavLink>
          </nav>
        </div>
        {isAuth ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2">
                  <div className="text-xl font-semibold text-gray-800">
                    Hi, {username}
                  </div>
                  <div className="text-sm text-gray-400">Welcome back!</div>
                </div>
                <div className="px-4 py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={active ? 'font-semibold' : 'font-norm'}
                        onClick={() => {
                          useStore.setState({ isAuth: false, username: '' });
                        }}
                      >
                        Log out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <CustomNavLink to="/login">Log in</CustomNavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
