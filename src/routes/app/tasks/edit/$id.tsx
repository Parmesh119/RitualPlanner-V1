import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/tasks/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/tasks/edit/$id"!</div>
}
