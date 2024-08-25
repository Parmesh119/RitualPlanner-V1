const z = require("zod")
const phoneNumberRegex = /^\+(\d{1,4})[\s-]?(\d{7,15})$/;

const phoneNumberSchema = z.string().regex(phoneNumberRegex, {
  message: "Invalid phone number format. Expected format: +<country_code> <number>",
});

const signupSchema = z.object({
    username: z
        .string({ required_error: "Username is required." })
        .trim()
        .min(3, { message: "Username must be having 3 characters" })
        .max(20, { message: "Username must be having 8 characters" })
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "The username must contain only letters, numbers and underscore (_)",
        ),
    name: z
        .string({ required_error: "Name is required." }),

    email: z.string({ required_error: "Email Address is required." })
        .email("Invalid email. Email must be a valid email address"),

        number: z.string({required_error: "Phone number is required.", invalid_type_error: "Phone number must be only having digits."})
        .min(10, {message: "Phone number must be having minimum 10 digits."})
        .max(10, {message: "Phone number must be having maximum 10 digits."})
        .regex( /^\+?[1-9]\d{1,14}$/,
        "The Phone number only contains digits."
        ),

    password: z
        .string({ required_error: "Password is required." })
        .min(8, "Password must not be lesser than 3 characters")
        .max(16, "Password must not be greater than 16 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one digit")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

})

module.exports = signupSchema