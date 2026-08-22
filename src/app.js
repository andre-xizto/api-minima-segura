import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { config } from './config.js';
import itemsRouter from './routes/items.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: config.isTest ? 10000 : 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api', limiter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/items', itemsRouter);

app.use((_req, res) => res.status(404).json({ error: 'rota não encontrada' }));
app.use(errorHandler);

export default app;
