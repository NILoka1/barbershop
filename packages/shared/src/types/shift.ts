import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from 'server';

type RouterOutput = inferRouterOutputs<AppRouter>;

export type ShiftFromDB = RouterOutput['shifts']['getInDateRange'][number];
export type ShiftsArray = RouterOutput['shifts']['getInDateRange'];