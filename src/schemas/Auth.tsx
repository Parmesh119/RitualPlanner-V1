import { z } from "zod"
import { indianStatesAndUTs } from "@/util/state"
export const loginFormSchema = z.object({
    username: z
        .string()
        .min(1, "Username is required"),
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
            .min(10, "Phone number must be exactly 10 digits")
            .max(10, "Phone number must be exactly 10 digits")
            .regex(/^[6-9]\d{9}$/, "Phone number must be a valid Indian number"),
        signin: z.string(),
        city: z.string().min(1, "Minimum one city is required"),
        state: z.string().min(1, "state is required")
            .refine((val) => indianStatesAndUTs.includes(val), {
                message: "Please enter a valid Indian state",
            }),
        zipcode: z.string()
            .min(6, "Zipcode must be exactly 6 digits")
            .max(6, "Zipcode must be exactly 6 digits")
            .regex(/^\d{6}$/, "Zipcode must contain only numbers"),
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

export type TLogin = z.infer<typeof loginFormSchema>
export type TRegister = z.infer<typeof registerFormSchema>
export type TForgotPassword = z.infer<typeof forgotPasswordSchema>

export type TAuthResponse = {
    accessToken: string
    refreshToken: string
}

export type TRegisterResponse = {
    username: string
    password: string
}

export type TUserJwtInformation = {
    sub: string
    userId: string
    iat: number
    exp: number
}

export type TRefreshTokenRequest = {
    refreshToken: string
}