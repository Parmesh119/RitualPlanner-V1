"use client"

import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Menu, X, Flame } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleNavItemClick = (sectionId?: string) => {
    setIsMobileMenuOpen(false)
    if (sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  const buttonStyle = {
    "&:hover": {
      backgroundColor: "orange",
      color: "white",
    },
  }

  return (
    <header
      className={`w-full ${isScrolled ? "fixed top-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" : "relative bg-white"} z-50 transition-all duration-300`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={"/"} className="flex items-center gap-3 group" onClick={() => handleNavItemClick()}>
            <div className="relative">
              <Flame className="w-10 h-10 text-orange-600 p-1.5 bg-orange-50 rounded-xl border border-orange-200 group-hover:bg-orange-100 transition-colors" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">RitualPlanner</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleNavItemClick("about")}
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavItemClick("contact")}
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavItemClick("faq")}
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium relative group"
              >
                FAQ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full"></span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <Link to={"/auth/login"}>
                <Button
                  variant="ghost"
                  className="font-medium text-gray-700 hover:text-white transition-colors cursor-pointer"
                >
                  Login
                </Button>
              </Link>
              <Link to={"/auth/register"}>
                <Button className="bg-gradient-to-r from-orange-600 to-orange-700 cursor-pointer hover:from-orange-700 hover:to-orange-800 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden mt-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="space-y-3">
              <button
                onClick={() => handleNavItemClick("about")}
                className="block w-full text-left py-3 px-4 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
              >
                About
              </button>
              <button
                onClick={() => handleNavItemClick("contact")}
                className="block w-full text-left py-3 px-4 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
              >
                Contact
              </button>
              <button
                onClick={() => handleNavItemClick("faq")}
                className="block w-full text-left py-3 px-4 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
              >
                FAQ
              </button>
            </div>

            <div className="space-y-3 pt-4 mt-4 border-t border-gray-100">
              <Link to={"/auth/login"}>
                <Button
                  variant="outline"
                  className="w-full font-medium border-gray-200 bg-black bg-transparent hover:text-orange-500 hover:bg-orange-100 cursor-pointer"
                >
                  Login
                </Button>
              </Link>
              <Link to={"/auth/register"}>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium shadow-lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
