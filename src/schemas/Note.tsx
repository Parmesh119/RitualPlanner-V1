import { z } from 'zod';

// Note Schema
export const NoteSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    title: z.string().min(1, 'Title is required'),
    description: z.string({ required_error: "Description is required" }).min(1, "Description is required"),
    reminder_date: z
        .number()
        .int()
        .positive()
        .optional(),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
});

// DeleteNote Schema
const DeleteNoteSchema = z.object({
    id: z.string().uuid('Invalid UUID format')
});

export type ListNote = {
    search?: string | null
    page: number
    size: number
    startDate?: number | null
    endDate?: number | null
}

// Type inferences
export type TNote = z.infer<typeof NoteSchema>;
export type TDeleteNote = z.infer<typeof DeleteNoteSchema>;