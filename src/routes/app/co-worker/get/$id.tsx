import { createFileRoute } from '@tanstack/react-router'
import { getCoWorkerById, sendInviteAction } from '@/lib/actions'
import { type TCoWorker } from '@/schemas/CoWorker'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Clock, Pencil, Send } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreateCoWorkerDialog } from "@/components/co-worker/create-dialog"
import { useState } from "react"
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/co-worker/get/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      coWorkerId: params.id,
    }
  },
})

function RouteComponent() {
  const { coWorkerId } = Route.useLoaderData()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { data: coWorker, isLoading } = useQuery<TCoWorker>({
    queryKey: ['co-worker', coWorkerId],
    queryFn: () => getCoWorkerById(coWorkerId)
  })

  const sendInvite = useMutation({
    mutationFn: () => {
      if (!coWorker) {
        // Optionally, you could throw an error or return a rejected promise
        throw new Error("Co-worker data is not loaded");
      }
      return sendInviteAction(coWorker);
    },
    onSuccess: async (data) => {
      if (data) {
        toast.success("Invitation sent successfully", {
          style: {
            background: "linear-gradient(90deg, #38A169, #2F855A)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
      }
    },
    onError: () => {
      toast.error("Error while sending invitation", {
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
    }
  })

  if (isLoading) {
    return (
      <SidebarInset className='w-full'>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-pulse text-muted-foreground">Loading co-worker...</div>
        </div>
      </SidebarInset>
    )
  }

  if (!coWorker) {
    return (
      <SidebarInset className='w-full'>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-destructive">Co-worker not found</div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset className='w-full'>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to={"/app/co-worker"}><BreadcrumbLink>Co-Worker</BreadcrumbLink></Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{coWorker.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-6 px-4 md:px-8 py-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">{coWorker.name}</h1>
              <span className='flex flex-row justify-end gap-4'>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="gap-2 cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Edit Co-Worker
              </Button>
                <Button onClick={() => sendInvite.mutate()} variant={'outline'} className='cursor-pointer' size={"sm"} >
                <Send className='h-4 w-4' />Invite Co-Worker on this platform?
              </Button>
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground justify-between">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Created: {format(new Date(coWorker.createdAt * 1000), "PPP")}</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-muted-foreground">
                  {coWorker.email || 'No email provided'}
                </p>
              </div>
              <div className="grid gap-2">
                <h3 className="text-sm font-medium">Phone</h3>
                <p className="text-muted-foreground">
                  {coWorker.phone}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateCoWorkerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        coWorker={coWorker}
      />
    </SidebarInset>
  )
}
