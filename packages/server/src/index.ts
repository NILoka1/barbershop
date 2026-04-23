import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers/index';
import { createContext } from './trpc/context';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
if (process.env.CLIENT_BUILD_URL) { 
  allowedOrigins.push(process.env.CLIENT_BUILD_URL);
}

app.use(cors({
  origin: allowedOrigins,
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