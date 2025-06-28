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
import { ItemBIllSchema, BillSchema, type TBill, type TItemBill, RequestBill, type TRequestBill } from '@/schemas/Bills'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listTemplateAction, getTemplateByIdAction, createBillAction } from '@/lib/actions'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import type { TTemplate, TRitualTemplateRequest } from '@/schemas/Template'
import { z } from 'zod'
import { toast } from 'sonner'
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

export const Route = createFileRoute('/app/bills-payment/create')({
  component: RouteComponent,
})

function RouteComponent() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [step, setStep] = useState(1)
  const [itemInputs, setItemInputs] = useState<any[]>([])
  const DEFAULT_PAGE_SIZE = 10
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingBillData, setPendingBillData] = useState<any>(null)

  const { data: templatesData = [], isLoading } = useQuery<TTemplate[]>({
    queryKey: ['templates', 1, searchQuery],
    queryFn: () => listTemplateAction({ page: 1, size: DEFAULT_PAGE_SIZE, search: searchQuery || undefined }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createBill = useMutation({
    mutationFn: async (requestBill: TRequestBill) => {
      console.log('Sending request to backend:', requestBill)
      try {
        const result = await createBillAction(requestBill)
        console.log('Backend response:', result)
        return result
      } catch (error) {
        console.error('Network error:', error)
        throw error
      }
    },
    onSuccess: async (data) => {
      if (data) {
        toast.success("Bill Created Successfully", {
          style: {
            background: "linear-gradient(90deg, #38A169, #2F855A)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        // Invalidate bills list and navigate
        await queryClient.invalidateQueries({ queryKey: ['bills'] })
        setStep(1)
        setSelectedTemplate(null)
        setItemInputs([])
        navigate({ to: "/app/bills-payment" })
      }
    },
    onError: (error) => {
      console.error('Bill creation error:', error)
      toast.error("Error while creating bill", {
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
    }
  })

  // Fetch selected template details (step 2)
  const {
    data: selectedTemplateData,
    isLoading: isTemplateLoading,
  } = useQuery<TRitualTemplateRequest | undefined>({
    queryKey: ['template-details', selectedTemplate],
    queryFn: () => selectedTemplate ? getTemplateByIdAction(selectedTemplate) : undefined,
    enabled: !!selectedTemplate && step === 2,
    staleTime: 5 * 60 * 1000,
  })

  // Initialize itemInputs when template data is loaded
  useEffect(() => {
    if (selectedTemplateData && step === 2) {
      setItemInputs(selectedTemplateData.requiredItems.map((item: any) => ({
        ...item,
        marketrate: '',
        extracharges: '', // Changed from 'extraCharge' to 'extracharges'
      })))
    }
  }, [selectedTemplateData, step])

  // Calculate totals
  const itemTotals = itemInputs.map(item => {
    const qty = Number(item.quantity) || 0
    const rate = Number(item.marketrate) || 0
    const extra = Number(item.extracharges) || 0 // Changed from 'extraCharge' to 'extracharges'
    return qty * rate + extra
  })
  const globalTotal = itemTotals.reduce((a, b) => a + b, 0)

  // Handlers
  const handleItemInputChange = (idx: number, field: string, value: string) => {
    setItemInputs(inputs => inputs.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  // Handler for shadcn add template
  const handleAddTemplate = () => {
    window.open('https://ui.shadcn.com/docs/components/button', '_blank')
  }

  // Handler for Complete
  const handleComplete = () => {
    try {
      // Create the bill object
      const bill = BillSchema.parse({
        name: selectedTemplateData?.ritualTemplate.name || '',
        template_id: selectedTemplate,
        totalamount: globalTotal,
        paymentstatus: 'PENDING',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      // Create the items array with proper validation
      const items = itemInputs.map(item => {
        // Ensure correct types and field names for schema
        let marketrate = Number(item.marketrate)
        if (isNaN(marketrate) || marketrate === null || marketrate === undefined) marketrate = 0
        marketrate = Math.floor(marketrate)
        let extracharges = Number(item.extracharges)
        if (isNaN(extracharges) || extracharges === null || extracharges === undefined) extracharges = 0
        extracharges = Math.floor(extracharges)
        return {
          itemname: item.itemname,
          quantity: Number(item.quantity),
          unit: item.unit,
          marketrate: marketrate,
          extracharges: extracharges,
          note: item.note,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      })

      // Custom validation for marketrate (must be > 0)
      const invalidIdx = items.findIndex(item => item.marketrate === null || item.marketrate === undefined || item.marketrate <= 0)
      if (invalidIdx !== -1) {
        throw new z.ZodError([
          {
            code: z.ZodIssueCode.custom,
            message: `Market rate is required and must be greater than 0 for item: ${items[invalidIdx].itemname}`,
            path: [invalidIdx, 'marketrate'],
          },
        ])
      }

      // Validate items with Zod
      items.forEach((item) => {
        ItemBIllSchema.parse(item)
      })

      // Create the request object with correct structure
      const requestBill = RequestBill.parse({ bill, items })
      setPendingBillData(requestBill)
      setShowConfirmDialog(true)
    } catch (err: any) {
      alert(err.message)
      if (err instanceof z.ZodError) {
        const msg = err.errors?.[0]?.message || 'Validation error'
        toast.error(msg, {
          style: {
            background: "linear-gradient(90deg, #E53E3E, #C53030)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
      } else {
        toast.error('Failed to create bill', {
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
  }

  const handleConfirmOk = () => {
    if (pendingBillData) {
      createBill.mutate(pendingBillData)
      setPendingBillData(null)
    }
    setShowConfirmDialog(false)
  }

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false)
    setPendingBillData(null)
  }

  return <>
    <SidebarInset className='w-full'>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Bills & Payment</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Bill (Step {step} of 2)</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-4 px-4 md:px-8 py-2">
        {step === 1 && <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-4">Loading templates...</div>
          ) : templatesData.length === 0 ? (
            <div className="text-center py-4">
              No templates found.<br />
              <Button onClick={handleAddTemplate} className="mt-2 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Template
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {templatesData.map((template) => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <label
                    key={template.id}
                    className={`flex items-center gap-2 cursor-pointer border rounded-md px-4 py-2 hover:bg-muted/50 transition-colors ${isSelected ? 'border-primary bg-primary/10 dark:bg-primary/20 ring-2 ring-primary' : ''}`}
                    style={isSelected ? { boxShadow: '0 0 0 2px var(--color-primary)' } : {}}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={isSelected}
                      onChange={() => setSelectedTemplate(template.id)}
                      className="accent-primary h-4 w-4"
                    />
                    <span className="font-semibold">{template.name}</span>
                    <span className="text-muted-foreground text-xs ml-2">{template.description || 'No description'}</span>
                  </label>
                );
              })}
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedTemplate}
              className="px-6"
            >
              Next
            </Button>
          </div>
        </>}
        {step === 2 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Template Items</h2>
            {isTemplateLoading ? (
              <div className="text-center py-4">Loading template details...</div>
            ) : selectedTemplateData ? (
              <div className="overflow-x-auto">
                <div className="flex justify-end flex-col items-end mb-1">
                  <span className="text-lg font-bold">Global Total: ₹{globalTotal}</span>
                </div>
                <table className="min-w-full border rounded-md text-sm" >
                  <colgroup>
                    <col /> {/* Item Name */}
                    <col /> {/* Quantity */}
                    <col /> {/* Unit */}
                    <col /> {/* Note */}
                    <col /> {/* Market Rate */}
                    <col /> {/* Extra Charges */}
                    <col /> {/* Total */}
                  </colgroup>
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-4 py-2 font-semibold text-left">Item Name</th>
                      <th className="px-4 py-2 font-semibold text-center">Quantity</th>
                      <th className="px-4 py-2 font-semibold text-center">Unit</th>
                      <th className="px-4 py-2 font-semibold text-left">Note</th>
                      <th className="px-4 py-2 font-semibold text-center">Market Rate</th>
                      <th className="px-4 py-2 font-semibold text-center">Extra Charges</th>
                      <th className="px-4 py-2 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemInputs.map((item, idx) => (
                      <tr key={item.id || idx} className="border-b hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-2">{item.itemname}</td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-center">{item.unit}</td>
                        <td className="px-4 py-2">{item.note || '-'}</td>
                        <td className="px-4 py-2 text-center">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={item.marketrate}
                            onChange={e => handleItemInputChange(idx, 'marketrate', e.target.value)}
                            placeholder="Market Rate"
                            className="w-full text-center bg-background border-border focus:ring-2 focus:ring-primary"
                            style={{ minWidth: 0 }}
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={item.extracharges} // Changed from 'extraCharge' to 'extracharges'
                            onChange={e => handleItemInputChange(idx, 'extracharges', e.target.value)} // Changed field name
                            placeholder="Extra Charges"
                            className="w-full text-center bg-background border-border focus:ring-2 focus:ring-primary"
                            style={{ minWidth: 0 }}
                          />
                        </td>
                        <td className="px-4 py-2 font-semibold text-right">₹{itemTotals[idx]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <span className="text-sm text-muted-foreground mt-2 block">
                  Global Total = sum of (quantity × market rate + extra charges) for all items.
                </span>
                <div className="flex justify-between mt-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={createBill.isPending}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={createBill.isPending}
                    className="min-w-[100px]"
                  >
                    {createBill.isPending ? 'Creating...' : 'Complete'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">No template data found.</div>
            )}
          </div>
        )}
      </div>
    </SidebarInset>
    <AlertDialog open={showConfirmDialog} onOpenChange={() => { }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Template Change Notice</AlertDialogTitle>
          <AlertDialogDescription>
            Any changes in the selected template will <b>not</b> reflect to this bill. You need to create a new bill after making changes to that template.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleConfirmCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmOk}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
}