import { Fragment, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, ArrowRightIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../AuthContext';
import Notification from '../Notification/Notification';

const navigation = [
  { name: 'Task Management', href: '/tasks', dropdown: true },
  { name: "Client Management", href: "/clients" },
  { name: "Expense Tracker", href: "/expense" },
  { name: "History", href: "/history" },
  { name: 'Notes', href: '/notes', dropdown: true },
  { name: 'More', href: '/more', dropdown: true }
];

const Navbar = () => {
  const id = localStorage.getItem('userId')

  const [isLogin, setIsLogin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home or any preferred route
  };

  const Onlogin = () => {
    if (localStorage.getItem('token')) {
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
  }

  useEffect(() => {
    Onlogin()
  }, [localStorage.getItem('token'), localStorage.getItem('userId')])


  return (
    <header className="absolute inset-x-0 top-0 z-50" style={{
      position: "fixed"
    }}>
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-6">
        <div className="flex lg:flex-1">
          <span className="p-2 flex lg:flex-1">
            <span className="-m-1.5 p-1.5 flex" onClick={handleLinkClick}>
              <span className="sr-only">RitualPlanner</span>
              <NavLink to="/" className='flex'><img
                alt="RitualPlanner"
                src="https://i.ibb.co/wS8fFBn/logo-color.png"
                className="h-8 w-auto"
              />
                <span
                  style={{
                    padding: '4px',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    color: 'rgb(17, 24, 39)',
                    lineHeight: '24px',
                    fontSize: '20px',
                    letterSpacing: '1.5px',
                  }}
                >
                  RitualPlanner
                </span></NavLink>
            </span>
          </span>
        </div>

        <div className="flex lg:hidden gap-2">
        <NavLink to="/notifications"><abbr title="Notifications"><BellIcon className="cursor-pointer h-8 w-8 font-bold text-black border border-gray-700 rounded-full p-1 " ></BellIcon></abbr></NavLink>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-20">
          {navigation.map((item) =>
            item.dropdown && item.name === 'Notes' ? (
              <Menu as="div" className="relative inline-block text-left" key={item.name}>
                <div>
                  <Menu.Button className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center">
                    {item.name}
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none font-bold tracking-wide">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/notes/create"
                            className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm`}
                            onClick={handleLinkClick}
                          >
                            Create Note
                          </NavLink>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/notes/all"
                            className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm`}
                            onClick={handleLinkClick}
                          >
                            All Notes
                          </NavLink>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

            ) : (
              item.name === "Task Management" ? <Menu as="div" className="relative inline-block text-left" key={item.name}>
                <div>
                  <Menu.Button className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center">
                    {item.name}
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none font-bold tracking-wide">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/tasks"
                            className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm`}
                            onClick={handleLinkClick}
                          >
                            Task Dashboard
                          </NavLink>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/calendar-view"
                            className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } block px-4 py-2 text-sm`}
                            onClick={handleLinkClick}
                          >
                            Calendar View
                          </NavLink>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
                : (item.name === 'More' ? <Menu as="div" className="relative inline-block text-left" key={item.name}>
                  <div>
                    <Menu.Button className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center">
                      {item.name}
                      <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="font-bold tracking-wide absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink
                              to="/bookings"
                              className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } block px-4 py-2 text-sm`}
                              onClick={handleLinkClick}
                            >
                              Advance Bookings
                            </NavLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink
                              to="/about"
                              className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } block px-4 py-2 text-sm`}
                              onClick={handleLinkClick}
                            >
                              About Us
                            </NavLink>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink
                              to="/contact"
                              className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } block px-4 py-2 text-sm`}
                              onClick={handleLinkClick}
                            >
                              Contact Us
                            </NavLink>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                  : (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className="text-sm font-semibold leading-6 text-gray-900"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </NavLink>
                  )
                )))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isLogin ? (
            <Menu as="div" className="relative inline-block text-left">
              <div className='flex gap-4'>
                <NavLink to="/notifications"><abbr title="Notifications"><BellIcon className="cursor-pointer h-8 w-8 font-bold text-black border border-gray-700 rounded-full p-1 " ></BellIcon></abbr></NavLink>
                <Menu.Button className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item className="font-bold">
                      {({ active }) => (
                        <NavLink
                          to={`/profile/${id}/dashboard`}
                          className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block w-full text-left px-4 py-2 text-sm`}
                        >
                          Dashboard
                        </NavLink>
                      )}
                    </Menu.Item>
                    <Menu.Item className="font-bold">
                      {({ active }) => (
                        <NavLink
                          to={`/profile/${id}`}
                          className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block px-4 py-2 text-sm`}
                          onClick={handleLinkClick}
                        >
                          Profile
                        </NavLink>
                      )}
                    </Menu.Item>
                    <Menu.Item className="font-bold">
                      {({ active }) => (
                        <NavLink
                          to={`/profile/${id}/setting`}
                          className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block w-full text-left px-4 py-2 text-sm`}
                        >
                          Setting
                        </NavLink>
                      )}
                    </Menu.Item>
                    <Menu.Item className="font-bold">
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block w-full text-left px-4 py-2 text-sm`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <NavLink to="/login">
              <button className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center">
                Log in / SignUp <ArrowRightIcon className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </button>
            </NavLink>
          )}
        </div>
      </nav>

      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <DialogPanel focus="true" className="fixed inset-0 z-50 overflow-y-auto bg-white px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="p-2 flex lg:flex-1">
              <NavLink to="/" className="-m-1.5 p-1.5 flex">
                <span className="sr-only">RitualPlanner</span>
                <img alt="RitualPlanner" src="https://i.ibb.co/wS8fFBn/logo-color.png" className="h-8 w-auto" />
                <span
                  style={{
                    padding: '4px',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    color: 'rgb(17, 24, 39)',
                    lineHeight: '24px',
                    fontSize: '20px',
                    letterSpacing: '1.5px',
                  }}
                >
                  RitualPlanner
                </span>
              </NavLink>
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) =>
                  item.dropdown && item.name === 'Notes' ? (
                    <Menu as="div" className="relative flex flex-col text-left pt-2" key={item.name}>
                      <div>
                        <Menu.Button className="font-semibold leading-6 text-gray-900 inline-flex items-center -m-2.5 p-2.5 text-base">
                          {item.name}
                          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 left-1 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink
                                  to="/notes/create"
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block px-4 py-2 text-sm`}
                                  onClick={handleLinkClick}
                                >
                                  Create Note
                                </NavLink>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink
                                  to="/notes/all"
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block px-4 py-2 text-sm`}
                                  onClick={handleLinkClick}
                                >
                                  All Notes
                                </NavLink>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : item.name === "Task Management" ? (
                    <Menu as="div" className="relative inline-block text-left pb-3" key={item.name}>
                      <div>
                        <Menu.Button className="font-semibold leading-6 text-gray-900 inline-flex items-center -m-2.5 p-2.5 text-base">
                          {item.name}
                          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 left-1 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink
                                  to="/tasks"
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block px-4 py-2 text-sm`}
                                  onClick={handleLinkClick}
                                >
                                  Task Dashboard
                                </NavLink>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink
                                  to="/"
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block px-4 py-2 text-sm`}
                                  onClick={handleLinkClick}
                                >
                                  Calendar View
                                </NavLink>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : item.name === "More" ? (
                    <Menu as="div" className="relative inline-block text-left pt-4" key={item.name}>
                      <div>
                        <Menu.Button className="font-semibold leading-6 text-gray-900 inline-flex items-center -m-2.5 p-2.5 text-base">
                          {item.name}
                          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 left-1 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink
                                  to="/bookings"
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block px-4 py-2 text-sm`}
                                  onClick={handleLinkClick}
                                >
                                  Advance Bookings
                                </NavLink>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink
                                  to="/about"
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block px-4 py-2 text-sm`}
                                  onClick={handleLinkClick}
                                >
                                  About Us
                                </NavLink>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink
                                  to="/contact"
                                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block px-4 py-2 text-sm`}
                                  onClick={handleLinkClick}
                                >
                                  Contact Us
                                </NavLink>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className="-m-2.5 block p-2.5 py-2.5 text-base font-semibold leading-6 text-gray-900"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </NavLink>
                  )
                )}
              </div>
              <div className="py-6">
                {isLogin ? (
                  <>
                    <span className='flex flex-col space-y-2'>
                      <Menu as="div" className="relative inline-block text-left">
                        <div>
                          
                          <Menu.Button className="font-semibold leading-6 text-gray-900 inline-flex items-center -m-2.5 p-2.5 text-base">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                            <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 left-1 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <NavLink
                                    to={`profile/${id}/dashboard`}
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } block px-4 py-2 text-sm`}
                                    onClick={handleLinkClick}
                                  >
                                    Dashboard
                                  </NavLink>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <NavLink
                                    to="/profile"
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } block px-4 py-2 text-sm`}
                                    onClick={handleLinkClick}
                                  >
                                    Profile
                                  </NavLink>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <NavLink
                                    to="/settings"
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } block px-4 py-2 text-sm`}
                                    onClick={handleLinkClick}
                                  >
                                    Settings
                                  </NavLink>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <NavLink
                                    to="/logout"
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } block px-4 py-2 text-sm`}
                                    onClick={handleLinkClick}
                                  >
                                    Logout
                                  </NavLink>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </span>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="-m-2.5 block p-2.5 text-base font-semibold leading-6 text-gray-900"
                      onClick={handleLinkClick}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="-m-2.5 block p-2.5 text-base font-semibold leading-6 text-gray-900"
                      onClick={handleLinkClick}
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Navbar;
