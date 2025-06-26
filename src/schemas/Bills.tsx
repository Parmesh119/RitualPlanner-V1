import { z } from 'zod'

export const BillSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    name: z.string().min(1, "Name is required"),
    template_id: z.string().min(1, "Need to select the template"),
    totalamount: z.number().int().positive().nullable().optional(),
    paymentstatus: z.string().nullable().optional().default("PENDING"),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now()),
})

export const ItemBIllSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    bill_id: z.string().uuid().nullable().optional().default(() => crypto.randomUUID()),
    itemname: z.string().min(1, "Item name is required"),
    quantity: z.number().int({ message: "Quantity must be positive integer." }).positive(),
    unit: z.string().min(1, "Unit is required"),
    marketrate: z.number().int({ message: "Market rate must be positive integer." }).positive(),
    extracharges: z.number().int({ message: "Extra charges must be non-negative integer." }).nonnegative().nullable().optional(), // Allow 0 for extra charges
    note: z.string().nullable().optional(),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now()),
})

export const RequestBill = z.object({
    bill: BillSchema, // Changed from 'Bill' to 'bill' to match backend
    items: z.array(ItemBIllSchema)
})

export type ListBill = {
    search?: string | null
    page: number
    size: number
    status?: string | null,
    startDate?: number | null
    endDate?: number | null
}

export type TBill = z.infer<typeof BillSchema>
export type TItemBill = z.infer<typeof ItemBIllSchema>
export type TRequestBill = z.infer<typeof RequestBill>