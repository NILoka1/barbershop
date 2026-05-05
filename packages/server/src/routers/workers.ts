import { TRPCError } from "@trpc/server";
import { adminProcedure, protectedProcedure, router } from "../trpc";
import { workersRegistrate, workersUpdate } from "shared";
import bcrypt from "bcryptjs";
import z from "zod";
export const workersRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.worker.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
      },
      orderBy: { name: "asc" },
    });
  }),
  register: adminProcedure
    .input(workersRegistrate)
    .mutation(async ({ ctx, input }) => {
      const emailExisting = await ctx.prisma.worker.findUnique({
        where: { email: input.email },
      });

      const phoneExisting = input.phone
        ? await ctx.prisma.worker.findFirst({
            where: { phone: input.phone },
          })
        : null;

      const fieldErrors: Record<string, string> = {};

      if (emailExisting) {
        fieldErrors.email = "Пользователь с таким email уже существует";
      }

      if (phoneExisting) {
        fieldErrors.phone = "Пользователь с таким телефоном уже существует";
      }

      if (Object.keys(fieldErrors).length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: JSON.stringify(fieldErrors), 
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const worker = await ctx.prisma.worker.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          phone: input.phone,
          isAdmin: false,
        },
        select: { id: true, email: true, name: true, isAdmin: true },
      });
      return { worker };
    }),
  update: adminProcedure
    .input(workersUpdate)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.worker.update({
        where: { id },
        data,
      });
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.worker.delete({
        where: { id: input.id },
      });
    }),
});
