import { z } from 'zod'

export const HelpSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required")
})

export type THelp = z.infer<typeof HelpSchema>