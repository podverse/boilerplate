import type { Request, Response, NextFunction } from 'express';
import { hasCrud, type CrudOp } from '@boilerplate/management-orm';

type Resource = 'admins' | 'users';

/**
 * Requires req.managementUser and that the admin has the given CRUD operation for the resource.
 * Super admin bypasses (has full access). Admins without permissions get 403.
 */
export function requireCrud(resource: Resource, op: CrudOp) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.managementUser;
    if (user === undefined) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    if (user.isSuperAdmin) {
      next();
      return;
    }
    const permissions = user.permissions;
    if (permissions === undefined || permissions === null) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    const crud = resource === 'admins' ? permissions.adminsCrud : permissions.usersCrud;
    if (!hasCrud(crud, op)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
