import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/notes/note/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/notes/note/$id"!</div>
}
