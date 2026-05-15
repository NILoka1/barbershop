import { z } from "zod";

export const getAnalytics = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

export type GetBookingInDayProps = z.infer<typeof getAnalytics>;