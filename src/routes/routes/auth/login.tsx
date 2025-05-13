import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/routes/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/routes/auth/login"!</div>
}
