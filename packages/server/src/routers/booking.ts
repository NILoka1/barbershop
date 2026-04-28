import { protectedProcedure, router } from "../trpc";
import { createBookingProps, getBookingInDayProps, UpdateBookingProps } from "shared";

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
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          shift: {
            select: {
              id: true,
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

  getServices: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.service.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }),
  getClients: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.client.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }),
  createBooking: protectedProcedure
    .input(createBookingProps)
    .mutation(async ({ ctx, input }) => {
      const { serviceId, shiftId, clientId, startTime, endTime, status } =
        input;
      return ctx.prisma.booking.create({
        data: {
          serviceId: serviceId,
          shiftId: shiftId,
          clientId: clientId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: status,
        },
      });
    }),
  updateBooking: protectedProcedure
    .input(UpdateBookingProps)
    .mutation(async ({ ctx, input }) => {
      const { id, service, shift, client, startTime, endTime, status } =
        input;
      return ctx.prisma.booking.update({
        where: {
          id: id,
        },
        data: {
          serviceId: service.id,
          shiftId: shift.id,
          clientId: client.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: status,
        },
      });
    }),
});
