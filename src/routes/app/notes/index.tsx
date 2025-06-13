import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
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
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreateNoteDialog } from "@/components/notes/create-note-dialog"
import { listNoteAction } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/app/notes/')({
  component: RouteComponent,
})

function RouteComponent() {

  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const DEFAULT_PAGE_SIZE = 10

  const { data: notesData, isLoading } = useQuery({
    queryKey: ['notes', currentPage, searchQuery, startDate, endDate],
    queryFn: () => listNoteAction({
      page: currentPage,
      size: DEFAULT_PAGE_SIZE,
      search: searchQuery || undefined,
      startDate: startDate ? startDate.getTime() : undefined,
      endDate: endDate ? endDate.getTime() : undefined,
    }),
  })

  return <>
    <SidebarInset className='w-full'>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Notes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
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
            <h1 className="text-2xl font-bold">Notes List</h1>
            <Button onClick={() => setIsDialogOpen(true)} className='cursor-pointer'>
              <abbr title="Add Note" className="sm:hidden">
                <Plus className="h-4 w-4" />
              </abbr>
              <Plus className="hidden sm:block h-4 w-4" />
              <span className="hidden sm:inline">Add Note</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
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
            </div>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto px-6 py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sr No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Reminder Date</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : notesData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No notes found</TableCell>
                </TableRow>
              ) : (
                notesData?.map((note, index) => (
                  <TableRow key={note.id} onClick={() => navigate({ to: '/app/notes/note/$id', params: { id: note.id } })}>
                    <TableCell>{(currentPage - 1) * DEFAULT_PAGE_SIZE + index + 1}</TableCell>
                    <TableCell>{note.title}</TableCell>
                    <TableCell>{note.reminder_date ? format(new Date(note.reminder_date * 1000), "PPP") : "No reminder"}</TableCell>
                    <TableCell>{format(new Date(note.createdAt * 1000), "PPP")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!notesData || notesData.length < DEFAULT_PAGE_SIZE}
          >
            Next
          </Button>
        </div>
      </div>

      <CreateNoteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </SidebarInset>
  </>
}
