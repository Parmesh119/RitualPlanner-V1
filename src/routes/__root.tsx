import { Outlet, createRootRoute } from '@tanstack/react-router'

import Header from '../components/Landing-Page/Header'
import About from '@/components/Landing-Page/About'
import Contact from '@/components/Landing-Page/Contact'
import FAQSection from '@/components/Landing-Page/FAQ'
import Footer from '@/components/Landing-Page/Footer'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <About />
      <Contact />
      <FAQSection />
      <Footer />
    </>
  ),
})
