import type { RequestHandler } from 'express';
import { Router } from 'express';
import * as usersController from '../controllers/usersController.js';
import { requireCrud } from '../middleware/requireCrud.js';
import { validateBody } from '../middleware/validateBody.js';
import { createUserSchema, updateUserSchema, changeUserPasswordSchema } from '../schemas/users.js';

export function createUsersRouter(requireAuth: RequestHandler): Router {
  const router = Router();

  router.get('/', requireAuth, requireCrud('users', 'read'), (req, res) => {
    void usersController.listUsers(req, res);
  });
  router.get('/:id', requireAuth, requireCrud('users', 'read'), (req, res) => {
    void usersController.getUser(req, res);
  });
  router.post(
    '/',
    requireAuth,
    requireCrud('users', 'create'),
    validateBody(createUserSchema),
    (req, res) => {
      void usersController.createUser(req, res);
    }
  );
  router.patch(
    '/:id',
    requireAuth,
    requireCrud('users', 'update'),
    validateBody(updateUserSchema),
    (req, res) => {
      void usersController.updateUser(req, res);
    }
  );
  router.delete('/:id', requireAuth, requireCrud('users', 'delete'), (req, res) => {
    void usersController.deleteUser(req, res);
  });
  router.post(
    '/:id/change-password',
    requireAuth,
    validateBody(changeUserPasswordSchema),
    (req, res) => {
      void usersController.changeUserPassword(req, res);
    }
  );

  return router;
}
