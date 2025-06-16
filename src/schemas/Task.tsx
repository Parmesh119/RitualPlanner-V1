import { z } from 'zod';

export const TaskSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    taskOwner_id: z.string().uuid().optional(),
    name: z.string().min(1, { message: "Task name is required and cannot be empty" }).max(255, { message: "Task name cannot exceed 255 characters" }),
    date: z.number().int({ message: "Date must be an integer timestamp" }).positive({ message: "Date must be a positive timestamp" }).default(() => Date.now()),
    self: z.boolean({ message: "Self field must be a boolean value" }),
    location: z.string().min(1, { message: "Place is required and cannot be empty" }).max(255, { message: "Place cannot exceed 255 characters" }),
    payment_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    status: z.enum(['PENDING', 'COMPLETED', 'CANCELED'], { message: "Status must be either 'PENDING', 'COMPLETED', or 'CANCELED'" }).optional().default('PENDING'),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const TaskNoteSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    task_id: z.string().min(1, { message: "Task ID is required and cannot be empty" }),
    note_id: z.string().min(1, { message: "Note ID is required and cannot be empty" }),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const TaskAssistantSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    task_id: z.string().min(1, { message: "Task ID is required and cannot be empty" }),
    taskOwner_id: z.string().min(1, { message: "Task owner ID is required and cannot be empty" }),
    assistant_id: z.string().min(1, { message: "Assistant ID is required and cannot be empty" }),
    payment_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const PaymentSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    task_id: z.string().min(1, { message: "Task ID is required and cannot be empty" }),
    taskOwner_id: z.string().min(1, { message: "Task owner ID is required and cannot be empty" }),
    paidAmount: z.number().int({ message: "Paid amount must be an integer" }).nonnegative({ message: "Paid amount cannot be negative" }).optional().default(0),
    totalAmount: z.number().int({ message: "Total amount must be an integer" }).positive({ message: "Total amount must be greater than zero" }),
    paymentDate: z.number().int({ message: "Payment date must be an integer timestamp" }).positive({ message: "Payment date must be a positive timestamp" }).nullable().optional().default(() => Date.now()),
    paymentMode: z.enum(['CASH', 'ONLINE'], { message: "Payment mode must be one of: CASH, ONLINE, CARD, UPI" }).optional().default('CASH'),
    onlinePaymentMode: z.enum(['NET-BANKING', 'UPI', 'CHECK', 'CARD'], { message: "Payment mode must be one of: CARD, UPI, CHECK, NET-BANKING" }).nullable().optional().default(null),
    paymentStatus: z.enum(['PENDING', 'COMPLETED'], { message: "Payment status must be either 'PENDING' or 'COMPLETED'" }).optional().default('PENDING'),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export type TTask = z.infer<typeof TaskSchema>;
export type TTaskNote = z.infer<typeof TaskNoteSchema>;
export type TTaskAssistant = z.infer<typeof TaskAssistantSchema>;
export type TPayment = z.infer<typeof PaymentSchema>;

export type ListTask = {
    search?: string | null
    page: number
    size: number
    startDate?: number | null
    endDate?: number | null
    status?: string | null
    paymentStatus?: string | null
}