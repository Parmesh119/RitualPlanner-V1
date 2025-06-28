import { z } from 'zod'

export const PaymentSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    totalamount: z.number().int({ message: "Total amount must be an integer" }).positive({ message: "Total amount must be greater than zero" }),
    paidamount: z.number().int({ message: "Paid amount must be an integer" }).nonnegative({ message: "Paid amount cannot be negative" }).optional().default(0),
    paymentdate: z.number().int({ message: "Payment date must be an integer timestamp" }).positive({ message: "Payment date must be a positive timestamp" }).nullable().optional().default(() => Date.now()),
    paymentmode: z.enum(['CASH', 'ONLINE'], { message: "Payment mode must be one of: CASH, ONLINE, CARD, UPI" }).optional().default('CASH'),
    onlinepaymentmode: z.enum(['NET-BANKING', 'UPI', 'CHECK', 'CARD'], { message: "Payment mode must be one of: CARD, UPI, CHECK, NET-BANKING" }).nullable().optional().default(null),
    paymentstatus: z.enum(['PENDING', 'COMPLETED'], { message: "Payment status must be either 'PENDING' or 'COMPLETED'" }).optional().default('PENDING'),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export const AssistantPaymentSchema = z.object({
    id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    totalamount: z.number().int({ message: "Total amount must be an integer" }).positive({ message: "Total amount must be greater than zero" }),
    paidamount: z.number().int({ message: "Paid amount must be an integer" }).nonnegative({ message: "Paid amount cannot be negative" }).optional().default(0),
    paymentdate: z.number().int({ message: "Payment date must be an integer timestamp" }).positive({ message: "Payment date must be a positive timestamp" }).nullable().optional().default(() => Date.now()),
    paymentmode: z.enum(['CASH', 'ONLINE'], { message: "Payment mode must be one of: CASH, ONLINE, CARD, UPI" }).optional().default('CASH'),
    onlinepaymentmode: z.enum(['NET-BANKING', 'UPI', 'CHECK', 'CARD'], { message: "Payment mode must be one of: CARD, UPI, CHECK, NET-BANKING" }).nullable().optional().default(null),
    paymentstatus: z.enum(['PENDING', 'COMPLETED'], { message: "Payment status must be either 'PENDING' or 'COMPLETED'" }).optional().default('PENDING'),
    assistant_id: z.string().uuid().optional().default(() => crypto.randomUUID()),
    createdAt: z.number().int().positive().default(() => Date.now()),
    updatedAt: z.number().int().positive().default(() => Date.now())
})

export type TPayment = z.infer<typeof PaymentSchema>;
export type TAssistantPayment = z.infer<typeof AssistantPaymentSchema>