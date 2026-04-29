import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ShiftsFromDB = RouterOutput["shifts"]["getInDateRange"][number];

export function filterServices(
  shiifts: ShiftsFromDB[] | undefined,
  query: string,
): ShiftsFromDB[] {
  if (!shiifts) return [];
  if (!query.trim()) return shiifts;

  const normalizedQuery = query.toLowerCase().trim();

  return shiifts.filter((shift) => {
    return (
      shift.worker.name.toLowerCase().includes(normalizedQuery) ||
      shift.startTime.toISOString().includes(normalizedQuery) ||
      shift.endTime.toISOString().includes(normalizedQuery)
    );
  });
}
