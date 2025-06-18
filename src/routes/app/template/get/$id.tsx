import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getTemplateByIdAction } from '@/lib/actions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
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
import { Calendar, Package, FileText, AlertCircle, Pencil } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/app/template/get/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/app/template/get/$id' })
  const { data, isLoading, error } = useQuery({
    queryKey: ['template', id],
    queryFn: () => getTemplateByIdAction(id),
    enabled: !!id,
  })

  const template = data?.ritualTemplate
  const items = data?.requiredItems ?? []

  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mx-auto justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading template details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <SidebarInset className='w-full'>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4 tracking-wider">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={() => navigate({ to: "/app/template" })}>Templates</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Error</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="max-w-4xl mx-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load template. Please try again later.
            </AlertDescription>
          </Alert>
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
                <BreadcrumbLink
                  href="#"
                  onClick={() => navigate({ to: "/app/template" })}
                  className="hover:text-foreground transition-colors"
                >
                  Templates
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{template?.name || 'Loading...'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 justify-between">
            <span className='flex flex-row gap-4'>
            <h1 className="text-2xl font-bold tracking-tight">{template?.name || 'Untitled Template'}</h1>
            <Badge variant="secondary" className="text-xs">
              Template
            </Badge>
            </span>
            <Button
              size="sm"
              variant="outline"
              className="ml-2"
              onClick={() => navigate({ to: `/app/template/edit/${id}` })}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit Template
            </Button>
          </div>
          {template?.description && (
            <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
              {template.description}
            </p>
          )}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items {items.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{items.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Template Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <p className="text-base font-medium">{template?.name || 'No title provided'}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created Date
                    </label>
                    <p className="text-base">
                      {template?.createdAt ? format(new Date(template.createdAt), 'PPP') : 'Not available'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-base leading-relaxed">
                      {template?.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="mt-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Required Items
                  {items.length > 0 && (
                    <Badge variant="outline" className="ml-auto">
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length > 0 ? (
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="font-semibold">Item Name</TableHead>
                          <TableHead className="font-semibold">Quantity</TableHead>
                          <TableHead className="font-semibold">Unit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item: { id?: string; itemname?: string; quantity?: number; unit?: string }, idx: number) => (
                          <TableRow key={item.id || idx} className="hover:bg-muted/20 transition-colors">
                            <TableCell className="font-medium">
                              {item.itemname || <span className="text-muted-foreground italic">No name</span>}
                            </TableCell>
                            <TableCell>
                              {item.quantity !== undefined ? item.quantity : <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell>
                              {item.unit || <span className="text-muted-foreground">-</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Items Found</h3>
                    <p className="text-muted-foreground">This template doesn't have any required items yet.</p>
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