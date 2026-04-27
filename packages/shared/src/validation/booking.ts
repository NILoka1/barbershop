import {z} from 'zod';

export const getBookingInDayProps = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

export type GetBookingInDayProps = z.infer<typeof getBookingInDayProps>;