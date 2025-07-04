import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/terms-conditions/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        
      </div>
    </>
  )
}
