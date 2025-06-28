import { z } from 'zod';
import { AssistantPaymentSchema, PaymentSchema } from './Payment';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const TaskSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    taskOwner_id: z.string().uuid().min(1, "Task owner is required"),
    name: z.string().min(1, { message: "Task name is required and cannot be empty" }).max(255, { message: "Task name cannot exceed 255 characters" }),
    description: z.string().nullable().optional(),
    date: z.number().int({ message: "Date must be an integer timestamp" }).positive({ message: "Date must be a positive timestamp" }).default(() => Date.now()),
    starttime: z.string().regex(timeRegex, { message: "Invalid start time format" }),
    endtime: z.string().regex(timeRegex, { message: "Invalid end time format" }),
    self: z.boolean({ message: "Self field must be a boolean value" }),
    location: z.string().min(1, { message: "Place is required and cannot be empty" }).max(255, { message: "Place cannot exceed 255 characters" }),
    client_id: z.string().nullable().optional(),
    template_id: z.string().nullable().optional(),
    bill_id: z.string().nullable().optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'CANCELED'], { message: "Status must be either 'PENDING', 'COMPLETED', or 'CANCELED'" }).optional().default('PENDING'),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

// Request schemas without backend-handled IDs
export const TaskRequestSchema = z.object({
    taskOwner_id: z.string().uuid().min(1, "Task owner is required"),
    name: z.string().min(1, { message: "Task name is required and cannot be empty" }).max(255, { message: "Task name cannot exceed 255 characters" }),
    description: z.string().nullable().optional(),
    date: z.number().int({ message: "Date must be an integer timestamp" }).positive({ message: "Date must be a positive timestamp" }).default(() => Date.now()),
    starttime: z.string().regex(timeRegex, { message: "Invalid start time format" }),
    endtime: z.string().regex(timeRegex, { message: "Invalid end time format" }),
    self: z.boolean({ message: "Self field must be a boolean value" }),
    location: z.string().min(1, { message: "Place is required and cannot be empty" }).max(255, { message: "Place cannot exceed 255 characters" }),
    client_id: z.string().nullable().optional(),
    template_id: z.string().nullable().optional(),
    bill_id: z.string().nullable().optional(),
    status: z.enum(['PENDING', 'COMPLETED', 'CANCELED'], { message: "Status must be either 'PENDING', 'COMPLETED', or 'CANCELED'" }).optional().default('PENDING'),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const TaskNoteSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    task_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    note_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const TaskNoteRequestSchema = z.object({
    note_id: z.string().uuid().min(1, "Note ID is required"),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const TaskAssistantSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    task_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    taskOwner_id: z.string().uuid().min(1, { message: "Task owner ID is required and cannot be empty" }),
    assistant_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    payment_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const TaskAssistantRequestSchema = z.object({
    taskOwner_id: z.string().uuid().min(1, { message: "Task owner ID is required and cannot be empty" }),
    assistant_id: z.string().uuid().min(1, "Assistant ID is required"),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const TaskPayment = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    task_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    taskOwner_id: z.string().uuid().min(1, { message: "Task owner ID is required and cannot be empty" }),
    payment_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const RequestTaskSchema = z.object({
    task: TaskSchema,
    note: z.array(TaskNoteSchema),
    assistant: z.array(TaskAssistantSchema),
    payment: PaymentSchema.nullable().optional(),
    assistantPayment: z.array(AssistantPaymentSchema.nullable().optional())
})

export const CreateTaskRequestSchema = z.object({
    task: TaskRequestSchema,
    note: z.array(TaskNoteRequestSchema).optional().default([]),
    assistant: z.array(TaskAssistantRequestSchema).optional().default([]),
    payment: PaymentSchema.omit({ id: true }).nullable().optional(),
    assistantPayment: z.array(AssistantPaymentSchema.omit({ id: true })).optional().default([])
})

export type TTask = z.infer<typeof TaskSchema>;
export type TTaskRequest = z.infer<typeof TaskRequestSchema>;
export type TTaskNote = z.infer<typeof TaskNoteSchema>;
export type TTaskNoteRequest = z.infer<typeof TaskNoteRequestSchema>;
export type TTaskAssistant = z.infer<typeof TaskAssistantSchema>;
export type TTaskAssistantRequest = z.infer<typeof TaskAssistantRequestSchema>;
export type TTaskPayment = z.infer<typeof TaskPayment>
export type TRequestTaskSchema = z.infer<typeof RequestTaskSchema>
export type TCreateTaskRequestSchema = z.infer<typeof CreateTaskRequestSchema>

export type ListTask = {
    search?: string | null
    page: number
    size: number
    startDate?: number | null
    endDate?: number | null
    status?: string | null
    paymentStatus?: string | null
}

export const validateSearch = z.object({
    view: z.enum(['list', 'calendar']).optional().default('list'),
})