const z = require("zod");

const UserSchema = z.object({
    firstName: z.string().min(1, "Name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(5, "Username must be at least 5 characters"),
    email: z.email("Not a valid email format"),
    password: z.string().min(10, "Password must be at least 10 characters"),
});

module.exports = { UserSchema };
