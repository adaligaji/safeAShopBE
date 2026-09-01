import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { ordersRouter } from './routes/orders.routes.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'UP' }));
app.use('/api', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => console.log(`SecureShop API running on http://localhost:${port}`));
