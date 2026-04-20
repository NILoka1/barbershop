import { addServiceSchema } from "shared";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { z } from "zod";

export const servicesRouter = router({
  // Получить все услуги
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.service.findMany({
      orderBy: { name: "asc" },
    });
  }),

  // Получить услугу по ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.service.findUnique({
        where: { id: input.id },
      });
    }),

  // Создать услугу (только админ)
  create: adminProcedure
    .input(addServiceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.service.create({
        data: input,
      });
    }),

  // Обновить услугу (только админ)
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        category: z.enum(["SALON", "MANICURE", "COSMETICS"]).optional(),
        duration: z.number().min(5).optional(),
        price: z.number().min(0).optional(),
        description: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.service.update({
        where: { id },
        data,
      });
    }),

  // Удалить услугу (только админ)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.service.delete({
        where: { id: input.id },
      });
    }),
});
