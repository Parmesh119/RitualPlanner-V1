import { z } from "zod"

export const loginFormSchema = z.object({
    identifier: z
        .string()
        .min(1, "Username or email is required")
        .transform((value) => value.toLowerCase()),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long"),
})

export const registerFormSchema = z
    .object({
        name: z.string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must not exceed 50 characters"),
        email: z.string()
            .email("Please enter a valid email address"),
        phone: z.string()
            .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password is too long")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export const forgotPasswordSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address")
})

export type LoginFormData = z.infer<typeof loginFormSchema>
export type RegisterFormData = z.infer<typeof registerFormSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema> 