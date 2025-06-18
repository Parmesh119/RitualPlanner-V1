import { z } from 'zod';
import { indianStatesAndUTs } from '@/util/state';
// Zod schema for User
export const UserSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string()
        .min(10, "Phone number must be exactly 10 digits")
        .max(10, "Phone number must be exactly 10 digits")
        .regex(/^[6-9]\d{9}$/, "Phone number must be a valid Indian number"),
    city: z.string().min(1, "Minimum one city is required").max(1, "Maximum one city is allowed"),
    state: z.string().min(1, "state is required")
        .refine((val) => indianStatesAndUTs.includes(val), {
            message: "Please enter a valid Indian state",
        }),
    country: z.string().optional(),
    zipcode: z.string()
        .min(6, "Zipcode must be exactly 6 digits")
        .max(6, "Zipcode must be exactly 6 digits")
        .regex(/^\d{6}$/, "Zipcode must contain only numbers"),
    createdAt: z.number().int().positive().optional(),
    updatedAt: z.number().int().positive().optional()
});

export type User = z.infer<typeof UserSchema>;