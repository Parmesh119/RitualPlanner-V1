import { z } from 'zod'

export const TemplateSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    name: z.string().min(1, "name is required"),
    description: z.string().nullable().optional(),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const ItemTemplateSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    template_id: z.string().uuid().nullable().optional().default(() => crypto.randomUUID()),
    itemname: z.string().min(1, "Item name is required"),
    quantity: z.number().int().min(1, "Quantity is required"),
    unit: z.string().min(1, "Unit is required"),
    note: z.string().nullable().optional(),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

const RitualTemplateRequest = z.object({
    ritualTemplate: TemplateSchema,
    requiredItems: z.array(ItemTemplateSchema)
})

export type ListTemplate = {
    search?: string | null,
    page: number,
    size: number
}

export type TTemplate = z.infer<typeof TemplateSchema>
export type TItemTemplate = z.infer<typeof ItemTemplateSchema>
export type TRitualTemplateRequest = z.infer<typeof RitualTemplateRequest>