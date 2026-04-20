import { protectedProcedure, router } from "../trpc";

export const workersRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.worker.findMany({
      orderBy: { name: "asc" },
    });
  }),
});
