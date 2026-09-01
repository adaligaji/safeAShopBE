import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { pool } from '../config/database.js';

export const productsRouter = Router();

/**
 * Vulnerable
 * SQL Injection
 */
productsRouter.get('/', authenticate, async (req, res, next) => {
  try {
    const name = req.query.name;

    let query = 'SELECT id, name, price::float AS price FROM products ORDER BY id';

    if (typeof name === 'string' && name.length > 0) {
      query = `SELECT id, name, price::float AS price FROM products WHERE name = '${name}' ORDER BY id`;
    }

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * Vulnerbale
 * Falta Autorización Admin
 */
productsRouter.post('/', authenticate, async (req, res, next) => {
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
 * VULNERABLE
 * Autorización por ROl falta.
 */
productsRouter.put('/:id', authenticate, async (req, res, next) => {
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
