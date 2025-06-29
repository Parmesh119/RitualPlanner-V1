import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { Clock, Pencil, Send, Mail, Phone, User, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreateCoWorkerDialog } from "@/components/co-worker/create-dialog"
import { useState } from "react"
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
  const navigate = useNavigate()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const { data: coWorker, isLoading } = useQuery<TCoWorker>({
    queryKey: ['co-worker', coWorkerId],
    queryFn: () => getCoWorkerById(coWorkerId)
  })

  const sendInvite = useMutation({
    mutationFn: () => {
      if (!coWorker) {
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading co-worker details...</p>
          </div>
        </div>
      </SidebarInset>
    )
  }

  if (!coWorker) {
    return (
      <SidebarInset className='w-full'>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Co-Worker Not Found</h2>
            <p className="text-muted-foreground mb-4">The co-worker you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate({ to: '/app/co-worker' })}>
              <User className="mr-2 h-4 w-4" />
              Back to Co-Workers
            </Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset className='w-full'>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate({ to: '/app/co-worker' })}>Co-Worker</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='mt-1' />
              <BreadcrumbItem>
                <BreadcrumbPage>{coWorker.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-6">
        {/* Co-Worker Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{coWorker.name}</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 cursor-pointer" onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit Co-Worker
            </Button>
            <Button onClick={() => setIsInviteDialogOpen(true)} variant={'outline'} className='cursor-pointer' size={"sm"}>
              <Send className='h-4 w-4' />Invite
            </Button>
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-sm font-medium">Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{coWorker.email || "Not provided"}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-500" />
                <CardTitle className="text-sm font-medium">Phone</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{coWorker.phone || "Not provided"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="w-full max-w-full flex flex-row">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1">

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Additional Information
                  </CardTitle>
                  <CardDescription>Additional details and metadata</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {coWorker.createdAt ? new Date(coWorker.createdAt * 1000).toLocaleDateString() : "-"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {coWorker.updatedAt ? new Date(coWorker.updatedAt * 1000).toLocaleDateString() : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Co-Worker Tasks</CardTitle>
                <CardDescription>Tasks associated with this co-worker</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4">
                    <svg
                      className="h-full w-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground mb-4">Tasks for this co-worker will appear here when they are created.</p>
                  <Button variant="outline" onClick={() => navigate({to: "/app/tasks/create"})}>
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Payment information for this co-worker</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4">
                    <svg
                      className="h-full w-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No payments yet</h3>
                  <p className="text-muted-foreground mb-4">Payments for this co-worker will appear here when they are created.</p>
                  <Button variant="outline">
                    Add Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Confirmation Dialog */}
      <AlertDialog open={isInviteDialogOpen} onOpenChange={(open) => {
        if (!open) return;
        setIsInviteDialogOpen(open);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invite Co-Worker</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to invite <b>{coWorker.name}</b> - {coWorker.email || 'No email'} - {coWorker.phone || 'No phone'} on this platform?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsInviteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsInviteDialogOpen(false);
              sendInvite.mutate();
            }}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateCoWorkerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        coWorker={coWorker}
      />
    </SidebarInset>
  )
}
