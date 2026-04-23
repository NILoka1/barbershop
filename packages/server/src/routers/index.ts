import { router } from '../trpc';
import { authRouter } from './auth';
import { servicesRouter } from './services';
import { shiftsRouter } from './shifts';
import { workersRouter } from './workers';

export const appRouter = router({
  auth: authRouter,
  services: servicesRouter,
  workers: workersRouter,
  shifts: shiftsRouter,
});

export type AppRouter = typeof appRouter;
