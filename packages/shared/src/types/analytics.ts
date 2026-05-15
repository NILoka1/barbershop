import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type AnalyticsBookingFromDB = RouterOutput["analytics"]["getAnalytics"]["months"][number];

