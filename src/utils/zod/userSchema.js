import z from "zod";

export const LoginSchema = z.object({
    email: z.email("Not a valid email format"),
    password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z
    .object({
        firstName: z.string().min(1, "Name is required"),
        lastName: z.string().min(1, "Last name is required"),
        username: z.string().min(5, "Username must be at least 5 characters"),
        email: z.email("Not a valid email format"),
        password: z.string().min(10, "Password must be at least 10 characters"),
        repeatPassword: z.string().min(10, "Password must be at least 10 characters"),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords must match",
        path: ["repeatPassword"],
    });
