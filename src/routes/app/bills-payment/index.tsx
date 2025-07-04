import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { ItemBIllSchema, BillSchema, type TBill, type TItemBill } from '@/schemas/Bills'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listBillAction, deleteBilByIdlAction } from "@/lib/actions"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Search, List, Grid, Plus, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

export const Route = createFileRoute('/app/bills-payment/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBills, setSelectedBills] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const DEFAULT_PAGE_SIZE = 10
  const [status, setStatus] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const statusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "Completed", value: "COMPLETED" },
  ]

  const { data: billsData, isLoading } = useQuery({
    queryKey: ['bills', currentPage, searchQuery, startDate, endDate, status],
    queryFn: () => listBillAction({
      page: currentPage,
      size: DEFAULT_PAGE_SIZE,
      search: searchQuery || undefined,
      startDate: startDate ? startDate.getTime() : undefined,
      endDate: endDate ? endDate.getTime() : undefined,
      status: status || undefined,
    }),
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked && billsData && billsData.length > 0) {
      setSelectedBills(billsData.map(bill => bill.id))
    } else {
      setSelectedBills([])
    }
  }

  const handleSelectBill = (billId: string, checked: boolean) => {
    if (checked) {
      setSelectedBills(prev => [...prev, billId])
    } else {
      setSelectedBills(prev => prev.filter(id => id !== billId))
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedBills.map(billId => deleteBilByIdlAction(billId)))
      // Show success message
      // toast is already called in action, but you can add a custom one if needed
      setSelectedBills([])
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    } catch (error) {
      // toast is already called in action, but you can add a custom one if needed
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

  return <>
    <SidebarInset className='w-full rounded-t-xl'>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Bills & Payment</BreadcrumbLink>
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
            <h1 className="text-2xl font-bold">Bills List</h1>
            <div className="flex flex-row justify-between items-center gap-4">
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
              {selectedBills.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedBills.length})
                </Button>
              )}
              <Button onClick={() => navigate({ to: '/app/bills-payment/create' })} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Bill
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-center w-full">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[140px] justify-between">
                    Status: {statusOptions.find(o => o.value === status)?.label || 'All'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setStatus(null)}>All</DropdownMenuItem>
                  {statusOptions.map(opt => (
                    <DropdownMenuItem key={opt.value} onClick={() => setStatus(opt.value)}>
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[140px] justify-start text-left font-normal">
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
                  <Button variant="outline" className="min-w-[140px] justify-start text-center font-normal ">
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
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="rounded-md border overflow-x-auto px-6 py-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-2 pr-4 text-center">
                    <Checkbox
                      checked={billsData && billsData.length > 0 && selectedBills.length === billsData.length}
                      onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                      aria-label="Select all"
                      className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary mx-auto"
                    />
                  </TableHead>
                  <TableHead className="px-6 text-center">Sr No.</TableHead>
                  <TableHead className="px-6 text-center">Name</TableHead>
                  <TableHead className="px-6 text-center">Payment Status</TableHead>
                  <TableHead className="px-6 text-center">Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : billsData?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No bills found</TableCell>
                  </TableRow>
                ) : (
                  billsData?.map((bill, index) => (
                    <TableRow
                      key={bill.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate({ to: '/app/bills-payment/get/$id', params: { id: bill.id } })}
                    >
                      <TableCell className="pl-2 pr-4 text-center" onClick={e => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedBills.includes(bill.id)}
                          onCheckedChange={(checked) => handleSelectBill(bill.id, checked as boolean)}
                          aria-label={`Select bill ${bill.name}`}
                          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary mx-auto"
                        />
                      </TableCell>
                      <TableCell className="px-6 text-center">{(currentPage - 1) * DEFAULT_PAGE_SIZE + index + 1}</TableCell>
                      <TableCell className="px-6 text-center">{bill.name}</TableCell>
                      <TableCell className="px-6 text-center">
                        <Badge
                          className={`px-2 py-1 rounded-full text-xs font-medium
                            ${getStatusColor(bill.paymentstatus || '')}
                          `}
                        >
                          {bill.paymentstatus || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        {bill.createdAt ? format(new Date(bill.createdAt * 1000), "PPP") : '-'}
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
            ) : billsData?.length === 0 ? (
              <div className="col-span-full text-center py-4">No bills found</div>
            ) : (
              billsData?.map((bill, index) => (
                <div
                  key={bill.id}
                  className="relative border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate({ to: '/app/bills-payment/get/$id', params: { id: bill.id } })}
                >
                  <div
                    className="absolute top-2 right-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedBills.includes(bill.id)}
                      onCheckedChange={(checked) => handleSelectBill(bill.id, checked as boolean)}
                      aria-label={`Select bill ${bill.name}`}
                      className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 pr-8">{bill.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Created Date: {bill.createdAt ? format(new Date(bill.createdAt * 1000), "PPP") : '-'}</p>
                    <p>Updated Date: {bill.updatedAt ? format(new Date(bill.updatedAt * 1000), "PPP") : '-'}</p>
                    <div className="mb-2">
                      Payment Status: <Badge
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.paymentstatus || '')}`}
                      >
                        {bill.paymentstatus || '-'}
                      </Badge>
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
            disabled={!billsData || billsData.length < DEFAULT_PAGE_SIZE}
          >
            Next
          </Button>
        </div>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete {selectedBills.length} selected bill{selectedBills.length > 1 ? 's' : ''} from the database.
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
      </div>
    </SidebarInset >
  </>
}
