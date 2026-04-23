import { initTRPC, TRPCError } from '@trpc/server';
import { type Context } from './context';
import superjson from 'superjson';  

const t = initTRPC.context<Context>().create({
  transformer: superjson,  // 👈 ВЕРНУТЬ ОБРАТНО
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware для проверки авторизации
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.worker) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      worker: ctx.worker,
    },
  });
});

// Middleware для проверки админа
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.worker || !ctx.worker.isAdmin) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({
    ctx: {
      worker: ctx.worker,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
