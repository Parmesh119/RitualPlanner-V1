const { z } = require('zod')

const updatePasswordSchema = z.object({
    password: z
        .string({ required_error: "Password is required." })
        .min(8, "Password must not be lesser than 3 characters")
        .max(16, "Password must not be greater than 16 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one digit")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

        confirmPassword: z
        .string({ required_error: "Password is required." })
        .min(8, "Password must not be lesser than 3 characters")
        .max(16, "Password must not be greater than 16 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one digit")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

        email: z.string({ required_error: "Email Address is required." })
        .email("Invalid email. Email must be a valid email address")
})

module.exports = updatePasswordSchema