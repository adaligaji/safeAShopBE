import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { db } from '../services/jsonDb.js';
import type { Order } from '../types/index.js';

export const ordersRouter = Router();

ordersRouter.post('/', authenticate, async (req, res) => {
  const productId = Number(req.body?.productId);
  const quantity = Number(req.body?.quantity);
  if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0) {
    res.status(400).json({ message: 'Valid productId and quantity are required' }); return;
  }
  const products = await db.products.all();
  if (!products.some(p => p.id === productId)) { res.status(404).json({ message: 'Product not found' }); return; }

  const orders = await db.orders.all();
  const order: Order = {
    id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    userId: Number(req.user!.sub), productId, quantity, createdAt: new Date().toISOString()
  };
  orders.push(order);
  await db.orders.save(orders);
  res.status(201).json(order);
});

ordersRouter.get('/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) { res.status(400).json({ message: 'Invalid order id' }); return; }
  const orders = await db.orders.all();
  const order = orders.find(o => o.id === id);
  if (!order) { res.status(404).json({ message: 'Order not found' }); return; }

  const isAdmin = req.user!.role === 'ADMIN';
  const isOwner = order.userId === Number(req.user!.sub);
  if (!isAdmin && !isOwner) { res.status(403).json({ message: 'You are not allowed to access this order' }); return; }

  const products = await db.products.all();
  const product = products.find(p => p.id === order.productId);
  res.json({ ...order, product, total: product ? product.price * order.quantity : null });
});
