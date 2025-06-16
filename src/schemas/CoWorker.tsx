import { z } from "zod";

export const CoWorkerSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional().nullable(),
    phone: z
        .string()
        .min(10, "Phone number must be exactly 10 digits")
        .max(10, "Phone number must be exactly 10 digits")
        .regex(/^[6-9]\d{9}$/, "Phone number must be a valid Indian number"),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
});

export type ListCoWorker = {
    search?: string | null
    page: number
    size: number
}

export type TCoWorker = z.infer<typeof CoWorkerSchema>;
