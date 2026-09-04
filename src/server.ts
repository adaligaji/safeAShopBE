import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './config/database.js';
import { authRouter } from './routes/auth.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { ordersRouter } from './routes/orders.routes.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'UP', database: 'UP' });
  } catch (error) {
    console.error(error);
    res.status(503).json({ status: 'DOWN', database: 'DOWN' });
  }
});

app.use('/api', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/**
 * Error genérico.
 */
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`SecureShop vulnerable API running on http://localhost:${port}`);
});
