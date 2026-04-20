import z from "zod";


export const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string()
})