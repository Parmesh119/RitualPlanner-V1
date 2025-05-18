import { z } from "zod"

export const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must not exceed 1000 characters"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
