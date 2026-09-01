import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../services/jsonDb.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) { res.status(400).json({ message: 'username and password are required' }); return; }

  const users = await db.users.all();
  const user = users.find((item) => item.username === username);
  if (!user || password !== user.password) {
    res.status(401).json({ message: 'Invalid credentials' }); return;
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET || 'dev-only-secret',
    { subject: String(user.id), expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'] }
  );

  res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
});
