import { z } from 'zod';

// Zod schema for User
export const UserSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone is required"),
    state: z.string(),
    country: z.string().optional(),
    createdAt: z.number().int().positive().optional(),
    updatedAt: z.number().int().positive().optional()
});

export type User = z.infer<typeof UserSchema>;