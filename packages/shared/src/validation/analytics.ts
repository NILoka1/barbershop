import { worker } from "node:cluster";
import { z } from "zod";

export const getAnalytics = z.object({
  startDate: z.string(),
  endDate: z.string(),
  workerId: z.string().optional(),
});

export type GetAnalyticsProps = z.infer<typeof getAnalytics>;