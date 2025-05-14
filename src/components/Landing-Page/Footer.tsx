import { Facebook, Instagram, Twitter, Mail } from "lucide-react"
import { Container } from "@/components/ui/container"

export default function Footer() {
    const handleNavItemClick = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    return (
        <footer className="bg-gray-50 border-t">
            <Container className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="https://i.ibb.co/wS8fFBn/logo-color.png"
                                alt="RitualPlanner"
                                height={60}
                                width={60}
                            />
                            <span className="text-xl font-bold mb-2">RitualPlanner</span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Simplifying the management of Karmakand rituals<br className="hidden md:block" />
                            and ceremonies through modern technology<br className="hidden md:block" />
                            and intuitive design.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => handleNavItemClick('about')}
                                    className="text-gray-600 hover:text-gray-900 text-sm"
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavItemClick('contact')}
                                    className="text-gray-600 hover:text-gray-900 text-sm"
                                >
                                    Contact
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavItemClick('faq')}
                                    className="text-gray-600 hover:text-gray-900 text-sm"
                                >
                                    FAQ
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-600 hover:text-gray-900"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-gray-900"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-gray-900"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:contact@ritualplanner.com"
                                className="text-gray-600 hover:text-gray-900"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} RitualPlanner. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    )
}
