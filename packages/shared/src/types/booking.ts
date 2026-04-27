import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type BookingFromDB = RouterOutput["booking"]["getByDay"][number];


// shared/types/booking.ts
export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NOSHOW = "NOSHOW",
}

export const BookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "Ожидает",
  [BookingStatus.CONFIRMED]: "Подтверждена",
  [BookingStatus.CANCELLED]: "Отменена",
  [BookingStatus.COMPLETED]: "Выполнена",
  [BookingStatus.NOSHOW]: "Не пришёл",
};