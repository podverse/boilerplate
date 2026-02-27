import type { RequestHandler } from 'express';
import { Router } from 'express';
import * as adminsController from '../controllers/adminsController.js';
import { requireCrud } from '../middleware/requireCrud.js';
import { validateBody } from '../middleware/validateBody.js';
import { createAdminSchema, updateAdminSchema, changePasswordSchema } from '../schemas/admins.js';

export function createAdminsRouter(
  requireAuth: RequestHandler,
  requireSuperAdminMiddleware: RequestHandler
): Router {
  const router = Router();

  router.get('/', requireAuth, requireCrud('admins', 'read'), (req, res) => {
    void adminsController.listAdmins(req, res);
  });
  router.get('/:id', requireAuth, requireCrud('admins', 'read'), (req, res) => {
    void adminsController.getAdmin(req, res);
  });
  router.post(
    '/',
    requireAuth,
    requireSuperAdminMiddleware,
    validateBody(createAdminSchema),
    (req, res) => {
      void adminsController.createAdmin(req, res);
    }
  );
  router.patch(
    '/:id',
    requireAuth,
    requireCrud('admins', 'update'),
    validateBody(updateAdminSchema),
    (req, res) => {
      void adminsController.updateAdmin(req, res);
    }
  );
  router.delete('/:id', requireAuth, requireCrud('admins', 'delete'), (req, res) => {
    void adminsController.deleteAdmin(req, res);
  });
  router.post('/change-password', requireAuth, validateBody(changePasswordSchema), (req, res) => {
    void adminsController.changePassword(req, res);
  });

  return router;
}
