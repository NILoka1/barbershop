import { createBookingSchema, getDataSchema, spareWindowSchema } from "shared";
import { publicProcedure, router } from "../trpc";
import dayjs from "dayjs";
import { TRPCError } from "@trpc/server";
import { create } from "node:domain";

export const forClientsRouter = router({
  getData: publicProcedure
    .input(getDataSchema)
    .query(async ({ ctx, input }) => {
      const workers = await ctx.prisma.worker.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          shifts: {
            some: {
              startTime: {
                gte: dayjs(input.date).startOf("day").toDate(),
                lte: dayjs(input.date).endOf("day").toDate(),
              },
            },
          },
        },
      });
      const services = await ctx.prisma.service.findMany({
        select: {
          id: true,
          name: true,
          price: true,
        },
      });
      return { workers, services };
    }),
  getSpareWindows: publicProcedure
    .input(spareWindowSchema)
    .query(async ({ ctx, input }) => {
      const { workerId, serviceId, date } = input;
      const dayStart = dayjs(date).startOf("day").toDate();
      const dayEnd = dayjs(date).endOf("day").toDate();

      const service = await ctx.prisma.service.findUnique({
        where: { id: serviceId },
        select: { duration: true, name: true },
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Услуга не найдена",
        });
      }

      const serviceDuration = service.duration;
      const shifts = await ctx.prisma.shift.findMany({
        where: {
          workerId: workerId,
          startTime: { gte: dayStart, lte: dayEnd },
        },
        include: {
          bookings: {
            where: { status: { notIn: ["CANCELLED"] } },
            orderBy: { startTime: "asc" },
          },
        },
        orderBy: { startTime: "asc" },
      });

      if (shifts.length === 0) {
        return [];
      }

      const slots: { startTime: Date; endTime: Date; shiftId: string }[] = [];
      const SLOT_STEP = 15;

      for (const shift of shifts) {
        let currentStart = new Date(shift.startTime);
        const shiftEnd = new Date(shift.endTime);

        for (const booking of shift.bookings) {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(booking.endTime);

          while (
            currentStart.getTime() + serviceDuration * 60000 <=
            bookingStart.getTime()
          ) {
            const slotEnd = new Date(
              currentStart.getTime() + serviceDuration * 60000,
            );

            if (slotEnd <= shiftEnd) {
              slots.push({
                startTime: new Date(currentStart),
                endTime: slotEnd,
                shiftId: shift.id,
              });
            }

            currentStart = new Date(currentStart.getTime() + SLOT_STEP * 60000);
          }

          if (bookingEnd > currentStart) {
            currentStart = new Date(bookingEnd);
          }
        }

        while (
          currentStart.getTime() + serviceDuration * 60000 <=
          shiftEnd.getTime()
        ) {
          const slotEnd = new Date(
            currentStart.getTime() + serviceDuration * 60000,
          );

          slots.push({
            startTime: new Date(currentStart),
            endTime: slotEnd,
            shiftId: shift.id,
          });

          currentStart = new Date(currentStart.getTime() + SLOT_STEP * 60000);
        }
      }

      return slots;
    }),
  createBooking: publicProcedure
    .input(createBookingSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, phone, workerId, serviceId, startTime, endTime } = input;

      const fieldErrors: Record<string, string> = {};

      const service = await ctx.prisma.service.findUnique({
        where: { id: serviceId },
        select: { id: true },
      });
      const shift = await ctx.prisma.shift.findFirst({
        where: {
          workerId: workerId,
          startTime: { lte: new Date(startTime) },
          endTime: { gte: new Date(startTime) },
        },
      });

      if (!service) {
        fieldErrors.serviceId = "Услуга не найдена";
      }
      if (!shift) {
        fieldErrors.shiftId = "Смена не найдена";
      }

      if (Object.keys(fieldErrors).length > 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: JSON.stringify(fieldErrors),
        });
      }

      const existingShift = shift!;
      const existingService = service!;

      let client = await ctx.prisma.client.findFirst({
        where: { phone: phone },
      });

      if (!client) {
        client = await ctx.prisma.client.create({
          data: {
            name: name,
            phone: phone,
          },
        });
      }

      await ctx.prisma.booking.create({
        data: {
          clientId: client.id,
          shiftId: existingShift.id,
          serviceId: existingService.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: "PENDING",
        },
      });
      return { success: true };
    }),
});
