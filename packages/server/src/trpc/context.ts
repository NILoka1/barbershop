import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { prisma } from '../db/prisma';
import { verifyToken } from '../utils/jwt';

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  let worker = null;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      worker = await prisma.worker.findUnique({
        where: { id: payload.workerId },
        select: { id: true, email: true, name: true, isAdmin: true },
      });
    }
  }

  return { req, res, prisma, worker };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
