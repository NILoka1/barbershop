import { protectedProcedure, router } from "../trpc";
import { getBookingInDayProps } from "shared";

export const bookingRouter = router({
  getByDay: protectedProcedure
    .input(getBookingInDayProps)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = input;

      return ctx.prisma.booking.findMany({
        where: {
          startTime: { gte: new Date(startDate) },
          endTime: { lte: new Date(endDate) },
        },
        orderBy: { startTime: "asc" },
      });
    }),
});
