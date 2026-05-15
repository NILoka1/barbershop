import { protectedProcedure, router } from "../trpc";
import { getAnalytics } from "shared";

export const analyticsRouter = router({
  getAnalytics: protectedProcedure
    .input(getAnalytics)
    .query(async ({ ctx, input }) => {
      const startOfYear = new Date(input.startDate);
      const endOfYear = new Date(input.endDate);
      const workerId = ctx.worker.isAdmin ? input.workerId : ctx.worker.id;

      const bookings = await ctx.prisma.booking.findMany({
        where: {
          startTime: { gte: startOfYear, lt: endOfYear },
          ...(workerId && { shift: { workerId: workerId } }),
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

      const total = bookings.reduce(
        (sum, b) => sum + Number(b.service.price),
        0,
      );
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
