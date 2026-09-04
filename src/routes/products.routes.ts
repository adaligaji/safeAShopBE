import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { pool } from '../config/database.js';

export const productsRouter = Router();

/**
 * CORRECCIÓN: Consulta Parametrizable
 */
productsRouter.get('/', authenticate, async (req, res, next) => {
  try {
    const name = req.query.name;

    if (typeof name === 'string' && name.length > 0) {
      const result = await pool.query(
        `SELECT id, name, price::float AS price
         FROM products
         WHERE name = $1
         ORDER BY id`,
        [name]
      );

      res.json(result.rows);
      return;
    }

    const result = await pool.query(
      `SELECT id, name, price::float AS price
       FROM products
       ORDER BY id`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * CORRECCIÓN: Agregar Autorización por rol
 */
productsRouter.post('/', 
  authenticate, 
  authorize('ADMIN'),
  async (req, res, next) => {
  try {
    const { name, price } = req.body ?? {};

    if (typeof name !== 'string' || !name.trim() || typeof price !== 'number' || price < 0) {
      res.status(400).json({ message: 'Valid name and price are required' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO products (name, price)
       VALUES ($1, $2)
       RETURNING id, name, price::float AS price`,
      [name.trim(), price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * CORRECCIÓN: Agregar Autorización por rol
 */
productsRouter.put('/:id', 
  authenticate, 
  authorize('ADMIN'),
  async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, price } = req.body ?? {};

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: 'Invalid product id' });
      return;
    }

    if (typeof name !== 'string' || !name.trim() || typeof price !== 'number' || price < 0) {
      res.status(400).json({ message: 'Valid name and price are required' });
      return;
    }

    const result = await pool.query(
      `UPDATE products
       SET name = $1, price = $2
       WHERE id = $3
       RETURNING id, name, price::float AS price`,
      [name.trim(), price, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
