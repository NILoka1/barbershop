import {z} from "zod";

export const spareWindowSchema = z.object({
  workerId: z.string(),
  serviceId: z.string(),
  date: z.string().date(""),
});