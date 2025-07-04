import { createFileRoute } from '@tanstack/react-router'
import { listCoWorkerAction, deleteCoWorkerAction } from '@/lib/actions'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
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
import { Plus, Search, Trash2, List, Grid } from "lucide-react"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
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
import { CreateCoWorkerDialog } from "@/components/co-worker/create-dialog"

export const Route = createFileRoute('/app/co-worker/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedCoWorkers, setSelectedCoWorkers] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const size = 10

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page on new search
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const { data: coWorkers = [], isLoading } = useQuery({
    queryKey: ['co-workers', debouncedSearch, page],
    queryFn: () => listCoWorkerAction({ search: debouncedSearch, page, size })
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleAddCoWorker = () => {
    setIsCreateDialogOpen(true)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && coWorkers && coWorkers.length > 0) {
      setSelectedCoWorkers(coWorkers.map(coWorker => coWorker.id))
    } else {
      setSelectedCoWorkers([])
    }
  }

  const handleSelectCoWorker = (coWorkerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCoWorkers(prev => [...prev, coWorkerId])
    } else {
      setSelectedCoWorkers(prev => prev.filter(id => id !== coWorkerId))
    }
  }

  const handleDeleteSelected = async () => {
    try {
      // Delete each selected co-worker
      await Promise.all(selectedCoWorkers.map(coWorkerId => deleteCoWorkerAction(coWorkerId)))

      // Show success message
      toast.success("Co-workers deleted successfully", {
        description: `${selectedCoWorkers.length} co-worker${selectedCoWorkers.length > 1 ? 's' : ''} have been permanently deleted.`,
        style: {
          background: "linear-gradient(90deg, #38A169, #2F855A)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })

      // Clear selection
      setSelectedCoWorkers([])

      // Refresh the co-workers list
      queryClient.invalidateQueries({ queryKey: ['co-workers'] })
    } catch (error) {
      toast.error("Failed to delete co-workers", {
        description: "There was an error deleting the co-workers. Please try again."
      })
    }
  }

  return (
    <SidebarInset className='w-full rounded-t-xl'>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Co-Worker</BreadcrumbLink>
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
            <h1 className="text-2xl font-bold">Co-Workers List</h1>
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
              {selectedCoWorkers.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedCoWorkers.length})
                </Button>
              )}
              <Button onClick={handleAddCoWorker} className='cursor-pointer'>
                <abbr title="Add Co-Worker" className="sm:hidden">
                  <Plus className="h-4 w-4" />
                </abbr>
                <Plus className="hidden sm:block h-4 w-4" />
                <span className="hidden sm:inline">Add Co-Worker</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search co-workers..."
                value={search}
                onChange={handleSearch}
                className="pl-8 w-full"
              />
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
                      checked={coWorkers && coWorkers.length > 0 && selectedCoWorkers.length === coWorkers.length}
                      onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                      aria-label="Select all"
                      className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                    />
                  </TableHead>
                  <TableHead>Sr No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : coWorkers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No co-workers found
                    </TableCell>
                  </TableRow>
                ) : (
                  coWorkers.map((coWorker, index) => (
                    <TableRow
                      key={coWorker.id}
                      onClick={() => navigate({ to: '/app/co-worker/get/$id', params: { id: coWorker.id } })}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedCoWorkers.includes(coWorker.id)}
                          onCheckedChange={(checked) => handleSelectCoWorker(coWorker.id, checked as boolean)}
                          aria-label={`Select co-worker ${coWorker.name}`}
                          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                        />
                      </TableCell>
                      <TableCell>{(page - 1) * size + index + 1}</TableCell>
                      <TableCell>{coWorker.name}</TableCell>
                      <TableCell>{coWorker.email || '-'}</TableCell>
                      <TableCell>{coWorker.phone}</TableCell>
                      <TableCell>{format(new Date(coWorker.createdAt * 1000), "PPP")}</TableCell>
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
            ) : coWorkers.length === 0 ? (
              <div className="col-span-full text-center py-4">No co-workers found</div>
            ) : (
              coWorkers.map((coWorker, index) => (
                <div
                  key={coWorker.id}
                  className="relative border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate({ to: '/app/co-worker/get/$id', params: { id: coWorker.id } })}
                >
                  <div
                    className="absolute top-2 right-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedCoWorkers.includes(coWorker.id)}
                      onCheckedChange={(checked) => handleSelectCoWorker(coWorker.id, checked as boolean)}
                      aria-label={`Select co-worker ${coWorker.name}`}
                      className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 pr-8">{coWorker.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Email: {coWorker.email || '-'}</p>
                    <p>Phone: {coWorker.phone}</p>
                    <p>Created Date: {format(new Date(coWorker.createdAt * 1000), "PPP")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-center">
            Page {page}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={!coWorkers || coWorkers.length < size}
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
              This action cannot be undone. This will permanently delete {selectedCoWorkers.length} selected co-worker{selectedCoWorkers.length > 1 ? 's' : ''} from the database.
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

      <CreateCoWorkerDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </SidebarInset>
  )
}
