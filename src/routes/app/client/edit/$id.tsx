import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/client/edit/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Edit Client Page</div>
} 