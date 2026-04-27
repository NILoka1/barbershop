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
        select:{
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          service:{
            select: {
              name: true,
            },
          },
          client: {
            select: {
              name: true,
            },
          },
          shift: {
            select: {
              worker: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startTime: "asc" },
      });
    }),
});
