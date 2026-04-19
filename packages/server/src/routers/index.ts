import { router } from '../trpc';
import { authRouter } from './auth';
import { servicesRouter } from './services';

export const appRouter = router({
  auth: authRouter,
  services: servicesRouter,
});

export type AppRouter = typeof appRouter;
