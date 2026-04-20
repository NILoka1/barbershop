import { router, publicProcedure, protectedProcedure } from "../trpc";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { TRPCError } from "@trpc/server";
import { loginSchema, registerSchema } from "shared";

export const authRouter = router({
  // Регистрация работника (публичная)
  register: publicProcedure
    .input(registerSchema)
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

      const token = generateToken({
        workerId: worker.id,
        email: worker.email,
        isAdmin: worker.isAdmin,
      });

      return { worker, token };
    }),

  // Вход
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const worker = await ctx.prisma.worker.findUnique({
      where: { email: input.email },
    });

    if (!worker) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Неверный email или пароль",
      });
    }

    const valid = await bcrypt.compare(input.password, worker.password);
    if (!valid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Неверный email или пароль",
      });
    }

    const token = generateToken({
      workerId: worker.id,
      email: worker.email,
      isAdmin: worker.isAdmin,
    });

    return {
      worker: {
        id: worker.id,
        email: worker.email,
        name: worker.name,
        isAdmin: worker.isAdmin,
      },
      token,
    };
  }),

  // Получить текущего пользователя
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.worker;
  }),
});
