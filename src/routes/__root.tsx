import { Outlet, createRootRoute } from '@tanstack/react-router'

import Header from '../components/Landing-Page/Header'
import About from '@/components/Landing-Page/About'
export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <About />
    </>
  ),
})
