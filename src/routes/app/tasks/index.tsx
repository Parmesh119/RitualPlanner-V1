import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/app/tasks/')({
  validateSearch: z.object({
    view: z.enum(['list', 'calendar']).optional().default('list'),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { view } = Route.useSearch()

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center gap-2">
          {/* View toggle buttons can be added here */}
        </div>
      </div>

      {view === 'list' ? (
        <div className="mt-6">
          {/* List view implementation */}
          <p>List view content</p>
        </div>
      ) : (
        <div className="mt-6">
          <p>Calendar view content</p>
        </div>
      )}
    </div>
  )
}
