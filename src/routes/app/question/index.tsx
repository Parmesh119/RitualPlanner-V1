import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/question/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/question/"!</div>
}
