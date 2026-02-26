import type { User } from '@boilerplate/orm';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
