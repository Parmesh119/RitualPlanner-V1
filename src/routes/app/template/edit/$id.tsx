import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTemplateByIdAction, updateTemplateAction } from '@/lib/actions'
import { TemplateSchema, ItemTemplateSchema, type TRitualTemplateRequest } from '@/schemas/Template'
import { toast } from 'sonner'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Pencil } from 'lucide-react'

const templateSchema = TemplateSchema.pick({ name: true, description: true })
const itemSchema = ItemTemplateSchema

export const Route = createFileRoute('/app/template/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/app/template/edit/$id' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  // Use cached data if available, otherwise fetch
  const cachedData = queryClient.getQueryData(['template', id]) as any
  const { data, isLoading, error } = useQuery({
    queryKey: ['template', id],
    queryFn: () => getTemplateByIdAction(id),
    enabled: !!id && !cachedData,
    initialData: cachedData,
  })

  // Form setup
  const templateForm = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const itemForm = useForm<Pick<z.infer<typeof itemSchema>, 'itemname' | 'quantity' | 'unit' | 'note'>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemname: '',
      quantity: 0,
      unit: '',
      note: '',
    },
  })

  // Pre-fill form when data loads
  useEffect(() => {
    if (data?.ritualTemplate) {
      templateForm.reset({
        name: data.ritualTemplate.name || '',
        description: data.ritualTemplate.description || '',
      })
      setItems(data.requiredItems || [])
    }
  }, [data, templateForm])

  // Mutation for update
  const updateTemplateMutation = useMutation({
    mutationFn: (payload: TRitualTemplateRequest) => updateTemplateAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template', id] })
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      toast.success('Template updated successfully', {
        style: {
          background: 'linear-gradient(90deg, #38A169, #2F855A)',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '13px',
          letterSpacing: '1px',
        },
      })
      navigate({ to: `/app/template/get/${id}` })
    },
    onError: (error: any) => {
      toast.error('Failed to update template', {
        description: error.message,
        style: {
          background: 'linear-gradient(90deg, #E53E3E, #C53030)',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '13px',
          letterSpacing: '1px',
        },
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  // Step 1 submit
  const onTemplateSubmit = (values: z.infer<typeof templateSchema>) => {
    setStep(2)
  }

  // Add item
  const onAddItem = (values: Pick<z.infer<typeof itemSchema>, 'itemname' | 'quantity' | 'unit' | 'note'>) => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        template_id: id,
        itemname: values.itemname,
        quantity: values.quantity,
        unit: values.unit,
        note: values.note,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ])
    itemForm.reset({ itemname: '', quantity: 0, unit: '', note: '' })
  }

  // Remove item
  const onRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Edit item handler
  const onEditItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      itemForm.reset({
        itemname: item.itemname,
        quantity: item.quantity,
        unit: item.unit,
        note: item.note ?? '',
      })
      setEditingItemId(itemId)
    }
  }

  // Update item handler
  const onUpdateItem = (values: Pick<z.infer<typeof itemSchema>, 'itemname' | 'quantity' | 'unit' | 'note'>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingItemId
          ? {
            ...item,
            itemname: values.itemname,
            quantity: values.quantity,
            unit: values.unit,
            note: values.note,
            updatedAt: Date.now(),
          }
          : item
      )
    )
    setEditingItemId(null)
    itemForm.reset({ itemname: '', quantity: 0, unit: '', note: '' })
  }

  // Cancel edit handler
  const onCancelEdit = () => {
    setEditingItemId(null)
    itemForm.reset({ itemname: '', quantity: 0, unit: '', note: '' })
  }

  // Update complete
  const onUpdate = () => {
    if (items.length === 0) {
      toast.error('Please add at least one item', {
        style: {
          background: 'linear-gradient(90deg, #E53E3E, #C53030)',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '13px',
          letterSpacing: '1px',
        },
      })
      return
    }
    setIsSubmitting(true)
    const templateValues = templateForm.getValues()
    const now = Date.now()
    const itemsWithTimestamps = items.map(item => ({
      ...item,
      createdAt: now,
      updatedAt: now,
    }))
    updateTemplateMutation.mutate({
      ritualTemplate: {
        ...templateValues,
        id: id,
        createdAt: data?.ritualTemplate?.createdAt ?? now,
        updatedAt: now,
      },
      requiredItems: itemsWithTimestamps,
    })
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
      <SidebarInset className='w-full rounded-t-xl'>
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
          <div className="bg-red-100 text-red-800 p-4 rounded">Failed to load template. Please try again later.</div>
        </div>
      </SidebarInset>
    )
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
                <BreadcrumbLink href="#" onClick={() => navigate({ to: "/app/template" })}>Templates</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Template (Step {step} of 2)</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-4 px-4 md:px-8 py-2">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-start justify-between mb-6">
            <h1 className="text-2xl font-bold">Edit Template</h1>
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Step {step} of 2</span>
            </div>
          </div>
          {step === 1 ? (
            <Form {...templateForm}>
              <form onSubmit={templateForm.handleSubmit(onTemplateSubmit)} className="space-y-4">
                <FormField
                  control={templateForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={templateForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter template description"
                          className="resize-none"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: `/app/template/get/${id}` })}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Form {...itemForm}>
                <form
                  onSubmit={
                    editingItemId
                      ? itemForm.handleSubmit(onUpdateItem)
                      : itemForm.handleSubmit(onAddItem)
                  }
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={itemForm.control}
                      name="itemname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter item name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={itemForm.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="Enter quantity"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={itemForm.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <select
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value || ''}
                            >
                              <option value="" disabled>Select unit</option>
                              <option value="grams (g)">grams (g)</option>
                              <option value="kilograms (kg)">kilograms (kg)</option>
                              <option value="milliliters (ml)">milliliters (ml)</option>
                              <option value="liters (l)">liters (l)</option>
                              <option value="pieces (pcs)">pieces (pcs)</option>
                              <option value="packets">packets</option>
                              <option value="bundles">bundles</option>
                              <option value="sheets">sheets</option>
                              <option value="pairs">pairs</option>
                              <option value="numbers">numbers</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={itemForm.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter note that you want"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    {editingItemId ? (
                      <>
                        <Button type="button" variant="outline" onClick={onCancelEdit}>
                          Cancel
                        </Button>
                        <Button type="submit" className="flex items-center gap-2">
                          Update Item
                        </Button>
                      </>
                    ) : (
                      <Button type="submit" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Item
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={onUpdate}
                      disabled={isSubmitting || items.length === 0}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Template'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate({ to: `/app/template/get/${id}` })}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
              {items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Added Items</h3>
                  <div className="border rounded-lg divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.itemname}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditItem(item.id)}
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
