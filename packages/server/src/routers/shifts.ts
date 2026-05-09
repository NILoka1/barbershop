import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import { addShift, deleteShift, shiftsInDate, shiftsUpdate } from "shared";
import dayjs from "dayjs";
import { prisma } from "../db/prisma";

const checkOverlap = async (
  startDate: string,
  endDate: string,
  workerId: string,
  excludeId?: string, 
) => {
  const dayStart = dayjs(startDate).startOf("day").toDate();
  const dayEnd = dayjs(startDate).endOf("day").toDate();

  return prisma.shift.findFirst({
    where: {
      workerId: workerId,
      ...(excludeId && { id: { not: excludeId } }),
      AND: [
        { startTime: { gte: dayStart, lte: dayEnd } },
        {
          OR: [
            {
              startTime: { lte: new Date(startDate) },
              endTime: { gt: new Date(startDate) },
            },
            {
              startTime: { lt: new Date(endDate) },
              endTime: { gte: new Date(endDate) },
            },
            {
              startTime: { gte: new Date(startDate) },
              endTime: { lte: new Date(endDate) },
            },
            {
              startTime: { lte: new Date(startDate) },
              endTime: { gte: new Date(endDate) },
            },
          ],
        },
      ],
    },
  });
};

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
              isAdmin: true,
            },
          },
        },
        orderBy: { startTime: "asc" },
      });
    }),
  createShift: protectedProcedure
    .input(addShift)
    .mutation(async ({ ctx, input }) => {
      const { startDate, endDate, worker } = input;

      const fieldErrors: Record<string, string> = {};

      if (new Date(startDate) > new Date(endDate)) {
        fieldErrors.endDate =
          "Время окончания должно быть после времени начала";
      }
      if (await checkOverlap(startDate, endDate, worker)) {
        fieldErrors.startTime = "Смена пересекается с существующей";
      }

      if (Object.keys(fieldErrors).length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: JSON.stringify(fieldErrors),
        });
      }

      return ctx.prisma.shift.create({
        data: {
          startTime: new Date(startDate),
          endTime: new Date(endDate),
          workerId: worker,
        },
      });
    }),
  deleteShift: protectedProcedure
    .input(deleteShift)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.shift.delete({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(shiftsUpdate)
    .mutation(async ({ ctx, input }) => {
      const { id, startDate, endDate } = input;

      const fieldErrors: Record<string, string> = {};

      if (new Date(startDate) > new Date(endDate)) {
        fieldErrors.endDate =
          "Время окончания должно быть после времени начала";
      }

      const currentShift = await ctx.prisma.shift.findUnique({
        where: { id },
      });

      if (!currentShift) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Смена не найдена",
        });
      }

      const overlapping = await checkOverlap(
        startDate,
        endDate,
        currentShift.workerId,
        id,
      );

      if (overlapping) {
        fieldErrors.startTime = "Смена пересекается с существующей";
      }

      if (Object.keys(fieldErrors).length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: JSON.stringify(fieldErrors),
        });
      }

      return ctx.prisma.shift.update({
        where: { id: id },
        data: {
          startTime: new Date(startDate),
          endTime: new Date(endDate),
        },
      });
    }),
});
