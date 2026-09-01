import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { db } from '../services/jsonDb.js';
import type { Product } from '../types/index.js';

export const productsRouter = Router();

productsRouter.get('/', authenticate, async (_req, res) => res.json(await db.products.all()));

productsRouter.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const { name, price } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim() || typeof price !== 'number' || price < 0) {
    res.status(400).json({ message: 'Valid name and price are required' }); return;
  }
  const products = await db.products.all();
  const product: Product = { id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1, name: name.trim(), price };
  products.push(product);
  await db.products.save(products);
  res.status(201).json(product);
});

productsRouter.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const products = await db.products.all();
  const index = products.findIndex(p => p.id === id);
  if (!Number.isInteger(id)) { res.status(400).json({ message: 'Invalid product id' }); return; }
  if (index === -1) { res.status(404).json({ message: 'Product not found' }); return; }

  if (req.body?.name !== undefined) {
    if (typeof req.body.name !== 'string' || !req.body.name.trim()) { res.status(400).json({ message: 'Invalid name' }); return; }
    products[index].name = req.body.name.trim();
  }
  if (req.body?.price !== undefined) {
    if (typeof req.body.price !== 'number' || req.body.price < 0) { res.status(400).json({ message: 'Invalid price' }); return; }
    products[index].price = req.body.price;
  }
  await db.products.save(products);
  res.json(products[index]);
});
