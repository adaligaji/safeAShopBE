import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayloadData, Role } from '../types/index.js';

declare global {
  namespace Express {
    interface Request { user?: JwtPayloadData; }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.header('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing bearer token' });
    return;
  }
  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET!,
      {
        algorithms: ['HS256']
      }
    ) as JwtPayloadData;

    req.user = decoded;
    
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    if (!roles.includes(req.user.role)) { res.status(403).json({ message: 'Insufficient permissions' }); return; }
    next();
  };
}
