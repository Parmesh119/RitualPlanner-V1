import { createFileRoute } from '@tanstack/react-router'
import LandingPage from '@/components/Landing-Page/Landing-Page'
export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <LandingPage />
    </>
  )
}
