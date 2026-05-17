import { date, z } from "zod";

export const getDataSchema = z.object({
  date: z.string(),
});

export const spareWindowSchema = z.object({
  workerId: z.string(),
  serviceId: z.string(),
  date: z.string().date(""),
});
