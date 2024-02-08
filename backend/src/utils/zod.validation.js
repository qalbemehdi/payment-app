import { z } from "zod";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

export const userValidation = z.object({
    name: z.string().trim().min(3).max(20, { message: "Name must be between 3 and 20 characters" }),
    email: z.string().email({ message: "Please provide a valid email address" }),
    password: z.string()
        .refine((value) => passwordRegex.test(value), {
            message: "Password must be at least 8 characters long and contain at least one letter and one number",
        }),
});
