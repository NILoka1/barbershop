import z from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  createBookingProps,
  getBookingInDayProps,
  UpdateBookingProps,
} from "shared";
import { TRPCError } from "@trpc/server";
import { prisma } from "../db/prisma";

const checkExisting = async (
  shiftId: string,
  startTime: string,
  endTime: string,
) => {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  return await prisma.shift.findFirst({
    where: {
      id: shiftId,
      startTime: { lte: startDate },
      endTime: { gte: endDate },
    },
  });
};

const checkOverlapBooking = async (
  startTime: string,
  endTime: string,
  shiftId: string,
  excludeBookingId?: string,
) => {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  return prisma.booking.findFirst({
    where: {
      shiftId: shiftId,
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
      OR: [
        {
          startTime: { lte: startDate },
          endTime: { gt: startDate },
        },
        {
          startTime: { lt: endDate },
          endTime: { gte: endDate },
        },
        {
          startTime: { gte: startDate },
          endTime: { lte: endDate },
        },
        {
          startTime: { lte: startDate },
          endTime: { gte: endDate },
        },
      ],
    },
  });
};

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

      const fieldErrors: Record<string, string> = {};

      if (new Date(startTime) > new Date(endTime)) {
        fieldErrors.endDate =
          "Время окончания должно быть после времени начала";
      }
      if (await checkOverlapBooking(startTime, endTime, shiftId)) {
        fieldErrors.startTime = "Время пересекается с существующей";
      }
      if ((await checkExisting(shiftId, startTime, endTime)) == null) {
        fieldErrors.startTime = "Время время записи вне смены";
      }

      if (Object.keys(fieldErrors).length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: JSON.stringify(fieldErrors),
        });
      }

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
      const { id, service, shift, client, startTime, endTime, status } = input;
      const fieldErrors: Record<string, string> = {};

      if (new Date(startTime) > new Date(endTime)) {
        fieldErrors.endDate =
          "Время окончания должно быть после времени начала";
      }
      if (await checkOverlapBooking(startTime, endTime, shift.id, id)) {
        fieldErrors.startTime = "Время пересекается с существующей";
      }

      if (Object.keys(fieldErrors).length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: JSON.stringify(fieldErrors),
        });
      }

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
  deleteBooking: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.booking.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
