import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { pool } from '../config/database.js';

export const ordersRouter = Router();

ordersRouter.post('/', authenticate, async (req, res, next) => {
  try {
    const productId = Number(req.body?.productId);
    const quantity = Number(req.body?.quantity);

    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0) {
      res.status(400).json({ message: 'Valid productId and quantity are required' });
      return;
    }

    const productResult = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [productId]
    );

    if (productResult.rowCount === 0) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO orders (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING
         id,
         user_id AS "userId",
         product_id AS "productId",
         quantity,
         created_at AS "createdAt"`,
      [Number(req.user!.sub), productId, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * Correccióm - BOLA/IDOR
 * Order revisa ID y autorización 
 */
ordersRouter.get('/:id', authenticate, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userID = Number(req.user!.sub);
    const isAdmin = req.user!.role === 'ADMIN';
    let result;

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: 'Invalid order id' });
      return;
    }

    if (isAdmin) {
      result = await pool.query(
        `SELECT
         o.id,
         o.user_id AS "userId",
         o.product_id AS "productId",
         o.quantity,
         o.created_at AS "createdAt",
         json_build_object(
           'id', p.id,
           'name', p.name,
           'price', p.price::float
         ) AS product,
         (p.price * o.quantity)::float AS total
       FROM orders o
       JOIN products p ON p.id = o.product_id
       WHERE o.id = $1`,
        [id]
      );
    } else {
      result = await pool.query(
        `SELECT
         o.id,
         o.user_id AS "userId",
         o.product_id AS "productId",
         o.quantity,
         o.created_at AS "createdAt",
         json_build_object(
           'id', p.id,
           'name', p.name,
           'price', p.price::float
         ) AS product,
         (p.price * o.quantity)::float AS total
       FROM orders o
       JOIN products p ON p.id = o.product_id
       WHERE o.id = $1
       AND o.user_id = $2`,
        [id, userID]
      );
    }


    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
