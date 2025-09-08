const z = require("zod");

const LeagueSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters").max(30, "Name is too long"),
    participationFee: z
        .union([
            z
                .string()
                .regex(/^\d*\.?\d+$/, "Enter a valid fee")
                .transform(Number),
            z.number(),
        ])
        .refine((val) => val >= 0, { message: "Fee cannot be negative" }),

    coinsPerUser: z
        .union([z.string().regex(/^\d+$/, "Enter a valid number").transform(Number), z.number()])
        .refine((val) => Number.isInteger(val), { message: "Must be a whole number" })
        .refine((val) => val >= 100, { message: "Minimum of 100 coins" })
        .refine((val) => val <= 100000, { message: "Too many coins" }),
    isPublic: z.boolean().default(true),
    tournament: z.string().min(1, "Please select a category"),
    teamname: z.string().min(1, "Enter a name"),
});

module.exports = { LeagueSchema };
