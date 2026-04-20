import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers/index';
import { createContext } from './trpc/context';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});

export {appRouter}
export type {AppRouter} from './routers/index'