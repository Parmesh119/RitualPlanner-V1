"use client"

import { Facebook, Instagram, Twitter, Mail, Flame, ArrowUp } from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function Footer() {
    const handleNavItemClick = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

            <div className="container mx-auto px-6 relative">
                {/* Main Footer Content */}
                <div className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Logo and Description */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                    <Flame className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-2xl font-bold">RitualPlanner</span>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                                Simplifying the management of Karmakand rituals and ceremonies through modern technology and intuitive
                                design.
                            </p>

                            {/* Newsletter Signup */}
                            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                                <h4 className="font-semibold mb-3">Stay Updated</h4>
                                <p className="text-gray-400 text-sm mb-4">
                                    Get the latest updates and features delivered to your inbox.
                                </p>
                                <div className="flex gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
                                    />
                                    <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 px-6 py-2 rounded-lg font-medium transition-all">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-bold text-xl mb-6">Quick Links</h3>
                            <ul className="space-y-4">
                                {[
                                    { label: "About Us", id: "about" },
                                    { label: "Contact", id: "contact" },
                                    { label: "FAQ", id: "faq" },
                                ].map((link) => (
                                    <li key={link.id}>
                                        <button
                                            onClick={() => handleNavItemClick(link.id)}
                                            className="text-gray-300 hover:text-orange-400 transition-colors text-lg group flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        to={"/auth/login"}
                                        className="text-gray-300 hover:text-orange-400 transition-colors text-lg group flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/auth/register"}
                                        className="text-gray-300 hover:text-orange-400 transition-colors text-lg group flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Sign Up
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact & Social */}
                        <div>
                            <h3 className="font-bold text-xl mb-6">Connect With Us</h3>

                            {/* Social Links */}
                            <div className="flex gap-4">
                                {[
                                    { icon: Facebook, href: "#", label: "Facebook" },
                                    { icon: Twitter, href: "#", label: "Twitter" },
                                    { icon: Instagram, href: "#", label: "Instagram" },
                                    { icon: Mail, href: "mailto:contact@ritualplanner.com", label: "Email" },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-br hover:from-orange-600 hover:to-orange-700 rounded-xl flex items-center justify-center transition-all group border border-gray-700 hover:border-orange-500"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-gray-400">
                            <p>© {new Date().getFullYear()} RitualPlanner. All rights reserved.</p>
                            <div className="flex gap-6 text-sm">
                                <a href="#" className="hover:text-orange-400 transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="#" className="hover:text-orange-400 transition-colors">
                                    Terms of Service
                                </a>
                                <a href="#" className="hover:text-orange-400 transition-colors">
                                    Cookie Policy
                                </a>
                            </div>
                        </div>

                        {/* Back to Top Button */}
                        <button
                            onClick={scrollToTop}
                            className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-xl flex items-center justify-center transition-all group shadow-lg hover:shadow-xl"
                            aria-label="Back to top"
                        >
                            <ArrowUp className="h-5 w-5 text-white group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}
