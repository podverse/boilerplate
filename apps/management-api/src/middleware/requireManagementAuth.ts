import type { Request, Response, NextFunction } from 'express';
import { ManagementUserService } from '@boilerplate/management-orm';
import { verifyManagementToken } from '../lib/auth/jwt.js';

/**
 * Attaches the full management user (including credentials and permissions) to req.managementUser.
 * Handlers must never serialize req.managementUser in responses; use managementUserToJson (or
 * userToJson for main-app users) so passwordHash and other credentials are never sent to the client.
 */
export function requireManagementAuth(jwtSecret: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (token === undefined || token === '') {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const payload = verifyManagementToken(token, jwtSecret);
    if (payload === null) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    const user = await ManagementUserService.findById(payload.sub);
    if (user === null) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.managementUser = user;
    next();
  };
}
