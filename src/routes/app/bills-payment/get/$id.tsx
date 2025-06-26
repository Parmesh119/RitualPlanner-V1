import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { getBilByIdlAction, getAccountDetails } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Pencil, Share2, Download } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export const Route = createFileRoute('/app/bills-payment/get/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      billId: params.id,
    }
  },
})

function RouteComponent() {
  const { billId } = Route.useLoaderData()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['bill', billId],
    queryFn: () => getBilByIdlAction(billId),
  })
  const { data: userData, isError } = useQuery({
    queryKey: ["accountDetails"],
    queryFn: getAccountDetails,
    staleTime: 1000 * 60 * 60,
  })
  const [search, setSearch] = useState('')

  if (isError) {
    // Optionally handle user error (logout, etc.)
    return (
      <SidebarInset className='w-full'>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-destructive">Error loading user info</div>
        </div>
      </SidebarInset>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mx-auto justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading bill details...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <SidebarInset className='w-full'>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-destructive">Bill not found</div>
        </div>
      </SidebarInset>
    )
  }

  const { bill, items } = data
  const filteredItems = items?.filter(item =>
    [item.itemname, item.quantity, item.unit, item.note]
      .map(val => (val ? val.toString().toLowerCase() : ''))
      .some(val => val.includes(search.toLowerCase()))
  ) || []

  return (
    <SidebarInset className='w-full'>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/app/bills-payment"><BreadcrumbLink>Bills & Payment</BreadcrumbLink></Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{bill.name}</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold tracking-tight">{bill.name}</h1>
              <Badge variant="secondary" className="text-xs">Bill</Badge>
            </span>
            <span className='flex flex-row gap-4'>
              <Button
                size="sm"
                variant="outline"
                className="ml-2"
                onClick={() => navigate({ to: `/app/bills-payment/edit/$id`, params: { id: bill.id } })}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit Bill
              </Button>
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Download Bill
              </Button>
              <Button  className="flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Share Bill
              </Button>
            </span>
          </div>
        </div>
        {/* Tabs Section */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              Details
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              Items {items.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{items.length}</Badge>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">Bill Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <p className="text-base font-medium">{bill.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Created Date</label>
                    <p className="text-base">{bill.createdAt ? format(new Date(bill.createdAt * 1000), 'PPP') : 'Not available'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Updated Date</label>
                    <p className="text-base">{bill.updatedAt ? format(new Date(bill.updatedAt * 1000), 'PPP') : 'Not available'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Status</label>
                    <p className="text-base">
                      <Badge className={`tracking-wider ${bill.paymentstatus === 'PENDING' ? 'bg-amber-400 text-black' : 'bg-green-500 text-white'}`}>{bill.paymentstatus}</Badge>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Total Amount</label>
                    <p className="text-base font-semibold">₹{bill.totalamount ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  For any kind of query regarding this bill please contact <b>{userData?.name} ({userData?.phone})</b>.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="items" className="mt-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">Bill Items
                  {items.length > 0 && (
                    <Badge variant="outline" className="ml-auto">{items.length} item{items.length !== 1 ? 's' : ''}</Badge>
                  )}
                </CardTitle>
                <Input
                  placeholder="Search items..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="mt-2 w-64"
                />
              </CardHeader>
              <CardContent>
                <div>
                  {filteredItems.length > 0 ? (
                    <div className="rounded-lg border border-border/50 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30">
                            <TableHead className="font-semibold">Item Name</TableHead>
                            <TableHead className="font-semibold">Quantity</TableHead>
                            <TableHead className="font-semibold">Unit</TableHead>
                            <TableHead className="font-semibold">Market Rate</TableHead>
                            <TableHead className="font-semibold">Extra Charges</TableHead>
                            <TableHead className="font-semibold">Note</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.map((item, idx) => (
                            <TableRow key={item.id || idx} className="hover:bg-muted/20 transition-colors">
                              <TableCell className="font-medium">{item.itemname}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>₹{item.marketrate}</TableCell>
                              <TableCell>{item.extracharges ? `₹${item.extracharges}` : '-'}</TableCell>
                              <TableCell>{item.note?.trim() ? item.note : '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium mb-2">No Items Found</h3>
                      <p className="text-muted-foreground">No items match your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
