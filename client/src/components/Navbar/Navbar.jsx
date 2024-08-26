import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Dialog, DialogPanel, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Task Management', href: '/tasks' },
  { name: 'Notes', href: '/notes', dropdown: true },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' }
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <span className='p-2 flex lg:flex-1'>
            <NavLink to="/" className="-m-1.5 p-1.5 flex">
              <span className="sr-only">RitualPlanner</span>
              <img
                alt="RitualPlanner"
                src="https://i.ibb.co/wS8fFBn/logo-color.png"
                className="h-8 w-auto"
              />
              <span style={{
                padding: "4px",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontStyle: "normal",
                fontWeight: "600",
                color: `rgb(17, 24, 39)`,
                lineHeight: "24px",
                fontSize: "20px",
                letterSpacing: "1.5px"
              }}>RitualPlanner</span>
            </NavLink>
          </span>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            item.dropdown ? (
              <Menu as="div" className="relative inline-block text-left" key={item.name}>
                <div>
                  <Menu.Button className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center">
                    {item.name}
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink to="/notes/create" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm`}>
                            Create Note
                          </NavLink>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink to="/notes/all" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm`}>
                            All Notes
                          </NavLink>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <NavLink key={item.name} to={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </NavLink>
            )
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <NavLink to="/login">
            <button className="text-sm font-semibold leading-6 text-gray-900">
              Log in / SignUp <span aria-hidden="true">&rarr;</span>
            </button>
          </NavLink>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">RitualPlanner</span>
              <img
                alt="RitualPlanner"
                src="https://i.ibb.co/wS8fFBn/logo-color.png"
                className="h-8 w-auto"
              />
            </NavLink>
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
                {navigation.map((item) => (
                  item.dropdown ? (
                    <Menu as="div" className="relative inline-block text-left" key={item.name}>
                      <div>
                        <Menu.Button className="text-sm font-semibold leading-6 text-gray-900 inline-flex items-center">
                          {item.name}
                          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink to="/notes/create" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm`}>
                                  Create Note
                                </NavLink>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <NavLink to="/notes/update-delete" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm`}>
                                  Update / Delete Note
                                </NavLink>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <NavLink key={item.name} to={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                      {item.name}
                    </NavLink>
                  )
                ))}
              </div>
              <div className="py-6">
                <NavLink to="/login">
                  <button className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-500">
                    Log in / SignUp
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Navbar;
