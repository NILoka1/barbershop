import { router } from '../trpc';
import { analyticsRouter } from './analytics';
import { authRouter } from './auth';
import { bookingRouter } from './booking';
import { ClientsRouter } from './clients';
import { forClientsRouter } from './forClients';
import { servicesRouter } from './services';
import { shiftsRouter } from './shifts';
import { workersRouter } from './workers';

export const appRouter = router({
  auth: authRouter,
  services: servicesRouter,
  workers: workersRouter,
  shifts: shiftsRouter,
  booking: bookingRouter,
  clients: ClientsRouter,
  analytics: analyticsRouter,
  forClients: forClientsRouter,
});

export type AppRouter = typeof appRouter;
