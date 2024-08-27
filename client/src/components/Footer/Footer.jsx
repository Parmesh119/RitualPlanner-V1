import { NavLink } from 'react-router-dom';

export default function FooterThree() {
    return (
        <footer className="bg-white w-full py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between px-4">
                    <div className="w-auto">
                        <NavLink to="/">
                            <div className="inline-flex items-center">
                                <img
                                    alt="RitualPlanner"
                                    src="https://i.ibb.co/wS8fFBn/logo-color.png"
                                    className="h-8 w-auto"
                                />
                                <span style={{
                                    padding: "4px",
                                    fontFamily: "ui-sans-serif, system-ui, sans-serif,",
                                    fontStyle: "normal",
                                    fontWeight: "600",
                                    color: `rgb(17, 24, 39)`,
                                    lineHeight: "24px",
                                    fontSize: "20px",
                                    letterSpacing: "1.5px"
                                }}>RitualPlanner</span>
                            </div>
                        </NavLink>
                    </div>
                    <div className="w-auto">
                        <ul className="flex flex-wrap items-center text-sm text-black">
                            <li className="p-5">
                                <NavLink className="font-bold text-gray-600 hover:text-gray-700" to="/tasks">
                                    Tasks Management
                                </NavLink>
                            </li>
                            <li className="p-5">
                                <NavLink className="font-bold text-gray-600 hover:text-gray-700" to="/notes/all">
                                    Notes
                                </NavLink>
                            </li>
                            <li className="p-5">
                                <NavLink className="font-bold text-gray-600 hover:text-gray-700" to="/about">
                                    About Us
                                </NavLink>
                            </li>
                            <li className="p-5">
                                <NavLink className="font-bold text-gray-600 hover:text-gray-700" to="/contact">
                                    Contact Us
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <hr className="my-6 border-black sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span className="block text-md font-medium sm:text-center text-black">
                        © 2024 <a href="https://flowbite.com/" className="hover:underline">RitualPlanner</a>. All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}
