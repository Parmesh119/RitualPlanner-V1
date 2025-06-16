import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown, MoveRight, MoveLeft, Clock, User, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
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
import { listCoWorkerAction, listNoteAction, getNoteByIdAction, getUserDetails } from "@/lib/actions"
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
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<{
    taskName?: string
    location?: string
    date?: string
    taskOwner?: string
  }>({})

  // Step 2 States
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([])
  const [displayNoteId, setDisplayNoteId] = useState<string | null>(null)

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

  const validateStep1 = () => {
    try {
      const taskData = {
        name: taskName,
        location,
        date: date ? Math.floor(date.getTime() / 1000) : undefined,
        self,
        status,
        taskOwner_id: !self ? taskOwner : undefined
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
          taskOwner: fieldErrors.taskOwner_id?.[0]
        })
      }
      return false
    }
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      // TODO: Implement final task creation with notes
      console.log("Final form submission with notes", selectedNoteIds)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(1)
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
                  <BreadcrumbPage>Create Task (Step {currentStep} of 2)</BreadcrumbPage>
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
                <h1 className="text-3xl font-bold tracking-tight">Create Task</h1>
                <p className="text-muted-foreground">Fill in the details to create a new task assignment</p>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Step {currentStep} of 2</span>
              </div>
            </div>

            <div className="rounded-md border p-6">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                  {/* Left Column Fields */}
                  <div className="space-y-6">
                    {/* Task Name */}
                    <div className="max-w-md">
                      <Label htmlFor="taskName" className="mb-2 block">Task Name</Label>
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

                    {/* Location */}
                    <div className="max-w-md">
                      <Label htmlFor="location" className="mb-2 block">Location</Label>
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
                    <div className="max-w-md">
                      <Label className="mb-2 block">Date</Label>
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
                    </div>
                  </div>

                  {/* Right Column Fields */}
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="max-w-sm">
                      <Label htmlFor="status" className="mb-2 block">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
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
                      <div className="mt-2 text-base text-muted-foreground">
                        <p>• Pending: Future work</p>
                        <p>• Completed: Past work</p>
                        <p>• Canceled: Cancelled work</p>
                      </div>
                    </div>

                    {/* Self Toggle */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Task Assignment
                      </Label>
                      <div className="bg-muted/30 rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-2">
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
                    <div className="max-w-sm">
                      <Label htmlFor="taskOwner" className="mb-2 block">Task Owner</Label>
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
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                              <Command>
                                <CommandInput placeholder="Search co-workers..." />
                                <CommandEmpty>No co-worker found.</CommandEmpty>
                                <CommandGroup>
                                  {coWorkers.map((coWorker) => (
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
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <>
                  <span className='flex flex-row gap-4'>
                    <Card className="w-full">
                      <CardHeader className="pb-4">
                        <h2 className="text-lg font-semibold">Task Notes</h2>
                        <p className="text-sm text-muted-foreground">Associate relevant notes with this task</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Label className="mb-2 block">Select Notes</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              Select Notes ({selectedNoteIds.length} selected)
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Search notes..." />
                              <CommandEmpty>No notes found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {isLoadingNotes ? (
                                    <CommandItem>Loading notes...</CommandItem>
                                  ) : allNotes.length === 0 ? (
                                    <CommandItem>No notes available.</CommandItem>
                                  ) : (
                                    allNotes.map((note) => (
                                      <CommandItem
                                        key={note.id}
                                        className="flex items-center justify-between space-x-2"
                                      >
                                        <Label htmlFor={`note-${note.id}`}
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          {note.title}
                                        </Label>
                                        <Checkbox
                                          id={`note-${note.id}`}
                                          checked={selectedNoteIds.includes(note.id)}
                                          onCheckedChange={(checked) => handleSelectNote(note.id, checked as boolean)}
                                        />
                                      </CommandItem>
                                    ))
                                  )}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {selectedNoteIds.length > 0 && (
                          <div className="mt-4 space-y-1">
                            <p className="text-sm font-semibold">Selected Notes:</p>
                            <ul className="space-y-2">
                              {selectedNoteIds.map(id => {
                                const note = allNotes.find(n => n.id === id)
                                return note ? (
                                  <li key={id} className="flex items-center justify-between group">
                                    <Link
                                      to="/app/notes/note/$id"
                                      params={{ id: note.id }}
                                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {note.title}
                                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleSelectNote(note.id, false)}
                                    >
                                      <XCircle className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                  </li>
                                ) : null
                              })}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="w-full">
                      <CardHeader className="pb-4">
                        <h2 className="text-lg font-semibold">Note Content</h2>
                        <p className="text-sm text-muted-foreground">View the content of the selected note</p>
                      </CardHeader>
                      <CardContent className="min-h-[200px]">
                        {isLoadingDisplayNote ? (
                          <p className="text-muted-foreground">Loading content...</p>
                        ) : displayNoteContent ? (
                          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {displayNoteContent.description}
                          </p>
                        ) : (
                          <p className="text-muted-foreground">No note selected or content not found.</p>
                        )}
                      </CardContent>
                    </Card>
                  </span>
                </>
              )}

              {/* Buttons for Navigation */}
              <div className="flex justify-between gap-4 pt-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}><MoveLeft className='mt-1' />Previous</Button>
                <Button onClick={handleNext}>Next<MoveRight className='mt-1' /></Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
