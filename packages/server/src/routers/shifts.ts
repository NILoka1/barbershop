import { protectedProcedure, router } from "../trpc";
import { addShift, shiftsInDate } from "shared";

export const shiftsRouter = router({
  getInDateRange: protectedProcedure
    .input(shiftsInDate)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = input;

      return ctx.prisma.shift.findMany({
        where: {
          startTime: { gte: new Date(startDate) },
          endTime: { lte: new Date(endDate) },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          worker: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              isAdmin: true, // 👈 без password!
            },
          },
        },
        orderBy: { startTime: "asc" },
      });
    }),
    createShift: protectedProcedure.input(addShift).mutation(async ({ ctx, input }) => {
      const { startDate, endDate, worker } = input;

      return ctx.prisma.shift.create({
        data: {
          startTime: new Date(startDate),
          endTime: new Date(endDate),
          workerId: worker,
        },
      });
    })
});
