import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string(),
});

export const registerSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль минимум 6 символов"),
  name: z.string().min(1, "Имя обязательно"),
  phone: z.string().optional(),
});

export type addWorkerSchema = z.infer<typeof registerSchema>;