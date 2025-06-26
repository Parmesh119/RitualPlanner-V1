import * as React from "react"
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
import { TaskSchema, TaskAssistantSchema, PaymentSchema } from "@/schemas/Task"
import { listCoWorkerAction, listNoteAction, getNoteByIdAction, getUserDetails, listClientAction, listTemplateAction, listBillAction } from "@/lib/actions"
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
  const [assistantPayments, setAssistantPayments] = useState<AssistantPaymentDetails[]>([])
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(null)
  const [currentPayment, setCurrentPayment] = useState<AssistantPaymentDetails>({
    assistantId: '',
    totalAmount: 0,
    paidAmount: 0,
    paymentMode: 'CASH',
    status: 'PENDING'
  })
  const [searchTerm, setSearchTerm] = useState("")

  // Step 4 States (Formerly Step 5)
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([])
  const [clientSearchTerm, setClientSearchTerm] = useState("")

  // Step 5 States (Formerly Step 6)
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([])
  const [templateSearchTerm, setTemplateSearchTerm] = useState("")

  // Step 6 States (Formerly Step 7)
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([])
  const [billSearchTerm, setBillSearchTerm] = useState("")

  // Step 7 States (Formerly Step 4)
  const [step7TotalAmount, setStep7TotalAmount] = useState<number>(0)
  const [step7PaidAmount, setStep7PaidAmount] = useState<number>(0)
  const [step7PaymentDate, setStep7PaymentDate] = useState<Date>()
  const [step7PaymentMode, setStep7PaymentMode] = useState<'CASH' | 'ONLINE'>('CASH')
  const [step7OnlinePaymentMode, setStep7OnlinePaymentMode] = useState<'NET-BANKING' | 'UPI' | 'CHECK' | 'CARD' | null>(null)

  // Other States
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)

  // Error States for each step
  const [step3Errors, setStep3Errors] = useState<{ [key: string]: string }>({});
  const [step4Errors, setStep4Errors] = useState<{ [key: string]: string }>({}); // For Clients
  const [step5Errors, setStep5Errors] = useState<{ [key: string]: string }>({}); // For Templates
  const [step6Errors, setStep6Errors] = useState<{ [key: string]: string }>({}); // For Bills
  const [step7Errors, setStep7Errors] = useState<{ [key: string]: string }>({}); // For Your Payment

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

  // Fetch templates query
  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => listTemplateAction({ page: 1, size: 1000 })
  })

  // Fetch bills query
  const { data: bills = [] } = useQuery({
    queryKey: ['bills', billSearchTerm],
    queryFn: () => listBillAction({ page: 1, size: 1000, search: billSearchTerm }),
  })

  // Calculate payment status for assistants
  const paymentStatus = totalAmount > 0 && totalAmount === paidAmount ? 'COMPLETED' : 'PENDING'

  // Calculate payment status for step 7
  const step7PaymentStatus = step7TotalAmount > 0 && step7TotalAmount === step7PaidAmount ? 'COMPLETED' : 'PENDING'

  // Filter selected assistants based on search term
  const filteredAssistants = selectedAssistantIds.filter(id => {
    const assistant = coWorkers.find(a => a.id === id)
    return assistant?.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Filter selected clients based on search term
  const filteredClients = selectedClientIds.filter(id => {
    const client = clients.find(c => c.id === id)
    return client?.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
  })

  // Filter selected templates based on search term
  const filteredTemplates = selectedTemplateIds.filter(id => {
    const template = templates.find(t => t.id === id)
    return template?.name.toLowerCase().includes(templateSearchTerm.toLowerCase())
  })

  // Filter selected bills based on search term
  const filteredBills = selectedBillIds.filter(id => {
    const bill = bills.find(b => b.id === id)
    return bill?.name.toLowerCase().includes(billSearchTerm.toLowerCase())
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

      if (!self && !taskOwner) {
        setErrors(prev => ({ ...prev, taskOwner: "Task owner is required when 'Self' is off" }))
        return false
      }

      if (!date) {
        setErrors(prev => ({ ...prev, date: "Date is required" }))
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
    setStep3Errors({});
    return true;
  };

  const validateStep4 = () => { // Formerly validateStep5
    setStep4Errors({});
    if (!self) return true; // Skip validation if not self
    try {
      z.array(z.string()).length(1, "Exactly one client is required.").parse(selectedClientIds);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setStep4Errors(error.flatten().fieldErrors as any);
      }
      return false;
    }
  };

  const validateStep5 = () => { // Formerly validateStep6
    setStep5Errors({});
    if (!self) return true; // Skip validation if not self
    try {
      z.array(z.string()).length(1, "Exactly one template is required.").parse(selectedTemplateIds);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setStep5Errors(error.flatten().fieldErrors as any);
      }
      return false;
    }
  };

  const validateStep6 = () => { // Formerly validateStep7
    setStep6Errors({});
    if (!self) return true; // Skip validation if not self
    try {
      z.array(z.string()).length(1, "Exactly one bill is required.").parse(selectedBillIds);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setStep6Errors(error.flatten().fieldErrors as any);
      }
      return false;
    }
  }

  const validateStep7 = () => { // Formerly validateStep4
    setStep7Errors({});
    let errors: { [key: string]: string } = {};
    try {
      PaymentSchema.pick({ totalAmount: true, paidAmount: true }).parse({
        totalAmount: step7TotalAmount,
        paidAmount: step7PaidAmount,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        if (fieldErrors.totalAmount?.[0]) errors.totalAmount = fieldErrors.totalAmount[0];
        if (fieldErrors.paidAmount?.[0]) errors.paidAmount = fieldErrors.paidAmount[0];
      }
    }
    if (step7PaidAmount === 0) {
      errors.paidAmount = "Paid amount is required and must be greater than 0";
    }
    if (step7PaidAmount > step7TotalAmount) {
      errors.paidAmount = "Paid amount cannot be greater than total amount";
    }
    if ((step7TotalAmount > 0 || step7PaidAmount > 0) && !step7PaymentDate) {
      errors.paymentDate = "Payment date is required when there is a payment amount";
    }
    setStep7Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4)
    } else if (currentStep === 4) { // Clients
      if (validateStep4()) setCurrentStep(5)
    } else if (currentStep === 5) { // Templates
      if (validateStep5()) setCurrentStep(6)
    } else if (currentStep === 6) { // Bills
      if (validateStep6()) setCurrentStep(7)
    } else if (currentStep === 7) { // Your Payment
      if (validateStep7()) {
        // Final submission
        console.log("Final form submission", {
          selectedNoteIds,
          selectedAssistantIds,
          assistantPayments,
          selectedClientIds,
          selectedTemplateIds,
          selectedBillIds,
          totalAmount,
          paidAmount,
          paymentDate,
          paymentMode,
          onlinePaymentMode,
          // Your payment details
          yourPayment: {
            totalAmount: step7TotalAmount,
            paidAmount: step7PaidAmount,
            paymentDate: step7PaymentDate,
            paymentMode: step7PaymentMode,
            onlinePaymentMode: step7OnlinePaymentMode
          }
        })
        toast.success("Task submitted successfully!")
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
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
    if (checked) {
      setDisplayNoteId(noteId)
    } else if (selectedNoteIds.length === 1 && selectedNoteIds[0] === noteId) {
      setDisplayNoteId(null)
    } else if (selectedNoteIds.length > 1) {
      setDisplayNoteId(selectedNoteIds.filter(id => id !== noteId)[0] || null)
    }
  }

  const handleAssistantSelection = (assistantId: string, checked: boolean) => {
    if (checked) {
      if (status === 'CANCELED' && self) {
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

  const handlePaymentAmountChange = (field: 'totalAmount' | 'paidAmount', value: number) => {
    setCurrentPayment(prev => {
      const newPayment = { ...prev, [field]: value }
      newPayment.status = newPayment.totalAmount > 0 && newPayment.totalAmount === newPayment.paidAmount ? 'COMPLETED' : 'PENDING'
      return newPayment
    })
  }

  const handlePaymentSubmit = () => {
    if (currentAssistantId) {
      if (self && status !== 'CANCELED') {
        if (currentPayment.totalAmount <= 0) {
          toast.error("Total amount is required", { description: "Please enter a total amount greater than 0" })
          return
        }
        if (currentPayment.paidAmount <= 0) {
          toast.error("Paid amount is required", { description: "Please enter a paid amount greater than 0" })
          return
        }
        if (currentPayment.paidAmount > currentPayment.totalAmount) {
          toast.error("Paid amount cannot be greater than total amount!")
          return
        }
        if (!currentPayment.paymentDate) {
          toast.error("Payment date is required", { description: "Please select a payment date" })
          return
        }
      }

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

  const handleStep7PaymentAmountChange = (field: 'totalAmount' | 'paidAmount', value: number) => {
    if (field === 'totalAmount') {
      setStep7TotalAmount(value)
    } else {
      setStep7PaidAmount(value)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setDate(undefined); // Reset calendar selection on status change
    if (newStatus === 'CANCELED') {
      setPendingStatus(newStatus)
      setShowCancelConfirm(true)
    } else {
      setStatus(newStatus)
    }
  }

  const handleCancelConfirm = () => {
    if (pendingStatus) {
      setStatus(pendingStatus)
      setPendingStatus(null)
    }
    setShowCancelConfirm(false)
  }

  const handleClientSelection = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClientIds([clientId])
    } else {
      setSelectedClientIds([])
    }
  }

  const resetStepsData = () => {
    // Step 3
    setSelectedAssistantIds([])
    setAssistantPayments([])
    setTotalAmount(0)
    setPaidAmount(0)
    setPaymentDate(undefined)
    setPaymentMode('CASH')
    setOnlinePaymentMode(null)
    setShowPaymentDialog(false)
    setCurrentAssistantId(null)
    setCurrentPayment({ assistantId: '', totalAmount: 0, paidAmount: 0, paymentMode: 'CASH', status: 'PENDING' })

    // Step 4 (Clients)
    setSelectedClientIds([])
    setClientSearchTerm("")

    // Step 5 (Templates)
    setSelectedTemplateIds([])
    setTemplateSearchTerm("")

    // Step 6 (Bills)
    setSelectedBillIds([])
    setBillSearchTerm("")

    // Step 7 (Your Payment)
    setStep7TotalAmount(0)
    setStep7PaidAmount(0)
    setStep7PaymentDate(undefined)
    setStep7PaymentMode('CASH')
    setStep7OnlinePaymentMode(null)
  }

  const handleTemplateSelection = (templateId: string, checked: boolean) => {
    if (!self) return
    if (checked) {
      setSelectedTemplateIds([templateId])
    } else {
      setSelectedTemplateIds([])
    }
  }

  const handleBillSelection = (billId: string, checked: boolean) => {
    if (!self) return
    if (checked) {
      setSelectedBillIds([billId])
    } else {
      setSelectedBillIds([])
    }
  }

  // Automatically set step7TotalAmount to the selected bill's totalamount if self is true and a bill is selected
  React.useEffect(() => {
    if (self && selectedBillIds.length === 1) {
      const selectedBill = bills.find(b => b.id === selectedBillIds[0]);
      if (selectedBill && typeof selectedBill.totalamount === 'number') {
        setStep7TotalAmount(selectedBill.totalamount);
      }
    }
    // Optionally, clear the amount if no bill is selected
    if (self && selectedBillIds.length === 0) {
      setStep7TotalAmount(0);
    }
  }, [self, selectedBillIds, bills]);

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
                  <Link to="/app/tasks"><BreadcrumbLink href="#">Tasks</BreadcrumbLink></Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Create Task (Step {currentStep} of 7)</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator className="mb-4" />

        <div className="flex flex-col gap-4 px-4 md:px-8 py-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Create Task</h1>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>Previous</Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 4 && self && selectedClientIds.length === 0) ||
                    (currentStep === 5 && self && selectedTemplateIds.length === 0) ||
                    (currentStep === 6 && self && selectedBillIds.length === 0)
                  }
                >
                  {currentStep === 7 ? "Submit" : "Next"}
                </Button>
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
                        <Label htmlFor="taskName" className="mb-1.5 block">Task Name <span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="location" className="mb-1.5 block">Location <span className="text-red-500">*</span></Label>
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
                        <Label className="mb-1.5 block">Date <span className="text-red-500">*</span></Label>
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
                                      resetStepsData() // Reset steps data for clean state
                                    } else {
                                      // Reset payment values when switching to non-self
                                      resetStepsData()
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
                            <Label htmlFor="taskOwner" className="mb-1.5 block">Task Owner <span className="text-red-500">*</span></Label>
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
                      {step3Errors.selectedAssistantIds && (
                        <p className="text-sm text-red-500 mt-1">{step3Errors.selectedAssistantIds}</p>
                      )}
                      {step3Errors.assistantPayments && (
                        <p className="text-sm text-red-500 mt-1">{step3Errors.assistantPayments}</p>
                      )}
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
                            <Label htmlFor="dialogTotalAmount">Total Amount {self && status !== 'CANCELED' && <span className="text-red-500">*</span>}</Label>
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
                          <Label>Payment Date {self && status !== 'CANCELED' && <span className="text-red-500">*</span>}</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-between text-left font-normal",
                                  !currentPayment.paymentDate && "text-muted-foreground",
                                  status === 'CANCELED' && "opacity-50",
                                  currentPayment.paidAmount === 0 && "opacity-50"
                                )}
                                disabled={status === 'CANCELED' || currentPayment.paidAmount === 0}
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
                                disabled={d => currentPayment.paidAmount === 0 || (function (d) {
                                  if (!d) return false
                                  const taskDate = new Date(d)
                                  taskDate.setHours(0, 0, 0, 0)
                                  return date ? taskDate < date : false
                                })(d)}
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
                      {step4Errors[0] && (
                        <p className="text-sm text-red-500 mt-1">{step4Errors[0]}</p>
                      )}
                      {self ? (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Select Clients {self && <span className="text-red-500">*</span>}
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
                                            checked={selectedClientIds[0] === client.id}
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

              {currentStep === 5 && (
                <div className="grid grid-cols-1 lg:grid-2 gap-6">
                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Task Templates</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {self
                          ? "Select templates for this task"
                          : "Enable self mode to select templates"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {step5Errors[0] && (
                        <p className="text-sm text-red-500 mt-1">{step5Errors[0]}</p>
                      )}
                      {self ? (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Select Templates <span className="text-red-500">*</span>
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
                                    Select Templates ({selectedTemplateIds.length} selected)
                                  </span>
                                </div>
                                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 lg:w-130 p-0" align="center">
                              <Command className="rounded-lg border-0">
                                <CommandInput
                                  placeholder="Search templates..."
                                  className="h-9"
                                  value={templateSearchTerm}
                                  onValueChange={setTemplateSearchTerm}
                                />
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                  <div className="flex flex-col items-center gap-2">
                                    <FileText className="h-8 w-8 opacity-20" />
                                    <span>No templates found</span>
                                  </div>
                                </CommandEmpty>
                                <CommandGroup>
                                  <ScrollArea className="h-[200px]">
                                    <CommandList>
                                      {templates.map((template) => (
                                        <CommandItem
                                          key={template.id}
                                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50"
                                        >
                                          <Label
                                            htmlFor={`template-${template.id}`}
                                            className="text-sm font-medium leading-none cursor-pointer flex-1 min-w-0 mr-3"
                                          >
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-6 w-6" />
                                              {template.name}
                                            </div>
                                          </Label>
                                          <Checkbox
                                            id={`template-${template.id}`}
                                            checked={selectedTemplateIds[0] === template.id}
                                            onCheckedChange={(checked) => handleTemplateSelection(template.id, checked === true)}
                                            className="shrink-0"
                                            disabled={!self}
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
                          <p className="text-sm text-muted-foreground">Enable self mode to select templates</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Selected Templates</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        View and manage selected templates
                      </p>
                    </CardHeader>
                    <CardContent>
                      {selectedTemplateIds.length > 0 ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Search selected templates..."
                              className="pl-9 border rounded-md h-9 w-full bg-transparent text-sm"
                              value={templateSearchTerm}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplateSearchTerm(e.target.value)}
                            />
                          </div>
                          <div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {filteredTemplates.map(id => {
                                const template = templates.find(t => t.id === id)
                                return template ? (
                                  <div key={id} className="group flex items-center justify-between p-3 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <FileText className="h-8 w-8" />
                                      <div className="flex flex-col min-w-0">
                                        <Link
                                          to="/app/template/get/$id"
                                          params={{ id: template.id }}
                                          className="truncate text-sm font-medium hover:text-primary transition-colors"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {template.name}
                                        </Link>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                                      onClick={() => handleTemplateSelection(template.id, false)}
                                      disabled={!self}
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
                          <p className="text-sm text-muted-foreground">No templates selected</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep === 6 && (
                <div className="grid grid-cols-1 lg:grid-2 gap-6">
                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Task Bills</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {self
                          ? "Select bills for this task"
                          : "Enable self mode to select bills"}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {step6Errors[0] && (
                        <p className="text-sm text-red-500 mt-1">{step6Errors[0]}</p>
                      )}
                      {self ? (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Select Bills <span className="text-red-500">*</span>
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
                                    Select Bills ({selectedBillIds.length} selected)
                                  </span>
                                </div>
                                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 lg:w-130 p-0" align="center">
                              <Command className="rounded-lg border-0">
                                <CommandInput
                                  placeholder="Search bills..."
                                  className="h-9"
                                  value={billSearchTerm}
                                  onValueChange={setBillSearchTerm}
                                />
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                  <div className="flex flex-col items-center gap-2">
                                    <FileText className="h-8 w-8 opacity-20" />
                                    <span>No bills found</span>
                                  </div>
                                </CommandEmpty>
                                <CommandGroup>
                                  <ScrollArea className="h-[200px]">
                                    <CommandList>
                                      {bills.map((bill) => (
                                        <CommandItem
                                          key={bill.id}
                                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50"
                                        >
                                          <Label
                                            htmlFor={`bill-${bill.id}`}
                                            className="text-sm font-medium leading-none cursor-pointer flex-1 min-w-0 mr-3"
                                          >
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-6 w-6" />
                                              {bill.name}
                                            </div>
                                          </Label>
                                          <Checkbox
                                            id={`bill-${bill.id}`}
                                            checked={selectedBillIds[0] === bill.id}
                                            onCheckedChange={(checked) => handleBillSelection(bill.id, checked === true)}
                                            className="shrink-0"
                                            disabled={!self}
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
                          <p className="text-sm text-muted-foreground">Enable self mode to select bills</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0">
                    <CardHeader className="pb-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Selected Bills</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        View and manage selected bills
                      </p>
                    </CardHeader>
                    <CardContent>
                      {selectedBillIds.length > 0 ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Search selected bills..."
                              className="pl-9 border rounded-md h-9 w-full bg-transparent text-sm"
                              value={billSearchTerm}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBillSearchTerm(e.target.value)}
                            />
                          </div>
                          <div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {filteredBills.map(id => {
                                const bill = bills.find(b => b.id === id)
                                return bill ? (
                                  <div key={id} className="group flex items-center justify-between p-3 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <FileText className="h-8 w-8" />
                                      <div className="flex flex-col min-w-0">
                                        <Link
                                          to="/app/bills-payment/get/$id"
                                          params={{ id: bill.id }}
                                          className="truncate text-sm font-medium hover:text-primary transition-colors"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {bill.name}
                                        </Link>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                                      onClick={() => handleBillSelection(bill.id, false)}
                                      disabled={!self}
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
                          <p className="text-sm text-muted-foreground">No bills selected</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep === 7 && (
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
                            <Label htmlFor="step7TotalAmount">Total Amount {self && status !== 'CANCELED' && <span className="text-red-500">*</span>}</Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="step7TotalAmount"
                                type="number"
                                value={step7TotalAmount}
                                onChange={(e) => handleStep7PaymentAmountChange('totalAmount', Number(e.target.value))}
                                className="pl-8"
                                placeholder="Enter total amount"
                                disabled={self}
                              />
                            </div>
                            {step7Errors.totalAmount && (
                              <p className="text-sm text-red-500 mt-1">{step7Errors.totalAmount}</p>
                            )}
                          </div>
                          <div className="space-y-2 w-[50%]">
                            <Label htmlFor="step7PaidAmount">Amount Paid</Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="step7PaidAmount"
                                type="number"
                                value={step7PaidAmount}
                                onChange={(e) => handleStep7PaymentAmountChange('paidAmount', Number(e.target.value))}
                                className="pl-8"
                                placeholder="Enter paid amount"
                                disabled={status === 'CANCELED'}
                              />
                            </div>
                            {step7Errors.paidAmount && (
                              <p className="text-sm text-red-500 mt-1">{step7Errors.paidAmount}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Status</Label>
                          <div className={cn(
                            "flex text-black items-center gap-2 p-2 border rounded-md",
                            step7PaymentStatus === 'COMPLETED' ? "bg-green-50" : "bg-yellow-50",
                            status === 'CANCELED' && "opacity-50"
                          )}>
                            {step7PaymentStatus === 'COMPLETED' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="font-medium capitalize">{step7PaymentStatus.toLowerCase()}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Date {self && status !== 'CANCELED' && <span className="text-red-500">*</span>}</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-between text-left font-normal",
                                  !step7PaymentDate && "text-muted-foreground",
                                  status === 'CANCELED' && "opacity-50",
                                  step7PaidAmount === 0 && "opacity-50"
                                )}
                                disabled={status === 'CANCELED' || step7PaidAmount === 0}
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{step7PaymentDate ? format(step7PaymentDate, "PPP") : "Select a date"}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto p-0" align="center">
                              <Calendar
                                mode="single"
                                selected={step7PaymentDate}
                                onSelect={setStep7PaymentDate}
                                disabled={d => step7PaidAmount === 0 || (function (d) {
                                  if (!d) return false
                                  const taskDate = new Date(d)
                                  taskDate.setHours(0, 0, 0, 0)
                                  return date ? taskDate < date : false
                                })(d)}
                                initialFocus
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {step7Errors.paymentDate && (
                            <p className="text-sm text-red-500 mt-1">{step7Errors.paymentDate}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Mode</Label>
                          <Select
                            value={step7PaymentMode}
                            onValueChange={(value: 'CASH' | 'ONLINE') => setStep7PaymentMode(value)}
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

                        {step7PaymentMode === 'ONLINE' && (
                          <div className="space-y-2">
                            <Label>Online Payment Mode</Label>
                            <Select
                              value={step7OnlinePaymentMode || ''}
                              onValueChange={(value: 'NET-BANKING' | 'UPI' | 'CHECK' | 'CARD') => setStep7OnlinePaymentMode(value)}
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