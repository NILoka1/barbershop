import { TRPCError } from "@trpc/server";
import { adminProcedure, protectedProcedure, router } from "../trpc";
import { workersRegistrate, workersUpdate } from "shared";
import bcrypt from "bcryptjs";
import z from "zod";
import { prisma } from "../db/prisma";

const checkExisting = async (
  email: string,
  phone?: string | null,
  execludeID?: string,
) => {
  const emailExisting = await prisma.worker.findFirst({
    where: { email: email, ...(execludeID && { id: { not: execludeID } }) },
  });

  const phoneExisting = phone
    ? await prisma.worker.findFirst({
        where: { phone: phone, ...(execludeID && { id: { not: execludeID } }) },
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
};

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
      await checkExisting(input.email, input.phone);

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
      await checkExisting(data.email, data.phone, id);
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
