import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAccountDetails, getTemplateByIdAction } from '@/lib/actions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
import { Calendar, Package, FileText, AlertCircle, Pencil, ExternalLink, Download } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { gujaratiFont } from '@/lib/gujaratiFont'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

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

  const { data: userData, isError } = useQuery({
    queryKey: ["accountDetails"],
    queryFn: getAccountDetails,
    staleTime: 1000 * 60 * 60,
  })

  const [search, setSearch] = useState('')
  const filteredItems = items.filter(item =>
    [item.itemname, item.quantity, item.unit, item.note]
      .map(val => (val ? val.toString().toLowerCase() : ''))
      .some(val => val.includes(search.toLowerCase()))
  )

  if (isError) {
    toast.error("Error while fetching user details! Please login again. ", {
      description: "Logging out ...",
      style: {
        background: "linear-gradient(90deg, #E53E3E, #C53030)",
        color: "white",
        fontWeight: "bolder",
        fontSize: "13px",
        letterSpacing: "1px",
      }
    })
    navigate({ to: "/auth/login" })
    localStorage.clear()
    throw new Error("Error while fetching user details!")
  }

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

  function handleDownload() {
    if (!template || !userData) return;
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

    // Switch back to helvetica for the rest
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // User Information Section Header
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

    // Template Information Section Header
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(10, y - 7, pageWidth - 20, 14, 3, 3, 'F');
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('Template Information', 14, y + 3);
    y += 14;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Title: ${template.name || 'No title provided'}`, 16, y);
    y += 7;
    doc.text(`Created Date: ${template.createdAt ? format(new Date(template.createdAt * 1000), 'PPP') : 'Not available'}`, 16, y);
    y += 7;
    doc.text('Description:', 16, y);
    y += 7;
    doc.setFontSize(11);
    doc.text(template.description || 'No description provided', 20, y, { maxWidth: pageWidth - 32 });
    y += 14;

    // Required Items Section Header
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(10, y - 7, pageWidth - 20, 14, 3, 3, 'F');
    doc.text('Required Items', 14, y + 3);
    y += 10;

    // Table
    if (items.length > 0) {
      autoTable(doc, {
        startY: y + 4,
        head: [['Sr No', 'Item Name', 'Quantity', 'Unit', 'Note']],
        body: items.map((item, idx) => [
          (idx + 1).toString(),
          item.itemname || '',
          item.quantity?.toString() || '',
          item.unit || '',
          item.note?.trim() ? item.note : '-'
        ]),
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 11 },
        margin: { left: 14, right: 14 },
      });
    } else {
      doc.setFontSize(12);
      doc.text('No items found for this template.', 14, y + 10);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const queryText = `For any kind of query regarding this template please contact ${userData?.name || 'N/A'} (${userData?.phone || 'N/A'}).`;
    doc.text(queryText, pageWidth / 2, 285, { align: 'center', baseline: 'middle' });
    doc.text('Generated by Ritual Planner', pageWidth / 2, 292, { align: 'center' });

    doc.save(`${template.name || 'template'}.pdf`);
  }

  function handleShare() {
    if (!template || !userData) return;

    // Compose the message
    const message =
      `|| શ્રી ગણેશાય નમઃ ||\n\n` +
      `*Template Information*\n` +
      `Title: ${template.name || 'No title provided'}\n` +
      `Created Date: ${template.createdAt ? format(new Date(template.createdAt * 1000), 'PPP') : 'Not available'}\n` +
      `Description: ${template.description || 'No description provided'}\n\n` +
      `*Required Items:*\n` +
      (items.length > 0
        ? items.map((item, idx) =>
          `${idx + 1}. ${item.itemname || ''} (${item.quantity || ''} ${item.unit || ''})${item.note ? ' - ' + item.note : ''}`
        ).join('\n')
        : 'No items found for this template.') +
      `\n\nFor any kind of query regarding this template please contact ${userData?.name || 'N/A'} (${userData?.phone || 'N/A'}).`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp share URL
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
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
            <span className='flex flex-row gap-4'>
              <Button
                size="sm"
                variant="outline"
                className="ml-2"
                onClick={() => navigate({ to: `/app/template/edit/${id}` })}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit Template
              </Button>
              <Button className='cursor-pointer' onClick={handleDownload}><Download />
                Download Template
              </Button>
              <Button className='cursor-pointer' onClick={handleShare}>
                {/* WhatsApp SVG icon */}
                <ExternalLink />
                Share Template
              </Button>
            </span>
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
                      {template?.createdAt ? format(new Date(template.createdAt * 1000), 'PPP') : 'Not available'}
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

                <div className="mt-4 text-sm text-muted-foreground">
                  For any kind of query regarding this template please contact <b>{userData?.name} ({userData?.phone})</b>.
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
                            <TableHead className="font-semibold">Sr No</TableHead>
                            <TableHead className="font-semibold">Item Name</TableHead>
                            <TableHead className="font-semibold">Quantity</TableHead>
                            <TableHead className="font-semibold">Unit</TableHead>
                            <TableHead className="font-semibold">Note</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(filteredItems as { id?: string; itemname?: string; quantity?: number; unit?: string; note?: string | null }[]).map((item, idx) => (
                            <TableRow key={item.id || idx} className="hover:bg-muted/20 transition-colors">
                              <TableCell className="font-medium">{idx + 1}</TableCell>
                              <TableCell className="font-medium">{item.itemname}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>{item.note?.trim() ? item.note : '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
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