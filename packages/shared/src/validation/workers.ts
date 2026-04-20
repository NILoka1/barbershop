import z from "zod";

export const workersRegistrate = z.object({
    name: z.string().min(1,"ФИО обязательно"),
    email: z.string().email("Некоректная почта"),
    password: z.string().min(6,'Минимум 6 символов'),
    phone: z.string().optional()
})

export type workersRegistrateInput = z.infer<typeof workersRegistrate>;