import { Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { Menu, X, Flame } from "lucide-react"
import { useState, useEffect, useRef } from 'react'

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

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNavItemClick = (sectionId?: string) => {
    setIsMobileMenuOpen(false)

    if (sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }

  return (
    <header className={`w-full ${isScrolled ? 'fixed top-0 bg-white/90 backdrop-blur-sm shadow-sm' : 'relative bg-white'} z-50 transition-all duration-300`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex flex-row gap-2" onClick={() => handleNavItemClick()}>
            <span className=' text-black tracking-wider flex flex-row items-center gap-2'><Flame className='w-10 h-10 text-black border-1 p-1 rounded-full' />RitualPlanner</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-10">
              <button
                onClick={() => handleNavItemClick('about')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => handleNavItemClick('contact')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => handleNavItemClick('faq')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth/login"><Button  className='cursor-pointer bg-black text-white hover:bg-gray-800' >Login</Button></Link>
              <Link to="/auth/register"><Button className='cursor-pointer' >Sign Up</Button></Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden pt-4 pb-3 space-y-4">
            <button
              onClick={() => handleNavItemClick('about')}
              className="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleNavItemClick('contact')}
              className="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => handleNavItemClick('faq')}
              className="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              FAQ
            </button>
            <div className="space-y-2 pt-2">
              <Button variant="outline" className="w-full" onClick={() => handleNavItemClick()}>Login</Button>
              <Button className="w-full" onClick={() => handleNavItemClick()}>Sign Up</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
