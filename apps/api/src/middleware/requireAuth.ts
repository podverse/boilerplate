import type { Request, Response, NextFunction } from 'express';
import { UserService } from '@boilerplate/orm';
import { verifyToken } from '../lib/auth/jwt.js';

/**
 * Attaches the full user (including credentials) to req.user for use in handlers.
 * Handlers must never serialize req.user in responses; use userToJson (or similar)
 * so passwordHash and other credentials are never sent to the client.
 */
export function requireAuth(jwtSecret: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (token === undefined || token === '') {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const payload = verifyToken(token, jwtSecret);
    if (payload === null) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    const user = await UserService.findById(payload.sub);
    if (user === null) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  };
}
