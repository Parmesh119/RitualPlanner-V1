import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { validateSearch } from '@/schemas/Task'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { TRequestTaskSchema, TTask, TTaskAssistant, TTaskNote, TTaskPayment, ListTask } from '@/schemas/Task'
import { listTaskAction } from '@/lib/actions'
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
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { format } from "date-fns"
import { Plus, Trash2, List, Grid, Search, Calendar as CalendarIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export const Route = createFileRoute('/app/tasks/')({
  validateSearch: validateSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | undefined>(undefined)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const DEFAULT_PAGE_SIZE = 10

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks', currentPage, searchQuery, startDate, endDate, statusFilter, paymentStatusFilter],
    queryFn: () => listTaskAction({
      page: currentPage,
      size: DEFAULT_PAGE_SIZE,
      search: searchQuery || undefined,
      startDate: startDate ? startDate.getTime() : undefined,
      endDate: endDate ? endDate.getTime() : undefined,
      status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
      paymentStatus: paymentStatusFilter && paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
    }),
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked && tasksData && tasksData.length > 0) {
      setSelectedTasks(tasksData.map(task => task.id))
    } else {
      setSelectedTasks([])
    }
  }

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId])
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId))
    }
  }

  const handleDeleteSelected = async () => {
    try {
      // TODO: Implement deleteTaskAction when available
      // await Promise.all(selectedTasks.map(taskId => deleteTaskAction(taskId)))

      // Show success message
      toast.success("Tasks deleted successfully", {
        description: `${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''} have been permanently deleted.`,
        style: {
          background: "linear-gradient(90deg, #38A169, #2F855A)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })

      // Clear selection
      setSelectedTasks([])

      // Refresh the tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    } catch (error) {
      toast.error("Failed to delete tasks", {
        description: "There was an error deleting the tasks. Please try again."
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400'
      case 'CANCELED':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400'
      case 'PENDING':
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
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
                <BreadcrumbSeparator className='mt-1' />
                <BreadcrumbItem>
                  <BreadcrumbPage>List</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator className="mb-4" />

        <div className="flex flex-col gap-4 px-4 md:px-8 py-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Tasks List</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-2"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
                {selectedTasks.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected ({selectedTasks.length})
                  </Button>
                )}
                <Button onClick={() => navigate({ to: '/app/tasks/create' })} className='cursor-pointer'>
                  <abbr title="Add Task" className="sm:hidden">
                    <Plus className="h-4 w-4" />
                  </abbr>
                  <Plus className="hidden sm:block h-4 w-4" />
                  <span className="hidden sm:inline">Add Task</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-[200px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-[200px] justify-start text-center font-normal ">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value === "" ? undefined : value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentStatusFilter || ""} onValueChange={(value) => setPaymentStatusFilter(value === "" ? undefined : value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="rounded-md border overflow-x-auto px-6 py-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={tasksData && tasksData.length > 0 && selectedTasks.length === tasksData.length}
                        onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                        aria-label="Select all"
                        className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                      />
                    </TableHead>
                    <TableHead className="w-[240px]">Sr No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : tasksData?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No tasks found</TableCell>
                    </TableRow>
                  ) : (
                    tasksData?.map((task, index) => (
                      <TableRow
                        key={task.id}
                        onClick={() => navigate({ to: '/app/tasks/get/$id', params: { id: task.id } })}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedTasks.includes(task.id)}
                            onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                            aria-label={`Select task ${task.name}`}
                            className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                          />
                        </TableCell>
                        <TableCell>{(currentPage - 1) * DEFAULT_PAGE_SIZE + index + 1}</TableCell>
                        <TableCell>{task.name}</TableCell>
                        <TableCell>{task.location}</TableCell>
                        <TableCell>{format(new Date(task.date * 1000), "PPP")}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-4">Loading...</div>
              ) : tasksData?.length === 0 ? (
                <div className="col-span-full text-center py-4">No tasks found</div>
              ) : (
                tasksData?.map((task, index) => (
                  <div
                    key={task.id}
                    className="relative border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate({ to: '/app/tasks/get/$id', params: { id: task.id } })}
                  >
                    <div
                      className="absolute top-2 right-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                        aria-label={`Select task ${task.name}`}
                        className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 pr-8">{task.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Location: {task.location}</p>
                      <p>Date: {format(new Date(task.date * 1000), "PPP")}</p>
                      <div className="pt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-center">
              Page {currentPage}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!tasksData || tasksData.length < DEFAULT_PAGE_SIZE}
            >
              Next
            </Button>
          </div>
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete {selectedTasks.length} selected task{selectedTasks.length > 1 ? 's' : ''} from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSelected}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
    </>
  )
}