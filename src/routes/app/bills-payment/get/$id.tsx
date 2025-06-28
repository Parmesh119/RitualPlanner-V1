import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { getBilByIdlAction, getAccountDetails, getTemplateByIdAction } from '@/lib/actions'
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { gujaratiFont } from '@/lib/gujaratiFont'

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bill', billId],
    queryFn: () => getBilByIdlAction(billId),
  })
  const { data: userData } = useQuery({
    queryKey: ["accountDetails"],
    queryFn: getAccountDetails,
    staleTime: 1000 * 60 * 60,
  })
  const [search, setSearch] = useState('')

  // Always define bill/items, even if data is undefined
  const bill = data?.bill;
  const items = data?.items || [];

  // Always call the template query, but only enable it if bill?.template_id exists
  const { data: templateData } = useQuery({
    queryKey: ['template', bill?.template_id],
    queryFn: () => bill?.template_id ? getTemplateByIdAction(bill.template_id) : undefined,
    enabled: !!bill?.template_id,
  });

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

  const filteredItems = items?.filter(item =>
    [item.itemname, item.quantity, item.unit, item.note]
      .map(val => (val ? val.toString().toLowerCase() : ''))
      .some(val => val.includes(search.toLowerCase()))
  ) || []

  function handleShare() {
    if (!bill || !userData) return;
    const message =
      `|| શ્રી ગણેશાય નમઃ ||\n\n` +
      `*Bill Information*\n` +
      `Title: ${bill.name || 'No title provided'}\n` +
      `Created Date: ${bill.createdAt ? format(new Date(bill.createdAt * 1000), 'PPP') : 'Not available'}\n` +
      `Status: ${bill.paymentstatus}\n` +
      `Total Amount: ${bill.totalamount ?? 0}\n\n` +
      `*Bill Items:*\n` +
      (items.length > 0
        ? items.map((item, idx) =>
          `${idx + 1}. ${item.itemname || ''} (${item.quantity || ''} ${item.unit || ''}) - ₹${item.marketrate}${item.extracharges ? ` + ₹${item.extracharges}` : ''}${item.note ? ' - ' + item.note : ''}`
        ).join('\n')
        : 'No items found for this bill.') +
      `\n\nFor any kind of query regarding this bill please contact ${userData?.name || 'N/A'} (${userData?.phone || 'N/A'}).`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  function handleDownload() {
    if (!bill || !userData) return;
    const doc = new jsPDF();

    // Register and use Gujarati font for the heading
    doc.addFileToVFS('Gujarati.ttf', gujaratiFont);
    doc.addFont('Gujarati.ttf', 'Gujarati', 'normal');
    doc.setFont('Gujarati');
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80); // dark blue
    const gujaratiText = '|| શ્રી ગણેશાય નમઃ ||';
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(gujaratiText);
    doc.text(gujaratiText, (pageWidth - textWidth) / 2, 22);

    let y = 35;

    // 1. User Information Section Header
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(10, y - 7, pageWidth - 20, 14, 3, 3, 'F');
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('User Information', 14, y + 3);
    y += 14;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${userData.name || ''}`, 16, y);
    y += 7;
    doc.text(`Phone: ${userData.phone || ''}`, 16, y);
    y += 12;

    // 2. Template Information Section
    if (typeof templateData !== 'undefined' && templateData?.ritualTemplate) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setFillColor(230, 240, 255);
      doc.roundedRect(10, y - 7, pageWidth - 20, 14, 3, 3, 'F');
      doc.text('Template Information', 14, y + 3);
      y += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Name: ${templateData.ritualTemplate.name || ''}`, 16, y);
      y += 7;
      if (templateData.ritualTemplate.description) {
        doc.text(`Description: ${templateData.ritualTemplate.description}`, 16, y);
        y += 7;
      }
      y += 5;
    }

    // 3. Bill Information Section Header
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(10, y - 7, pageWidth - 20, 14, 3, 3, 'F');
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill Information', 14, y + 3);
    y += 14;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Title: ${bill.name || 'No title provided'}`, 16, y);
    y += 7;
    doc.text(`Created Date: ${bill.createdAt ? format(new Date(bill.createdAt * 1000), 'PPP') : 'Not available'}`, 16, y);
    y += 7;
    doc.text(`Status: ${bill.paymentstatus}`, 16, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(44, 62, 80);
    doc.text(`Total Amount: ${bill.totalamount ?? 0}`, 16, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    y += 12;

    // 4. Bill Items Section Header
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(10, y - 7, pageWidth - 20, 14, 3, 3, 'F');
    doc.text('Bill Items', 14, y + 3);
    y += 10;

    // Table
    if (items.length > 0) {
      autoTable(doc, {
        startY: y + 4,
        head: [['Sr No', 'Item Name', 'Quantity', 'Unit', 'Market Rate', 'Extra Charges', 'Total', 'Note']],
        body: items.map((item, idx) => {
          const qty = Number(item.quantity) || 0;
          const rate = Number(item.marketrate) || 0;
          const extra = Number(item.extracharges) || 0;
          const total = qty * rate + extra;
          return [
            (idx + 1).toString(),
            item.itemname || '',
            item.quantity?.toString() || '',
            item.unit || '',
            item.marketrate ? `${item.marketrate}` : '-',
            item.extracharges ? `${item.extracharges}` : '-',
            total.toString(),
            item.note?.trim() ? item.note : '-'
          ];
        }),
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 11 },
        margin: { left: 14, right: 14 },
      });
      // Add note below the table
      const finalY = (doc as any).lastAutoTable?.finalY || (y + 30);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text('Note: Market Rate, Extra Charges, and Total Amount are in rupees.', 56, finalY + 8, { align: 'justify' });
    } else {
      doc.setFontSize(12);
      doc.text('No items found for this bill.', 14, y + 10);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const queryText = `For any kind of query regarding this bill please contact ${userData?.name || 'N/A'} (${userData?.phone || 'N/A'}).`;
    doc.text(queryText, pageWidth / 2, 285, { align: 'center', baseline: 'middle' });
    doc.text('Generated by Ritual Planner', pageWidth / 2, 292, { align: 'center' });

    doc.save(`${bill.name || 'bill'}.pdf`);
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
                <Link to="/app/bills-payment"><BreadcrumbLink>Bills & Payment</BreadcrumbLink></Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{bill?.name}</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold tracking-tight">{bill?.name}</h1>
              <Badge variant="secondary" className="text-xs">Bill</Badge>
            </span>
            <span className='flex flex-row gap-4'>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => bill?.id && navigate({ to: `/app/bills-payment/edit/$id`, params: { id: bill.id } })}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit Bill
              </Button>
              <Button className="flex items-center gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" /> Download Bill
              </Button>
              <Button className="flex items-center gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" /> Share Bill
              </Button>
            </span>
          </div>
        </div>
        {/* Tabs Section */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              Details
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              Items {items.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{items.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              Payments
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
                    <p className="text-base font-medium">{bill?.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Created Date</label>
                    <p className="text-base">{bill?.createdAt ? format(new Date(bill?.createdAt * 1000), 'PPP') : 'Not available'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Updated Date</label>
                    <p className="text-base">{bill?.updatedAt ? format(new Date(bill?.updatedAt * 1000), 'PPP') : 'Not available'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Status</label>
                    <p className="text-base">
                      <Badge className={`tracking-wider ${bill?.paymentstatus === 'PENDING' ? 'bg-amber-400 text-black' : 'bg-green-500 text-white'}`}>{bill?.paymentstatus}</Badge>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Total Amount</label>
                    <p className="text-base font-semibold">₹{bill?.totalamount ?? 0}</p>
                  </div>
                  {templateData?.ritualTemplate && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">Template Used</label>
                      <Link
                        to="/app/template/get/$id"
                        params={{ id: templateData.ritualTemplate.id }}
                        className="text-base tracking-wider font-semibold underline hover:text-primary text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {templateData.ritualTemplate.name}
                      </Link>
                      {templateData.ritualTemplate.description && (
                        <p className="text-sm text-muted-foreground">{templateData.ritualTemplate.description}</p>
                      )}
                    </div>
                  )}
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
                            <TableHead className="font-semibold">Total</TableHead>
                            <TableHead className="font-semibold">Note</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.map((item, idx) => {
                            const qty = Number(item.quantity) || 0;
                            const rate = Number(item.marketrate) || 0;
                            const extra = Number(item.extracharges) || 0;
                            const total = qty * rate + extra;
                            return (
                              <TableRow key={item.id || idx} className="hover:bg-muted/20 transition-colors">
                                <TableCell className="font-medium">{item.itemname}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.marketrate}</TableCell>
                                <TableCell>{item.extracharges ? item.extracharges : '-'}</TableCell>
                                <TableCell>{total}</TableCell>
                                <TableCell>{item.note?.trim() ? item.note : '-'}</TableCell>
                              </TableRow>
                            );
                          })}
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
          <TabsContent value="payments" className="mt-6">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                    <p className="text-base font-medium">
                      <Badge className={`tracking-wider ${bill?.paymentstatus === 'PENDING' ? 'bg-amber-400 text-black' : 'bg-green-500 text-white'}`}>{bill?.paymentstatus}</Badge>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                    <p className="text-base font-semibold">₹{bill?.totalamount ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Payment records will be shown here in the future.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
