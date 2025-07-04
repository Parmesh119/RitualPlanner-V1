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
import { Search, Plus, Trash2, List, Grid } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { listClientAction, deleteClientByIdAction } from '@/lib/actions'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
import { ClientDialog } from "@/components/client/create-dialog"
import { format } from "date-fns"

export const Route = createFileRoute('/app/client/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const DEFAULT_PAGE_SIZE = 10

  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients', currentPage, searchQuery],
    queryFn: () => listClientAction({
      page: currentPage,
      size: DEFAULT_PAGE_SIZE,
      search: searchQuery || undefined,
    }),
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked && clientsData && clientsData.length > 0) {
      setSelectedClients(clientsData.map(client => client.id))
    } else {
      setSelectedClients([])
    }
  }

  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId])
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId))
    }
  }

  const handleDeleteSelected = async () => {
    try {
      // Delete each selected client
      await Promise.all(selectedClients.map(clientId => deleteClientByIdAction(clientId)))

      // Show success message
      toast.success("Clients deleted successfully", {
        description: `${selectedClients.length} client${selectedClients.length > 1 ? 's' : ''} have been permanently deleted.`,
        style: {
          background: "linear-gradient(90deg, #38A169, #2F855A)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })

      // Clear selection
      setSelectedClients([])

      // Refresh the clients list
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    } catch (error) {
      toast.error("Failed to delete clients", {
        description: "There was an error deleting the clients. Please try again.",
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
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
                <BreadcrumbLink href="#">Client</BreadcrumbLink>
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
            <h1 className="text-2xl font-bold">Clients List</h1>
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
              {selectedClients.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedClients.length})
                </Button>
              )}
              <ClientDialog>
                <Button className='cursor-pointer'>
                  <abbr title="Add Client" className="sm:hidden">
                    <Plus className="h-4 w-4" />
                  </abbr>
                  <Plus className="hidden sm:block h-4 w-4" />
                  <span className="hidden sm:inline">Add Client</span>
                </Button>
              </ClientDialog>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                      checked={clientsData && clientsData.length > 0 && selectedClients.length === clientsData.length}
                      onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                      aria-label="Select all"
                      className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                    />
                  </TableHead>
                  <TableHead className="w-[240px]">Sr No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : clientsData?.length === 0 ? (
                  <TableRow >
                    <TableCell colSpan={6} className="text-center">No clients found</TableCell>
                  </TableRow>
                ) : (
                  clientsData?.map((client, index) => (
                    <TableRow
                      key={client.id}
                      onClick={() => navigate({ to: '/app/client/get/$id', params: { id: client.id } })}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                          aria-label={`Select client ${client.name || '-'}`}
                          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                        />
                      </TableCell>
                      <TableCell>{(currentPage - 1) * DEFAULT_PAGE_SIZE + index + 1}</TableCell>
                      <TableCell>{client.name || "-"}</TableCell>
                      <TableCell>{client.email || "-"}</TableCell>
                      <TableCell>{client.phone || "-"}</TableCell>
                      <TableCell>{format(new Date(client.createdAt * 1000), "PPP")}</TableCell>

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
            ) : clientsData?.length === 0 ? (
              <div className="col-span-full text-center py-4">No clients found</div>
            ) : (
              clientsData?.map((client, index) => (
                <div
                  key={client.id}
                  className="relative border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate({ to: '/app/client/get/$id', params: { id: client.id } })}
                >
                  <div
                    className="absolute top-2 right-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                      aria-label={`Select client ${client.name || '-'}`}
                      className="border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-gray-600 dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 pr-8">{client.name || "-"}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Email: {client.email || "-"}</p>
                    <p>Phone: {client.phone || "-"}</p>
                    <p>Created Date: {format(new Date(client.createdAt * 1000), "PPP") || "-"}</p>
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
            disabled={!clientsData || clientsData.length < DEFAULT_PAGE_SIZE}
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
              This action cannot be undone. This will permanently delete {selectedClients.length} selected client{selectedClients.length > 1 ? 's' : ''} from the database.
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
}
