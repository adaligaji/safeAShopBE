import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

export const authRouter = Router();

/**
 * INTENTIONALLY VULNERABLE LAB VERSION
 * - Passwords are compared as plaintext.
 * - JWT uses a weak/default secret.
 * - No issuer/audience validation is configured.
 * - No rate limiting is applied.
 */
authRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      res.status(400).json({ message: 'username and password are required' });
      return;
    }

    const result = await pool.query(
      'SELECT id, username, password, role, name FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (!user || password !== user.password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      {
        username: user.username,
        role: user.role
      },
      secret,
      {
        subject: String(user.id),
        algorithm: 'HS256',
        expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn']
      }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});
