import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown, Eye, BookOpen, Search, FileText, Paperclip, MoveRight, MoveLeft, Clock, User, CheckCircle, XCircle, ExternalLink, IndianRupee, CreditCard, Wallet, Edit } from 'lucide-react'
import { z } from 'zod'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@tanstack/react-router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { TaskSchema, type TTask } from "@/schemas/Task"
import { listCoWorkerAction, listNoteAction, getNoteByIdAction, getUserDetails, listClientAction } from "@/lib/actions"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Add this type near the top of the file
type AssistantPaymentDetails = {
  assistantId: string;
  totalAmount: number;
  paidAmount: number;
  paymentDate?: Date;
  paymentMode: 'CASH' | 'ONLINE';
  onlinePaymentMode?: 'NET-BANKING' | 'UPI' | 'CHECK' | 'CARD';
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
}

export const Route = createFileRoute('/app/tasks/create')({
  component: RouteComponent,
})

function RouteComponent() {
  // Step 1 States
  const [currentStep, setCurrentStep] = useState(1)
  const [taskName, setTaskName] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState<Date>()
  const [self, setSelf] = useState(true)
  const [status, setStatus] = useState("PENDING")
  const [taskOwner, setTaskOwner] = useState("")
  const [description, setDescription] = useState("")
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<{
    taskName?: string
    location?: string
    date?: string
    taskOwner?: string
    description?: string
  }>({})

  // Step 2 States
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([])
  const [displayNoteId, setDisplayNoteId] = useState<string | null>(null)

  // Step 3 States
  const [selectedAssistantIds, setSelectedAssistantIds] = useState<string[]>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [paidAmount, setPaidAmount] = useState<number>(0)
  const [paymentDate, setPaymentDate] = useState<Date>()
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'ONLINE'>('CASH')
  const [onlinePaymentMode, setOnlinePaymentMode] = useState<'NET-BANKING' | 'UPI' | 'CHECK' | 'CARD' | null>(null)

  // Step 4 States
  const [step4TotalAmount, setStep4TotalAmount] = useState<number>(0)
  const [step4PaidAmount, setStep4PaidAmount] = useState<number>(0)
  const [step4PaymentDate, setStep4PaymentDate] = useState<Date>()
  const [step4PaymentMode, setStep4PaymentMode] = useState<'CASH' | 'ONLINE'>('CASH')
  const [step4OnlinePaymentMode, setStep4OnlinePaymentMode] = useState<'NET-BANKING' | 'UPI' | 'CHECK' | 'CARD' | null>(null)

  // Add these new states
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(null)
  const [assistantPayments, setAssistantPayments] = useState<AssistantPaymentDetails[]>([])
  const [currentPayment, setCurrentPayment] = useState<AssistantPaymentDetails>({
    assistantId: '',
    totalAmount: 0,
    paidAmount: 0,
    paymentMode: 'CASH',
    status: 'PENDING'
  })

  // Add search term state
  const [searchTerm, setSearchTerm] = useState("")

  // Add new state for cancel confirmation
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)

  // Add this after the existing state declarations
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([])
  const [clientSearchTerm, setClientSearchTerm] = useState("")

  // Fetch co-workers for task owner dropdown
  const { data: coWorkers = [] } = useQuery({
    queryKey: ['co-workers'],
    queryFn: () => listCoWorkerAction({ search: "", page: 1, size: 100 })
  })

  // Fetch all notes for notes dropdown in Step 2
  const { data: allNotes = [], isLoading: isLoadingNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: () => listNoteAction({ page: 1, size: 1000 }), // Fetch a large number to act as 'all'
  })

  // Fetch single note content for display
  const { data: displayNoteContent, isLoading: isLoadingDisplayNote } = useQuery({
    queryKey: ['note', displayNoteId],
    queryFn: () => getNoteByIdAction(displayNoteId!),
    enabled: !!displayNoteId,
  })

  // Add user details query
  const { data: userDetails } = useQuery({
    queryKey: ['userDetails'],
    queryFn: getUserDetails
  })

  // Fetch clients query
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => listClientAction({ page: 1, size: 1000 })
  })

  // Calculate payment status
  const paymentStatus = totalAmount > 0 && totalAmount === paidAmount ? 'COMPLETED' : 'PENDING'

  // Calculate payment status for step 4
  const step4PaymentStatus = step4TotalAmount > 0 && step4TotalAmount === step4PaidAmount ? 'COMPLETED' : 'PENDING'

  // Filter selected assistants based on search term
  const filteredAssistants = selectedAssistantIds.filter(id => {
    const assistant = coWorkers.find(a => a.id === id)
    return assistant?.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Add this after the existing filtered assistants
  const filteredClients = selectedClientIds.filter(id => {
    const client = clients.find(c => c.id === id)
    return client?.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
  })

  const validateStep1 = () => {
    try {
      const taskData = {
        name: taskName,
        location,
        date: date ? Math.floor(date.getTime() / 1000) : undefined,
        self,
        status,
        taskOwner_id: !self ? taskOwner : undefined,
        description: description || null
      }

      // Custom validation for taskOwner_id if self is false
      if (!self && !taskOwner) {
        setErrors(prev => ({ ...prev, taskOwner: "Task owner is required when 'Self' is off" }))
        return false
      }

      TaskSchema.parse(taskData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        setErrors({
          taskName: fieldErrors.name?.[0],
          location: fieldErrors.location?.[0],
          date: fieldErrors.date?.[0],
          taskOwner: fieldErrors.taskOwner_id?.[0],
          description: fieldErrors.description?.[0]
        })
      }
      return false
    }
  }

  const validateStep3 = () => {
    if (self) {
      // If self is true, we need at least one assistant with payment details
      if (selectedAssistantIds.length === 0) {
        toast.error("Select an assistant because this is your task", {
          description: "And If it is not your make toggle as false in step 1",
          style: {
            background: "linear-gradient(90deg, #E53E3E, #C53030)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        return false
      }

      // Check if all selected assistants have payment details
      const assistantsWithoutPayment = selectedAssistantIds.filter(id =>
        !assistantPayments.find(payment => payment.assistantId === id)
      )

      if (assistantsWithoutPayment.length > 0) {
        const assistantNames = assistantsWithoutPayment
          .map(id => coWorkers.find(a => a.id === id)?.name)
          .filter(Boolean)
          .join(", ")

        toast.error("Incomplete payment details", {
          description: `Please provide payment details for: ${assistantNames}`
        })
        return false
      }

      // Validate payment details for each assistant
      for (const payment of assistantPayments) {
        if (payment.totalAmount <= 0 && status !== "CANCELED") {
          toast.error("Invalid payment amount", {
            description: `Total amount must be greater than 0 for ${coWorkers.find(a => a.id === payment.assistantId)?.name}`
          })
          return false
        }

        if (payment.paymentMode === 'ONLINE' && !payment.onlinePaymentMode) {
          toast.error("Missing payment mode", {
            description: `Please select an online payment mode for ${coWorkers.find(a => a.id === payment.assistantId)?.name}`
          })
          return false
        }
      }
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (validateStep3()) {
        setCurrentStep(4)
      }
    } else if (currentStep === 4) {
      setCurrentStep(5)
    } else if (currentStep === 5) {
      // Final submission
      console.log("Final form submission", {
        selectedNoteIds,
        selectedAssistantIds,
        assistantPayments,
        selectedClientIds,
        totalAmount,
        paidAmount,
        paymentDate,
        paymentMode,
        onlinePaymentMode
      })
    }
  }

  const handlePrevious = () => {
    if (currentStep === 5) {
      setCurrentStep(4)
    } else if (currentStep === 4) {
      setCurrentStep(3)
    } else if (currentStep === 3) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleSelectNote = (noteId: string, checked: boolean) => {
    setSelectedNoteIds(prev => {
      if (checked) {
        return [...prev, noteId]
      } else {
        return prev.filter(id => id !== noteId)
      }
    })
    // Optionally display the content of the last selected note or the one clicked
    if (checked) {
      setDisplayNoteId(noteId)
    } else if (selectedNoteIds.length === 1 && selectedNoteIds[0] === noteId) {
      // If the last selected note is unchecked, clear display
      setDisplayNoteId(null)
    } else if (selectedNoteIds.length > 1) {
      // If other notes are still selected, display the first one remaining
      setDisplayNoteId(selectedNoteIds.filter(id => id !== noteId)[0] || null)
    }
  }

  // Add this function to handle assistant selection
  const handleAssistantSelection = (assistantId: string, checked: boolean) => {
    if (checked) {
      if (status === 'CANCELED' && self) {
        // For canceled tasks, directly add the assistant with CANCELED status
        setSelectedAssistantIds(prev => [...prev, assistantId])
        setAssistantPayments(prev => [...prev, {
          assistantId,
          totalAmount: 0,
          paidAmount: 0,
          paymentMode: 'CASH',
          status: 'CANCELED'
        }])
      } else {
        setCurrentAssistantId(assistantId)
        setCurrentPayment({
          assistantId,
          totalAmount: 0,
          paidAmount: 0,
          paymentMode: 'CASH',
          status: 'PENDING'
        })
        setShowPaymentDialog(true)
      }
    } else {
      setSelectedAssistantIds(prev => prev.filter(id => id !== assistantId))
      setAssistantPayments(prev => prev.filter(payment => payment.assistantId !== assistantId))
    }
  }

  // Add this function to handle payment amount changes
  const handlePaymentAmountChange = (field: 'totalAmount' | 'paidAmount', value: number) => {
    setCurrentPayment(prev => {
      const newPayment = { ...prev, [field]: value }
      // Update status based on amounts
      newPayment.status = newPayment.totalAmount > 0 && newPayment.totalAmount === newPayment.paidAmount ? 'COMPLETED' : 'PENDING'
      return newPayment
    })
  }

  // Add this function to handle payment submission
  const handlePaymentSubmit = () => {
    if (currentAssistantId) {
      setAssistantPayments(prev => {
        const existingIndex = prev.findIndex(p => p.assistantId === currentAssistantId)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = currentPayment
          return updated
        }
        return [...prev, currentPayment]
      })
      setSelectedAssistantIds(prev => {
        if (!prev.includes(currentAssistantId)) {
          return [...prev, currentAssistantId]
        }
        return prev
      })
      setShowPaymentDialog(false)
      setCurrentAssistantId(null)
    }
  }

  // Add this function to handle payment amount changes in step 4
  const handleStep4PaymentAmountChange = (field: 'totalAmount' | 'paidAmount', value: number) => {
    if (field === 'totalAmount') {
      setStep4TotalAmount(value)
    } else {
      setStep4PaidAmount(value)
    }
  }

  // Add this function to handle status change
  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'CANCELED') {
      setPendingStatus(newStatus)
      setShowCancelConfirm(true)
    } else {
      setStatus(newStatus)
    }
  }

  // Add this function to handle cancel confirmation
  const handleCancelConfirm = () => {
    if (pendingStatus) {
      setStatus(pendingStatus)
      setPendingStatus(null)
    }
    setShowCancelConfirm(false)
  }

  // Add this function after handleAssistantSelection
  const handleClientSelection = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClientIds(prev => [...prev, clientId])
    } else {
      setSelectedClientIds(prev => prev.filter(id => id !== clientId))
    }
  }

  return (
    <>
      <SidebarInset className='w-full'>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 tracking-wider">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Tasks</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Task (Step {currentStep} of 5)</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator className="mb-4" />

        <div className="flex flex-col gap-4 px-4 md:px-8 py-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Create Task</h1>
                <p className="text-sm text-muted-foreground">Fill in the details to create a new task</p>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Step {currentStep} of 5</span>
              </div>
            </div>

            <div className="rounded-md border p-6">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Task Details</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enter the basic details for your task
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Task Name */}
                      <div>
                        <Label htmlFor="taskName" className="mb-1.5 block">Task Name</Label>
                        <Input
                          id="taskName"
                          value={taskName}
                          onChange={(e) => setTaskName(e.target.value)}
                          placeholder="Enter task name"
                          className={cn(errors.taskName && "border-red-500")}
                        />
                        {errors.taskName && (
                          <p className="text-sm text-red-500 mt-1">{errors.taskName}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor="description" className="mb-1.5 block">Description</Label>
                        <div className="relative">
                          <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            className={cn(
                              "w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                              errors.description && "border-red-500"
                            )}
                          />
                        </div>
                        {errors.description && (
                          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <Label htmlFor="location" className="mb-1.5 block">Location</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter location"
                          className={cn(errors.location && "border-red-500")}
                        />
                        {errors.location && (
                          <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                        )}
                      </div>

                      {/* Date */}
                      <div>
                        <Label className="mb-1.5 block">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                                errors.date && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              disabled={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)

                                if (status === 'PENDING') {
                                  return date <= today
                                } else if (status === 'COMPLETED') {
                                  return date > today
                                }
                                return false // For CANCELED, all dates are enabled
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.date && (
                          <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                        )}
                        <p className="text-md text-muted-foreground mt-1.5">
                          Note: Date selection is filtered based on the task status:
                          <ul className="list-disc pl-4 mt-1 space-y-0.5">
                            <li>Pending: Future dates only</li>
                            <li>Completed: Past dates only</li>
                            <li>Canceled: All dates available</li>
                          </ul>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="relative">
                    <Separator orientation="vertical" className="absolute left-0 top-0 h-full" />
                    <div className="pl-12">
                      <Card className="border-0">
                        <CardHeader className="pb-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Task Assignment</h2>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Configure task status and assignment details
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Status */}
                          <div>
                            <Label htmlFor="status" className="mb-1.5 block">Status</Label>
                            <Select value={status} onValueChange={handleStatusChange}>
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING" className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-orange-400 mt-0.5" />
                                  Pending
                                </SelectItem>
                                <SelectItem value="COMPLETED" className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  Completed
                                </SelectItem>
                                <SelectItem value="CANCELED" className="flex items-center gap-2">
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  Canceled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="mt-1.5 text-md text-muted-foreground">
                              <p>• Pending: Future work</p>
                              <p>• Completed: Past work</p>
                              <p>• Canceled: Cancelled work</p>
                            </div>
                          </div>

                          {/* Self Toggle */}
                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">
                              Task Assignment
                            </Label>
                            <div className="bg-muted/30 rounded-lg p-3 border">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <Label htmlFor="self" className="font-medium text-sm">
                                    {self ? "Assign to myself" : "Assign to team member"}
                                  </Label>
                                </div>
                                <Switch
                                  id="self"
                                  checked={self}
                                  onCheckedChange={(checked) => {
                                    setSelf(checked)
                                    if (checked) {
                                      setTaskOwner("") // Reset taskOwner when switching to self
                                    } else {
                                      // Reset payment values when switching to non-self
                                      setTotalAmount(0)
                                      setPaidAmount(0)
                                      setPaymentDate(undefined)
                                      setPaymentMode('CASH')
                                      setOnlinePaymentMode(null)
                                    }
                                  }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {self
                                  ? "This task will be assigned to you"
                                  : "Choose a team member to assign this task to"
                                }
                              </p>
                            </div>
                          </div>

                          {/* Task Owner (Conditional) */}
                          <div>
                            <Label htmlFor="taskOwner" className="mb-1.5 block">Task Owner</Label>
                            {self ? (
                              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{userDetails?.name?.[0] || '?'}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{userDetails?.name || 'Loading...'}</span>
                              </div>
                            ) : (
                              <div className="border rounded-md bg-muted/30">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      role="combobox"
                                      className={cn(
                                        "w-full justify-between h-auto p-2 hover:bg-transparent",
                                        errors.taskOwner && "border-red-500"
                                      )}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback>
                                            {taskOwner
                                              ? coWorkers.find((coWorker) => coWorker.id === taskOwner)?.name?.[0] || '?'
                                              : '?'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                          {taskOwner
                                            ? coWorkers.find((coWorker) => coWorker.id === taskOwner)?.name
                                            : "Select task owner..."}
                                        </span>
                                      </div>
                                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-48 lg:w-120 p-0">
                                    <Command>
                                      <CommandInput placeholder="Search co-workers..." />
                                      <CommandEmpty>No co-worker found.</CommandEmpty>
                                      <CommandGroup>
                                        {coWorkers
                                          .filter(coWorker => coWorker.id !== userDetails?.id)
                                          .map((coWorker) => (
                                            <CommandItem
                                              key={coWorker.id}
                                              value={coWorker.name}
                                              onSelect={() => {
                                                setTaskOwner(coWorker.id === taskOwner ? "" : coWorker.id)
                                                setOpen(false)
                                              }}
                                            >
                                              <Avatar className="mr-2 h-6 w-6">
                                                <AvatarFallback>{coWorker.name ? coWorker.name[0] : '?'}</AvatarFallback>
                                              </Avatar>
                                              {coWorker.name}
                                            </CommandItem>
                                          ))}
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                            {errors.taskOwner && (
                              <p className="text-sm text-red-500 mt-1">{errors.taskOwner}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="h-fit border-0">
                      <CardHeader className="pb-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg font-semibold">Task Notes</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Associate relevant notes with this task for better context
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Select Notes
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between h-11 px-3 border-2 hover:border-primary/20 focus:border-primary transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Select Notes ({selectedNoteIds.length} selected)
                                  </span>
                                </div>
                                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 lg:w-130 p-0" align="center">
                              <Command className="rounded-lg border-0">
                                <CommandInput
                                  placeholder="Search notes by title..."
                                  className="h-9"
                                />
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                  <div className="flex flex-col items-center gap-2">
                                    <FileText className="h-8 w-8 opacity-20" />
                                    <span>No notes found</span>
                                  </div>
                                </CommandEmpty>
                                <CommandGroup>
                                  <ScrollArea className="h-[200px]">
                                    <CommandList>
                                      {isLoadingNotes ? (
                                        <CommandItem className="justify-center py-4">
                                          <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span>Loading notes...</span>
                                          </div>
                                        </CommandItem>
                                      ) : allNotes.length === 0 ? (
                                        <CommandItem className="justify-center py-4 text-muted-foreground">
                                          <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-8 w-8 opacity-20" />
                                            <span>No notes available</span>
                                          </div>
                                        </CommandItem>
                                      ) : (
                                        allNotes.map((note) => (
                                          <CommandItem
                                            key={note.id}
                                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50"
                                          >
                                            <Label
                                              htmlFor={`note-${note.id}`}
                                              className="text-sm font-medium leading-none cursor-pointer flex-1 min-w-0 mr-3"
                                            >
                                              <div className="flex items-center gap-2">
                                                <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                                <span className="truncate">{note.title}</span>
                                              </div>
                                            </Label>
                                            <Checkbox
                                              id={`note-${note.id}`}
                                              checked={selectedNoteIds.includes(note.id)}
                                              onCheckedChange={(checked) => handleSelectNote(note.id, checked === true)}
                                              className="shrink-0"
                                            />
                                          </CommandItem>
                                        ))
                                      )}
                                    </CommandList>
                                  </ScrollArea>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {selectedNoteIds.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <Separator />
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Associated Notes
                              </Label>
                              <Badge variant="secondary" className="h-5 px-2 text-xs">
                                {selectedNoteIds.length}
                              </Badge>
                            </div>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {selectedNoteIds.map(id => {
                                const note = allNotes.find(n => n.id === id)
                                return note ? (
                                  <div key={id} className="group flex items-center justify-between p-2 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors">
                                    <Link
                                      to="/app/notes/note/$id"
                                      params={{ id: note.id }}
                                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors flex-1 text-left min-w-0"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                                      <span className="truncate">{note.title}</span>
                                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                                    </Link>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100 shrink-0 ml-2"
                                      onClick={() => handleSelectNote(note.id, false)}
                                    >
                                      <XCircle className="h-3 w-3 hover:text-destructive transition-colors" />
                                    </Button>
                                  </div>
                                ) : null
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="relative">
                      <Separator orientation="vertical" className="absolute left-0 top-0 h-full" />
                      <div className="pl-12">
                        <Card className="h-fit border-0">
                          <CardHeader className="pb-4 space-y-1">
                            <div className="flex items-center gap-2">
                              <Eye className="h-5 w-5 text-muted-foreground" />
                              <h2 className="text-lg font-semibold">Note Content</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              View the content of the selected note
                            </p>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[300px] w-full rounded-md border border-border/50 p-4">
                              {isLoadingDisplayNote ? (
                                <div className="flex items-center justify-center h-full">
                                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Loading content...</span>
                                  </div>
                                </div>
                              ) : displayNoteContent ? (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-medium text-sm">{displayNoteContent.title || 'Note Content'}</h3>
                                  </div>
                                  <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                      {displayNoteContent.description}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <FileText className="h-12 w-12 opacity-20" />
                                    <div className="text-center space-y-1">
                                      <p className="text-sm font-medium">No note selected</p>
                                      <p className="text-xs">Choose a note from the list to preview its content</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 lg:grid-2 gap-6">
                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Task Assistant</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {self
                          ? "Select assistants and provide their payment details"
                          : "Enable self mode to select assistants"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {self ? (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Select Assistants
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between h-11 px-3 border-2 hover:border-primary/20 focus:border-primary transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Select Assistants ({selectedAssistantIds.length} selected)
                                  </span>
                                </div>
                                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 lg:w-130 p-0" align="center">
                              <Command className="rounded-lg border-0">
                                <CommandInput
                                  placeholder="Search assistants..."
                                  className="h-9"
                                />
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                  <div className="flex flex-col items-center gap-2">
                                    <User className="h-8 w-8 opacity-20" />
                                    <span>No assistants found</span>
                                  </div>
                                </CommandEmpty>
                                <CommandGroup>
                                  <ScrollArea className="h-[200px]">
                                    <CommandList>
                                      {coWorkers
                                        .filter(assistant => assistant.id !== userDetails?.id)
                                        .map((assistant) => (
                                          <CommandItem
                                            key={assistant.id}
                                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50"
                                          >
                                            <Label
                                              htmlFor={`assistant-${assistant.id}`}
                                              className="text-sm font-medium leading-none cursor-pointer flex-1 min-w-0 mr-3"
                                            >
                                              <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                  <AvatarFallback>{assistant.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="truncate">{assistant.name}</span>
                                              </div>
                                            </Label>
                                            <Checkbox
                                              id={`assistant-${assistant.id}`}
                                              checked={selectedAssistantIds.includes(assistant.id)}
                                              onCheckedChange={(checked) => handleAssistantSelection(assistant.id, checked === true)}
                                              className="shrink-0"
                                            />
                                          </CommandItem>
                                        ))}
                                    </CommandList>
                                  </ScrollArea>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <p className="text-sm text-muted-foreground">Enable self mode to select assistants</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Selected Assistants</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        View and manage selected assistants
                      </p>
                    </CardHeader>
                    <CardContent>
                      {selectedAssistantIds.length > 0 ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search selected assistants..."
                              className="pl-9"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {filteredAssistants.map(id => {
                                const assistant = coWorkers.find(a => a.id === id)
                                const payment = assistantPayments.find(p => p.assistantId === id)
                                return assistant ? (
                                  <div key={id} className="group flex items-center justify-between p-3 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>{assistant.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col min-w-0">
                                        <span className="truncate text-sm font-medium">{assistant.name}</span>
                                        {payment && (
                                          <div className="flex flex-col gap-0.5 mt-1">
                                            {status === 'CANCELED' && self ? (
                                              <span className="text-xs text-destructive font-medium">
                                                Task Canceled
                                              </span>
                                            ) : (
                                              <>
                                                <span className="text-xs text-muted-foreground">
                                                  Payment: ₹{payment.paidAmount}/{payment.totalAmount}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  {payment.paymentDate && format(payment.paymentDate, "PPP")} • {payment.paymentMode}
                                                  {payment.onlinePaymentMode && ` (${payment.onlinePaymentMode})`}
                                                </span>
                                                <span className={cn(
                                                  "text-xs font-medium",
                                                  payment.status === 'COMPLETED' ? "text-green-600" : "text-yellow-600"
                                                )}>
                                                  {payment.status}
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                                        onClick={() => handleAssistantSelection(assistant.id, false)}
                                      >
                                        <XCircle className="h-4 w-4 hover:text-destructive transition-colors" />
                                      </Button>
                                      {!(status === 'CANCELED' && self) && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                                          onClick={() => {
                                            setCurrentAssistantId(assistant.id)
                                            setCurrentPayment(assistantPayments.find(p => p.assistantId === assistant.id) || {
                                              assistantId: assistant.id,
                                              totalAmount: 0,
                                              paidAmount: 0,
                                              paymentMode: 'CASH',
                                              status: 'PENDING'
                                            })
                                            setShowPaymentDialog(true)
                                          }}
                                        >
                                          <Edit className="h-4 w-4 hover:text-primary transition-colors" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ) : null
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <p className="text-sm text-muted-foreground">No assistants selected</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
                      <DialogHeader>
                        <DialogTitle>Payment Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dialogTotalAmount">Total Amount</Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="dialogTotalAmount"
                                type="number"
                                value={currentPayment.totalAmount}
                                onChange={(e) => handlePaymentAmountChange('totalAmount', Number(e.target.value))}
                                className="pl-8"
                                placeholder="Enter total amount"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dialogPaidAmount">Amount Paid</Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="dialogPaidAmount"
                                type="number"
                                value={currentPayment.paidAmount}
                                onChange={(e) => handlePaymentAmountChange('paidAmount', Number(e.target.value))}
                                className="pl-8"
                                placeholder="Enter paid amount"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Status</Label>
                          <div className={cn(
                            "flex text-black items-center gap-2 p-2 border rounded-md",
                            currentPayment.status === 'COMPLETED' ? "bg-green-50" : "bg-yellow-50"
                          )}>
                            {currentPayment.status === 'COMPLETED' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="font-medium capitalize">{currentPayment.status.toLowerCase()}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Date</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-between text-left font-normal",
                                  !currentPayment.paymentDate && "text-muted-foreground"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{currentPayment.paymentDate ? format(currentPayment.paymentDate, "PPP") : "Select a date"}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto p-0" align="center">
                              <Calendar
                                mode="single"
                                selected={currentPayment.paymentDate}
                                onSelect={(date) => setCurrentPayment(prev => ({ ...prev, paymentDate: date }))}
                                disabled={(d) => {
                                  if (!d) return false
                                  const taskDate = new Date(d)
                                  taskDate.setHours(0, 0, 0, 0)
                                  return date ? taskDate < date : false
                                }}
                                initialFocus
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Mode</Label>
                          <Select
                            value={currentPayment.paymentMode}
                            onValueChange={(value: 'CASH' | 'ONLINE') => setCurrentPayment(prev => ({ ...prev, paymentMode: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CASH">
                                <div className="flex items-center gap-2">
                                  <Wallet className="h-4 w-4" />
                                  Cash
                                </div>
                              </SelectItem>
                              <SelectItem value="ONLINE">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Online
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {currentPayment.paymentMode === 'ONLINE' && (
                          <div className="space-y-2">
                            <Label>Online Payment Mode</Label>
                            <Select
                              value={currentPayment.onlinePaymentMode || ''}
                              onValueChange={(value: 'NET-BANKING' | 'UPI' | 'CHECK' | 'CARD') =>
                                setCurrentPayment(prev => ({ ...prev, onlinePaymentMode: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select online payment mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="CARD">Card</SelectItem>
                                <SelectItem value="NET-BANKING">Net Banking</SelectItem>
                                <SelectItem value="CHECK">Check</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          onClick={handlePaymentSubmit}
                        >
                          Add Payment Details
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  <Card className="border-0">
                    <CardHeader className="pb-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Your Payment Details</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {status === 'CANCELED' ? (
                          <span className="text-destructive">Payment details are disabled for canceled tasks</span>
                        ) : (
                          "Enter payment information for the task"
                        )}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-6">
                        <div className="flex flex-row gap-4">
                          <div className="space-y-2 w-[50%]">
                            <Label htmlFor="step4TotalAmount">Total Amount</Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="step4TotalAmount"
                                type="number"
                                value={step4TotalAmount}
                                onChange={(e) => handleStep4PaymentAmountChange('totalAmount', Number(e.target.value))}
                                className="pl-8"
                                placeholder="Enter total amount"
                                disabled={status === 'CANCELED'}
                              />
                            </div>
                          </div>
                          <div className="space-y-2 w-[50%]">
                            <Label htmlFor="step4PaidAmount">Amount Paid</Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="step4PaidAmount"
                                type="number"
                                value={step4PaidAmount}
                                onChange={(e) => handleStep4PaymentAmountChange('paidAmount', Number(e.target.value))}
                                className="pl-8"
                                placeholder="Enter paid amount"
                                disabled={status === 'CANCELED'}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Status</Label>
                          <div className={cn(
                            "flex text-black items-center gap-2 p-2 border rounded-md",
                            step4PaymentStatus === 'COMPLETED' ? "bg-green-50" : "bg-yellow-50",
                            status === 'CANCELED' && "opacity-50"
                          )}>
                            {step4PaymentStatus === 'COMPLETED' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="font-medium capitalize">{step4PaymentStatus.toLowerCase()}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Date</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-between text-left font-normal",
                                  !step4PaymentDate && "text-muted-foreground",
                                  status === 'CANCELED' && "opacity-50"
                                )}
                                disabled={status === 'CANCELED'}
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{step4PaymentDate ? format(step4PaymentDate, "PPP") : "Select a date"}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto p-0" align="center">
                              <Calendar
                                mode="single"
                                selected={step4PaymentDate}
                                onSelect={setStep4PaymentDate}
                                disabled={(d) => {
                                  if (!d) return false
                                  const taskDate = new Date(d)
                                  taskDate.setHours(0, 0, 0, 0)
                                  return date ? taskDate < date : false
                                }}
                                initialFocus
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Mode</Label>
                          <Select
                            value={step4PaymentMode}
                            onValueChange={(value: 'CASH' | 'ONLINE') => setStep4PaymentMode(value)}
                            disabled={status === 'CANCELED'}
                          >
                            <SelectTrigger className={cn(status === 'CANCELED' && "opacity-50")}>
                              <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CASH">
                                <div className="flex items-center gap-2">
                                  <Wallet className="h-4 w-4" />
                                  Cash
                                </div>
                              </SelectItem>
                              <SelectItem value="ONLINE">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Online
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {step4PaymentMode === 'ONLINE' && (
                          <div className="space-y-2">
                            <Label>Online Payment Mode</Label>
                            <Select
                              value={step4OnlinePaymentMode || ''}
                              onValueChange={(value: 'NET-BANKING' | 'UPI' | 'CHECK' | 'CARD') => setStep4OnlinePaymentMode(value)}
                              disabled={status === 'CANCELED'}
                            >
                              <SelectTrigger className={cn(status === 'CANCELED' && "opacity-50")}>
                                <SelectValue placeholder="Select online payment mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UPI">UPI</SelectItem>
                                <SelectItem value="CARD">Card</SelectItem>
                                <SelectItem value="NET-BANKING">Net Banking</SelectItem>
                                <SelectItem value="CHECK">Check</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep === 5 && (
                <div className="grid grid-cols-1 lg:grid-2 gap-6">
                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Task Clients</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {self
                          ? "Select clients for this task"
                          : "Enable self mode to select clients"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {self ? (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Select Clients
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between h-11 px-3 border-2 hover:border-primary/20 focus:border-primary transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    Select Clients ({selectedClientIds.length} selected)
                                  </span>
                                </div>
                                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 lg:w-130 p-0" align="center">
                              <Command className="rounded-lg border-0">
                                <CommandInput
                                  placeholder="Search clients..."
                                  className="h-9"
                                />
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                  <div className="flex flex-col items-center gap-2">
                                    <User className="h-8 w-8 opacity-20" />
                                    <span>No clients found</span>
                                  </div>
                                </CommandEmpty>
                                <CommandGroup>
                                  <ScrollArea className="h-[200px]">
                                    <CommandList>
                                      {clients.map((client) => (
                                        <CommandItem
                                          key={client.id}
                                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50"
                                        >
                                          <Label
                                            htmlFor={`client-${client.id}`}
                                            className="text-sm font-medium leading-none cursor-pointer flex-1 min-w-0 mr-3"
                                          >
                                            <div className="flex items-center gap-2">
                                              <Avatar className="h-6 w-6">
                                                <AvatarFallback>{client.name?.[0] || '?'}</AvatarFallback>
                                              </Avatar>
                                              <span className="truncate">{client.name || 'Unnamed Client'}</span>
                                            </div>
                                          </Label>
                                          <Checkbox
                                            id={`client-${client.id}`}
                                            checked={selectedClientIds.includes(client.id)}
                                            onCheckedChange={(checked) => handleClientSelection(client.id, checked === true)}
                                            className="shrink-0"
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </ScrollArea>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <p className="text-sm text-muted-foreground">Enable self mode to select clients</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Selected Clients</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        View and manage selected clients
                      </p>
                    </CardHeader>
                    <CardContent>
                      {selectedClientIds.length > 0 ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search selected clients..."
                              className="pl-9"
                              value={clientSearchTerm}
                              onChange={(e) => setClientSearchTerm(e.target.value)}
                            />
                          </div>
                          <div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {filteredClients.map(id => {
                                const client = clients.find(c => c.id === id)
                                return client ? (
                                  <div key={id} className="group flex items-center justify-between p-3 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>{client.name?.[0] || '?'}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col min-w-0">
                                        <Link
                                          to="/app/client/get/$id"
                                          params={{ id: client.id }}
                                          className="truncate text-sm font-medium hover:text-primary transition-colors"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {client.name || 'Unnamed Client'}
                                        </Link>
                                        <div className="flex flex-col gap-0.5 mt-1">
                                          <span className="text-xs text-muted-foreground">
                                            Email: {client.email || '-'}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            Phone: {client.phone || '-'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                                      onClick={() => handleClientSelection(client.id, false)}
                                    >
                                      <XCircle className="h-4 w-4 hover:text-destructive transition-colors" />
                                    </Button>
                                  </div>
                                ) : null
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <p className="text-sm text-muted-foreground">No clients selected</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Buttons for Navigation */}
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>Previous</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Alert Dialog */}
        <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this task? This action will:
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>Disable all payment fields</li>
                  <li>Set assistant payments to canceled status</li>
                  <li>This action cannot be undone</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingStatus(null)}>Keep Task</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelConfirm} className="bg-destructive text-white hover:bg-destructive/90">
                Yes, Cancel Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </>
  )
}
