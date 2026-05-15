import { adminProcedure, protectedProcedure, router } from "../trpc";
import {
  createBookingProps,
  getAnalytics,
  getBookingInDayProps,
  UpdateBookingProps,
} from "shared";
import { TRPCError } from "@trpc/server";

export const analyticsRouter = router({
  getAnalytics: adminProcedure
    .input(getAnalytics)
    .query(async ({ ctx, input }) => {
      const startOfYear = new Date(input.startDate);
      const endOfYear = new Date(input.endDate);

      const bookings = await ctx.prisma.booking.findMany({
        where: {
          startTime: { gte: startOfYear, lt: endOfYear },
          ...(input.workerId && { shift: { workerId: input.workerId } }),
        },
        include: {
          service: { select: { name: true, price: true } },
          client: { select: { name: true } },
        },
        orderBy: { startTime: "asc" },
      });

      const monthlyStats: Record<
        number,
        {
          month: number;
          totalBookings: number;
          totalRevenue: number;
          bookings: typeof bookings;
        }
      > = {};

      for (let i = 0; i < 12; i++) {
        monthlyStats[i] = {
          month: i,
          totalBookings: 0,
          totalRevenue: 0,
          bookings: [],
        };
      }

      for (const booking of bookings) {
        const month = booking.startTime.getMonth();
        monthlyStats[month].totalBookings++;
        monthlyStats[month].totalRevenue += Number(booking.service.price);
        monthlyStats[month].bookings.push(booking);
      }

      const total = bookings.reduce((sum, b) => sum + Number(b.service.price), 0);
       return {
        months: Object.values(monthlyStats),
        summary: {
          totalBookings: bookings.length,
          totalRevenue: total,
          averagePerMonth: total / 12,
        },
      };
    }),
});