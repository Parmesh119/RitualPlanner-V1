import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/routes/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/routes/auth/register"!</div>
}
