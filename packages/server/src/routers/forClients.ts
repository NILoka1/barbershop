import { publicProcedure, router } from "../trpc";

export const forClientsRouter = router({
  getData: publicProcedure.query(async ({ ctx }) => {
    const workers = await ctx.prisma.worker.findMany({
      select: {
        id: true,
        name: true,
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
});
