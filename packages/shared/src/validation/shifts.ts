import { worker } from "node:cluster";
import { start } from "node:repl";
import z from "zod";

export const shiftsInDate = z.object({
  startDate: z.string().datetime("Некорректная дата"),
  endDate: z.string().datetime("Некорректная дата"),
});

export const addShift = z.object({
  startDate: z.string().datetime("Некорректная дата"),
  endDate: z.string().datetime("Некорректная дата"),
  worker: z.string(),
});
export const deleteShift = z.object({
  id: z.string(),
});

export const shiftsUpdate = z.object({
  id: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const shiftFormSchema = z
  .object({
    worker: z.string().min(1, "Выберите работника"),
    startDate: z.string().min(1, "Выберите дату"),
    startTime: z.string().min(1, "Выберите время"),
    endTime: z.string().min(1, "Выберите время"),
  })
  .refine(
    (data) => {
      const start = `${data.startDate}T${data.startTime}:00`;
      const end = `${data.startDate}T${data.endTime}:00`;
      return new Date(start) < new Date(end);
    },
    {
      message: "Время окончания должно быть позже времени начала",
      path: ["endTime"],
    },
  );

export type ShiftFormInput = z.infer<typeof shiftFormSchema>;
