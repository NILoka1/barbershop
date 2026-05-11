import { router, protectedProcedure } from "../trpc";


export const ClientsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.client.findMany({
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
        }
    })
  }),
});

