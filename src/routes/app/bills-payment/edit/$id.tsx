import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getBilByIdlAction, updateBillAction } from '@/lib/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ItemBIllSchema, BillSchema, type TBill, type TItemBill, RequestBill, type TRequestBill } from '@/schemas/Bills'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Save, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/app/bills-payment/edit/$id')({
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
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['bill', billId],
    queryFn: () => getBilByIdlAction(billId),
  })
  const [bill, setBill] = useState<TBill | null>(null)
  const [items, setItems] = useState<TItemBill[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prefill form when data loads
  useEffect(() => {
    if (data) {
      setBill(data.bill)
      setItems(data.items)
    }
  }, [data])

  // Calculate totals
  const itemTotals = items.map(item => {
    const qty = Number(item.quantity) || 0
    const rate = Number(item.marketrate) || 0
    const extra = Number(item.extracharges) || 0
    return qty * rate + extra
  })
  const globalTotal = itemTotals.reduce((a, b) => a + b, 0)

  // Handlers
  const handleBillChange = (field: keyof TBill, value: any) => {
    setBill(prev => prev ? { ...prev, [field]: value } : prev)
  }
  const handleItemChange = (idx: number, field: keyof TItemBill, value: any) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }
  const handleAddItem = () => {
    setItems(items => [
      ...items,
      {
        id: crypto.randomUUID(),
        bill_id: bill?.id || '',
        itemname: '',
        quantity: 1,
        unit: '',
        marketrate: 0,
        extracharges: 0,
        note: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ])
  }
  const handleRemoveItem = (idx: number) => {
    setItems(items => items.filter((_, i) => i !== idx))
  }

  // Mutation
  const updateBill = useMutation({
    mutationFn: async (requestBill: TRequestBill) => {
      try {
        const result = await updateBillAction(requestBill)
        return result
      } catch (error) {
        throw error
      }
    },
    onSuccess: async (data) => {
      if (data) {
        toast.success("Bill updated successfully!", {
          style: {
            background: "linear-gradient(90deg, #38A169, #2F855A)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        // Update the cache for the bill details page
        queryClient.setQueryData(['bill', billId], data)
      }
      await queryClient.invalidateQueries({ queryKey: ['bills'] })
      navigate({ to: `/app/bills-payment/get/$id`, params: { id: billId } })
    },
    onError: (error: any) => {
      toast.error("Failed to update bill", {
        description: error.message || "Something went wrong. Please try again.",
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
    },
    onSettled: () => setIsSubmitting(false),
  })

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (!bill) throw new Error('Bill not loaded')
      // Ensure createdAt and updatedAt for items
      const now = Date.now()
      const validatedItems = items.map(item =>
        ItemBIllSchema.parse({
          ...item,
          quantity: Number(item.quantity),
          marketrate: Number(item.marketrate),
          extracharges: Number(item.extracharges),
          createdAt: now,
          updatedAt: now,
        })
      )
      // Ensure createdAt and updatedAt for bill
      const validatedBill = BillSchema.parse({
        ...bill,
        totalamount: globalTotal,
        createdAt: bill.createdAt || now,
        updatedAt: now,
      })
      // Compose request
      const requestBill = RequestBill.parse({ bill: validatedBill, items: validatedItems })
      updateBill.mutate(requestBill)
    } catch (err: any) {
      setIsSubmitting(false)
      if (err instanceof Error) {
        toast.error(err.message)
      } else if (err instanceof Array && err[0]?.message) {
        toast.error(err[0].message)
      } else {
        toast.error('Validation error')
      }
    }
  }

  if (isLoading) {
    return <div className="flex flex-col items-center mx-auto justify-center h-[calc(100vh-4rem)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading bill details...</p>
      </div>
    </div>
  }
  if (isError || !bill) {
    return <SidebarInset className='w-full rounded-t-xl'>
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-destructive">Failed to load bill for editing.</div>
      </div>
    </SidebarInset>
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
                <BreadcrumbLink href="/app/bills-payment">Bills & Payment</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Separator className="mb-4" />
      <form className="flex flex-col gap-6 px-4 md:px-8 py-2 w-full mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Bill Name</label>
            <Input value={bill.name} onChange={e => handleBillChange('name', e.target.value)} required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <Input value={bill.paymentstatus || ''} disabled required />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Total Amount</label>
            <Input value={globalTotal} readOnly className="bg-muted/30" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Bill Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-md text-sm">
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
                {items.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2">
                      <Input value={item.itemname} disabled required />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Input type="number" min="1" value={item.quantity} disabled required className="text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Input value={item.unit} disabled required className="text-center" />
                    </td>
                    <td className="px-4 py-2">
                      <Input value={item.note || ''} onChange={e => handleItemChange(idx, 'note', e.target.value)} />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Input type="number" min="0" value={item.marketrate} onChange={e => handleItemChange(idx, 'marketrate', e.target.value)} required className="text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Input type="number" min="0" value={item.extracharges || 0} onChange={e => handleItemChange(idx, 'extracharges', e.target.value)} className="text-center" />
                    </td>
                    <td className="px-4 py-2 font-semibold text-right">₹{itemTotals[idx]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <span className="text-sm text-muted-foreground mt-2 block">
              Global Total = sum of (quantity × market rate + extra charges) for all items.
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-6 gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: `/app/bills-payment/get/$id`, params: { id: billId } })} disabled={isSubmitting} className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2"><Save className="h-4 w-4" /> {isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </SidebarInset>
  )
}
