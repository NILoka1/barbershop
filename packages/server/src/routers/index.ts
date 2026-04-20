import { router } from '../trpc';
import { authRouter } from './auth';
import { servicesRouter } from './services';
import { workersRouter } from './workers';

export const appRouter = router({
  auth: authRouter,
  services: servicesRouter,
  workers: workersRouter,
});

export type AppRouter = typeof appRouter;
