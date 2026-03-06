import type { RequestHandler } from 'express';
import { Router } from 'express';
import * as adminsController from '../controllers/adminsController.js';
import * as adminRolesController from '../controllers/adminRolesController.js';
import { requireCrud } from '../middleware/requireCrud.js';
import { validateBody } from '../middleware/validateBody.js';
import {
  createAdminSchema,
  updateAdminSchema,
  changePasswordSchema,
  createManagementAdminRoleSchema,
  updateManagementAdminRoleSchema,
} from '../schemas/admins.js';

export function createAdminsRouter(
  requireAuth: RequestHandler,
  requireSuperAdminMiddleware: RequestHandler
): Router {
  const router = Router();

  router.get('/', requireAuth, requireCrud('admins', 'read'), (req, res) => {
    void adminsController.listAdmins(req, res);
  });
  router.get('/roles', requireAuth, requireCrud('admins', 'read'), (req, res) => {
    void adminRolesController.listManagementAdminRoles(req, res);
  });
  router.post(
    '/roles',
    requireAuth,
    requireCrud('admins', 'create'),
    validateBody(createManagementAdminRoleSchema),
    (req, res) => {
      void adminRolesController.createManagementAdminRole(req, res);
    }
  );
  router.patch(
    '/roles/:roleId',
    requireAuth,
    requireCrud('admins', 'update'),
    validateBody(updateManagementAdminRoleSchema),
    (req, res) => {
      void adminRolesController.updateManagementAdminRole(req, res);
    }
  );
  router.delete('/roles/:roleId', requireAuth, requireCrud('admins', 'delete'), (req, res) => {
    void adminRolesController.deleteManagementAdminRole(req, res);
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
