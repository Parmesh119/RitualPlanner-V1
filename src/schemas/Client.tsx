import { z } from 'zod'
import { indianStatesAndUTs } from '@/util/state'

export const ClientSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable().optional(),
    email: z.string().email("Invalid email format").nullable().optional(),
    phone: z.string()
        .min(10, "Phone number must be exactly 10 digits")
        .max(10, "Phone number must be exactly 10 digits")
        .regex(/^[6-9]\d{9}$/, "Phone number must be a valid Indian number"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "state is required")
        .refine((val) => indianStatesAndUTs.includes(val), {
            message: "Please enter a valid Indian state",
        }),
    zipcode: z.string()
        .min(6, "Zipcode must be exactly 6 digits")
        .max(6, "Zipcode must be exactly 6 digits")
        .regex(/^\d{6}$/, "Zipcode must contain only numbers").nullable().optional(),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export type ListClient = {
    search?: string | null,
    page: number
    size: number
}

export type TClient = z.infer<typeof ClientSchema>;
