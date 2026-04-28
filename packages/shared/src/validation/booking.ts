import { z } from "zod";
import { BookingStatus } from "../types/booking";

export const getBookingInDayProps = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

export type GetBookingInDayProps = z.infer<typeof getBookingInDayProps>;

export const createBookingForm = z.object({
  id: z.string(),
  serviceId: z.string().min(1, "Выберите услугу"),
  shiftId: z.string().min(1, "Выберите смену"),
  clientId: z.string().min(1, "Выберите клиента"),
  startDate: z.string().date(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.string(),
});

export type createBookingFormOutput = z.infer<typeof createBookingForm>;

export const createBookingProps = z.object({
  id: z.string(),
  serviceId: z.string(),
  shiftId: z.string(),
  clientId: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: z.nativeEnum(BookingStatus),
});

export type createBookingProps = z.infer<typeof createBookingProps>;