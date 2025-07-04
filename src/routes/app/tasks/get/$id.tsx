import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { getTaskByIdAction, getClientByIdAction, getBilByIdlAction, getCoWorkerById, getNoteByIdAction, getTemplateByIdAction, getPaymentByIdAction, getUserDetails } from '@/lib/actions'
import type { TRequestTaskSchema } from '@/schemas/Task'
import { useQuery } from '@tanstack/react-query'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Edit, Calendar, Clock, MapPin, User, FileText, Users, CreditCard, Building, Receipt, FileText as FileTextIcon } from "lucide-react"

export const Route = createFileRoute('/app/tasks/get/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/app/tasks/get/$id' })

  const { data: taskData, isLoading, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskByIdAction(id),
    enabled: !!id,
  })

  // Fetch related entities when task data is available
  const { data: clientData } = useQuery({
    queryKey: ['client', taskData?.task.client_id],
    queryFn: () => getClientByIdAction(taskData!.task.client_id!),
    enabled: !!taskData?.task.client_id,
  })

  const { data: templateData } = useQuery({
    queryKey: ['template', taskData?.task.template_id],
    queryFn: () => getTemplateByIdAction(taskData!.task.template_id!),
    enabled: !!taskData?.task.template_id,
  })

  const { data: billData } = useQuery({
    queryKey: ['bill', taskData?.task.bill_id],
    queryFn: () => getBilByIdlAction(taskData!.task.bill_id!),
    enabled: !!taskData?.task.bill_id,
  })

  const { data: userData } = useQuery({
    queryKey: ['user', taskData?.task.taskOwner_id],
    queryFn: () => getUserDetails(),
    enabled: !!taskData?.task.taskOwner_id,
  })

  // Fetch main task payment
  const { data: mainPaymentData } = useQuery({
    queryKey: ['main-payment', taskData?.payment?.id],
    queryFn: () => getPaymentByIdAction(taskData!.payment!.id!),
    enabled: !!taskData?.payment?.id,
  })

  // Create individual note queries - using a fixed number to avoid conditional hooks
  const note1Query = useQuery({
    queryKey: ['note', taskData?.note[0]?.note_id],
    queryFn: () => getNoteByIdAction(taskData!.note[0].note_id!),
    enabled: !!taskData?.note[0]?.note_id,
  })

  const note2Query = useQuery({
    queryKey: ['note', taskData?.note[1]?.note_id],
    queryFn: () => getNoteByIdAction(taskData!.note[1].note_id!),
    enabled: !!taskData?.note[1]?.note_id,
  })

  const note3Query = useQuery({
    queryKey: ['note', taskData?.note[2]?.note_id],
    queryFn: () => getNoteByIdAction(taskData!.note[2].note_id!),
    enabled: !!taskData?.note[2]?.note_id,
  })

  const note4Query = useQuery({
    queryKey: ['note', taskData?.note[3]?.note_id],
    queryFn: () => getNoteByIdAction(taskData!.note[3].note_id!),
    enabled: !!taskData?.note[3]?.note_id,
  })

  const note5Query = useQuery({
    queryKey: ['note', taskData?.note[4]?.note_id],
    queryFn: () => getNoteByIdAction(taskData!.note[4].note_id!),
    enabled: !!taskData?.note[4]?.note_id,
  })

  // Create individual assistant queries - using a fixed number to avoid conditional hooks
  const assistant1Query = useQuery({
    queryKey: ['assistant', taskData?.assistant[0]?.assistant_id],
    queryFn: () => getCoWorkerById(taskData!.assistant[0].assistant_id!),
    enabled: !!taskData?.assistant[0]?.assistant_id,
  })

  const assistant1PaymentQuery = useQuery({
    queryKey: ['assistant-payment', taskData?.assistant[0]?.payment_id],
    queryFn: () => getPaymentByIdAction(taskData!.assistant[0].payment_id!),
    enabled: !!taskData?.assistant[0]?.payment_id,
  })

  const assistant2Query = useQuery({
    queryKey: ['assistant', taskData?.assistant[1]?.assistant_id],
    queryFn: () => getCoWorkerById(taskData!.assistant[1].assistant_id!),
    enabled: !!taskData?.assistant[1]?.assistant_id,
  })

  const assistant2PaymentQuery = useQuery({
    queryKey: ['assistant-payment', taskData?.assistant[1]?.payment_id],
    queryFn: () => getPaymentByIdAction(taskData!.assistant[1].payment_id!),
    enabled: !!taskData?.assistant[1]?.payment_id,
  })

  const assistant3Query = useQuery({
    queryKey: ['assistant', taskData?.assistant[2]?.assistant_id],
    queryFn: () => getCoWorkerById(taskData!.assistant[2].assistant_id!),
    enabled: !!taskData?.assistant[2]?.assistant_id,
  })

  const assistant3PaymentQuery = useQuery({
    queryKey: ['assistant-payment', taskData?.assistant[2]?.payment_id],
    queryFn: () => getPaymentByIdAction(taskData!.assistant[2].payment_id!),
    enabled: !!taskData?.assistant[2]?.payment_id,
  })

  const assistant4Query = useQuery({
    queryKey: ['assistant', taskData?.assistant[3]?.assistant_id],
    queryFn: () => getCoWorkerById(taskData!.assistant[3].assistant_id!),
    enabled: !!taskData?.assistant[3]?.assistant_id,
  })

  const assistant4PaymentQuery = useQuery({
    queryKey: ['assistant-payment', taskData?.assistant[3]?.payment_id],
    queryFn: () => getPaymentByIdAction(taskData!.assistant[3].payment_id!),
    enabled: !!taskData?.assistant[3]?.payment_id,
  })

  const assistant5Query = useQuery({
    queryKey: ['assistant', taskData?.assistant[4]?.assistant_id],
    queryFn: () => getCoWorkerById(taskData!.assistant[4].assistant_id!),
    enabled: !!taskData?.assistant[4]?.assistant_id,
  })

  const assistant5PaymentQuery = useQuery({
    queryKey: ['assistant-payment', taskData?.assistant[4]?.payment_id],
    queryFn: () => getPaymentByIdAction(taskData!.assistant[4].payment_id!),
    enabled: !!taskData?.assistant[4]?.payment_id,
  })

  // Helper arrays for easier access
  const noteQueries = [note1Query, note2Query, note3Query, note4Query, note5Query]
  const assistantQueries = [
    { assistantQuery: assistant1Query, assistantPaymentQuery: assistant1PaymentQuery },
    { assistantQuery: assistant2Query, assistantPaymentQuery: assistant2PaymentQuery },
    { assistantQuery: assistant3Query, assistantPaymentQuery: assistant3PaymentQuery },
    { assistantQuery: assistant4Query, assistantPaymentQuery: assistant4PaymentQuery },
    { assistantQuery: assistant5Query, assistantPaymentQuery: assistant5PaymentQuery },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'CANCELED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mx-auto justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (error || !taskData) {
    return (
      <SidebarInset className='w-full rounded-t-xl'>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 tracking-wider">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/app/tasks">Tasks</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='mt-1' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Error</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator className="mb-4" />
        <div className="flex flex-col gap-4 px-4 md:px-8 py-2">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-destructive">Error Loading Task</h3>
                <p className="text-muted-foreground">Failed to load task details. Please try again.</p>
                <Button
                  onClick={() => navigate({ to: '/app/tasks' })}
                  className="mt-4"
                >
                  Back to Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    )
  }

  const { task, note, assistant, payment, assistantPayment } = taskData

  return (
    <SidebarInset className='w-full rounded-t-xl'>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/app/tasks">Tasks</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='mt-1' />
              <BreadcrumbItem>
                <BreadcrumbPage>{task.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Separator className="mb-4" />

      <div className="flex flex-col gap-4 px-4 md:px-8 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{task.name}</h1>
          <Button
            onClick={() => navigate({ to: '/app/tasks/edit/$id', params: { id: task.id! } })}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Task
          </Button>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assistant {assistant.length > 0 && `(${assistant.length})`}
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Task Details
                </CardTitle>
                <CardDescription>Basic information about the task</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Date:</span>
                      <span>{format(new Date(task.date * 1000), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Time:</span>
                      <span>{task.starttime} - {task.endtime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Self Service:</span>
                      <Badge variant={task.self ? "default" : "secondary"}>
                        {task.self ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Created:</span>
                      <span>{format(new Date(task.createdAt * 1000), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Updated:</span>
                      <span>{format(new Date(task.updatedAt * 1000), "PPP")}</span>
                    </div>
                  </div>
                </div>

                {/* Related Entities */}
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Related Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Task Owner:</span>
                        <span>{userData.name}</span>
                      </div>
                    )}
                    {clientData && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Client:</span>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal"
                          onClick={() => navigate({ to: '/app/client/get/$id', params: { id: clientData.id! } })}
                        >
                          {clientData.name}
                        </Button>
                      </div>
                    )}
                    {templateData && (
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Template:</span>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal"
                          onClick={() => navigate({ to: '/app/template/get/$id', params: { id: templateData.ritualTemplate.id! } })}
                        >
                          {templateData.ritualTemplate.name}
                        </Button>
                      </div>
                    )}
                    {billData && (
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Bill:</span>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal"
                          onClick={() => navigate({ to: '/app/bills-payment/get/$id', params: { id: billData.bill.id! } })}
                        >
                          {billData.bill.name}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {task.description && (
                  <div className="space-y-2">
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground bg-muted p-3 rounded-md">
                      {task.description}
                    </p>
                  </div>
                )}

                {note.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-medium">Notes ({note.length}):</span>
                    <div className="space-y-2">
                      {note.map((taskNote, index) => {
                        const noteQuery = noteQueries[index]
                        return (
                          <div key={taskNote.id} className="bg-muted p-3 rounded-md">
                            {noteQuery?.isLoading ? (
                              <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                <p className="ml-2 text-sm text-muted-foreground">Loading note...</p>
                              </div>
                            ) : noteQuery?.data ? (
                              <div>
                                <p className="font-medium">{noteQuery.data.title}</p>
                                <p className="text-sm text-muted-foreground">{noteQuery.data.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {noteQuery.data.reminder_date && format(new Date(noteQuery.data.reminder_date * 1000), "PPP")}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Note details not available</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Task Assistants
                </CardTitle>
                <CardDescription>Assistants assigned to this task</CardDescription>
              </CardHeader>
              <CardContent>
                {assistant.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No Assistants Selected</h3>
                    <p className="text-muted-foreground">No assistants have been assigned to this task.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assistant.map((assistantItem, index) => {
                      const { assistantQuery, assistantPaymentQuery } = assistantQueries[index]
                      return (
                        <div key={assistantItem.id} className="border rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                {assistantQuery?.isLoading ? (
                                  <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    <p className="ml-2 text-sm text-muted-foreground">Loading assistant...</p>
                                  </div>
                                ) : assistantQuery?.data ? (
                                  <div>
                                    <h4 className="font-medium">{assistantQuery.data.name}</h4>
                                    <p className="text-sm text-muted-foreground">{assistantQuery.data.email}</p>
                                    <p className="text-sm text-muted-foreground">{assistantQuery.data.phone}</p>
                                  </div>
                                ) : (
                                  <h4 className="font-medium">Assistant details not available</h4>
                                )}
                              </div>
                              {assistantItem.payment_id && (
                                <Badge variant="outline">Payment Assigned</Badge>
                              )}
                            </div>

                            {assistantPaymentQuery?.data && (
                              <div className="bg-muted p-3 rounded-md">
                                <h5 className="font-medium mb-2">Assistant Payment</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium">Total Amount:</span> ₹{assistantPaymentQuery.data.totalamount}
                                  </div>
                                  <div>
                                    <span className="font-medium">Paid Amount:</span> ₹{assistantPaymentQuery.data.paidamount}
                                  </div>
                                  <div>
                                    <span className="font-medium">Remaining:</span> ₹{assistantPaymentQuery.data.totalamount - assistantPaymentQuery.data.paidamount}
                                  </div>
                                  <div className='flex flex-row gap-2'>
                                    <span className="font-medium">Status:</span>
                                    <Badge className={getPaymentStatusColor(assistantPaymentQuery.data.paymentstatus)}>
                                      {assistantPaymentQuery.data.paymentstatus}
                                    </Badge>
                                  </div>
                                  <div>
                                    <span className="font-medium">Method:</span> {assistantPaymentQuery.data.paymentmode === "CASH" ? "Cash" : "Online"}
                                  </div>
                                  <div>
                                    <span className="font-medium">Online Payment Method:</span> {assistantPaymentQuery.data.onlinepaymentmode || "-"}
                                  </div>
                                  <div>
                                    <span className="font-medium">Date:</span> {assistantPaymentQuery.data.paymentdate ? format(new Date(assistantPaymentQuery.data.paymentdate * 1000), "PPP") : "-"}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Task Payments
                </CardTitle>
                <CardDescription>Payment information for this task</CardDescription>
              </CardHeader>
              <CardContent>
                {!mainPaymentData && assistantPayment.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No Payments</h3>
                    <p className="text-muted-foreground">No payments have been recorded for this task.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mainPaymentData && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Main Payment</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Total Amount:</span> ₹{mainPaymentData.totalamount}
                          </div>
                          <div>
                            <span className="font-medium">Paid Amount:</span> ₹{mainPaymentData.paidamount}
                          </div>
                          <div>
                            <span className="font-medium">Remaining:</span> ₹{mainPaymentData.totalamount - mainPaymentData.paidamount}
                          </div>
                          <div className='flex flex-row gap-2'>
                            <span className="font-medium">Status:</span>
                            <Badge className={getPaymentStatusColor(mainPaymentData.paymentstatus)}>
                              {mainPaymentData.paymentstatus}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Method:</span> {mainPaymentData.paymentmode}
                          </div>
                          <div>
                            <span className="font-medium">Online Payment Method:</span> {mainPaymentData.onlinepaymentmode || "-"}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {mainPaymentData.paymentdate ? format(new Date(mainPaymentData.paymentdate * 1000), "PPP") : "-"}
                          </div>
                        </div>
                      </div>
                    )}

                    {assistantPayment.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Assistant Payments</h4>
                        {assistantPayment.map((assistantPay, index) => (
                          assistantPay && (
                            <div key={assistantPay.id} className="border rounded-lg p-4">
                              <h5 className="font-medium mb-2">Assistant Payment {index + 1}</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-medium">Total Amount:</span> ₹{assistantPay.totalamount}
                                </div>
                                <div>
                                  <span className="font-medium">Paid Amount:</span> ₹{assistantPay.paidamount}
                                </div>
                                <div>
                                  <span className="font-medium">Remaining:</span> ₹{assistantPay.totalamount - assistantPay.paidamount}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span>
                                  <Badge className={getPaymentStatusColor(assistantPay.paymentstatus)}>
                                    {assistantPay.paymentstatus}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="font-medium">Method:</span> {assistantPay.paymentmode}
                                </div>
                                <div>
                                  <span className="font-medium">Online Payment Method:</span> {assistantPay.onlinepaymentmode || "-"}
                                </div>
                                <div>
                                  <span className="font-medium">Date:</span> {assistantPay.paymentdate ? format(new Date(assistantPay.paymentdate * 1000), "PPP") : "-"}
                                </div>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
