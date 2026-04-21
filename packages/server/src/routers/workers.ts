import { TRPCError } from "@trpc/server";
import { adminProcedure, protectedProcedure, router } from "../trpc";
import { workersRegistrate, workersUpdate } from "shared";
import bcrypt from "bcryptjs";
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
      const existing = await ctx.prisma.worker.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Пользователь с таким email уже существует",
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
});
