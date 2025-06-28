import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/tasks/get/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/tasks/get/$id"!</div>
}
