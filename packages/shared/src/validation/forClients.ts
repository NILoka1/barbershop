import { date, z } from "zod";

export const getDataSchema = z.object({
  date: z.string(),
});

export const spareWindowSchema = z.object({
  workerId: z.string(),
  serviceId: z.string(),
  date: z.string().date(""),
});

export const formCreateBookingSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  phone: z.string().min(1, "Телефон обязателен"),
  workerId: z.string(),
  serviceId: z.string(),
  date: z.string(),
});

export const createBookingSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  phone: z.string().min(1, "Телефон обязателен"),
  workerId: z.string(),
  serviceId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
