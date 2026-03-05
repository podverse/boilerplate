import type { RequestHandler } from 'express';
import { Router } from 'express';

import * as bucketAdminInvitationsController from '../controllers/bucketAdminInvitationsController.js';
import * as bucketAdminsController from '../controllers/bucketAdminsController.js';
import * as bucketsController from '../controllers/bucketsController.js';
import * as bucketMessagesController from '../controllers/bucketMessagesController.js';
import { requireCrud } from '../middleware/requireCrud.js';
import { validateBody } from '../middleware/validateBody.js';
import {
  createBucketSchema,
  updateBucketSchema,
  createBucketAdminInvitationSchema,
  updateBucketAdminSchema,
} from '../schemas/buckets.js';
import { createMessageSchema, updateMessageSchema } from '../schemas/messages.js';

export function createBucketsRouter(requireAuth: RequestHandler): Router {
  const router = Router();

  router.get('/', requireAuth, requireCrud('buckets', 'read'), (req, res) => {
    void bucketsController.listBuckets(req, res);
  });
  router.get('/:id', requireAuth, requireCrud('buckets', 'read'), (req, res) => {
    void bucketsController.getBucket(req, res);
  });
  router.get('/:id/buckets', requireAuth, requireCrud('buckets', 'read'), (req, res) => {
    void bucketsController.listTopics(req, res);
  });
  router.post(
    '/',
    requireAuth,
    requireCrud('buckets', 'create'),
    validateBody(createBucketSchema),
    (req, res) => {
      void bucketsController.createBucket(req, res);
    }
  );
  router.patch(
    '/:id',
    requireAuth,
    requireCrud('buckets', 'update'),
    validateBody(updateBucketSchema),
    (req, res) => {
      void bucketsController.updateBucket(req, res);
    }
  );
  router.delete('/:id', requireAuth, requireCrud('buckets', 'delete'), (req, res) => {
    void bucketsController.deleteBucket(req, res);
  });

  // Bucket admins: require buckets read + bucketAdmins CRUD (:id = bucket id/shortId)
  router.get(
    '/:id/admins',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('bucketAdmins', 'read'),
    (req, res) => {
      void bucketAdminsController.listBucketAdmins(req, res);
    }
  );
  router.get(
    '/:id/admins/:userId',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('bucketAdmins', 'read'),
    (req, res) => {
      void bucketAdminsController.getBucketAdmin(req, res);
    }
  );
  router.patch(
    '/:id/admins/:userId',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('bucketAdmins', 'update'),
    validateBody(updateBucketAdminSchema),
    (req, res) => {
      void bucketAdminsController.updateBucketAdmin(req, res);
    }
  );
  router.delete(
    '/:id/admins/:userId',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('bucketAdmins', 'delete'),
    (req, res) => {
      void bucketAdminsController.deleteBucketAdmin(req, res);
    }
  );

  // Bucket admin invitations: require buckets read + bucketAdmins CRUD
  router.get(
    '/:id/admin-invitations',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('bucketAdmins', 'read'),
    (req, res) => {
      void bucketAdminInvitationsController.listBucketAdminInvitations(req, res);
    }
  );
  router.post(
    '/:id/admin-invitations',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('bucketAdmins', 'create'),
    validateBody(createBucketAdminInvitationSchema),
    (req, res) => {
      void bucketAdminInvitationsController.createBucketAdminInvitation(req, res);
    }
  );
  router.delete(
    '/:id/admin-invitations/:invitationId',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('bucketAdmins', 'delete'),
    (req, res) => {
      void bucketAdminInvitationsController.deleteBucketAdminInvitation(req, res);
    }
  );

  // Messages: require buckets read + messages CRUD
  router.get(
    '/:bucketId/messages',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('messages', 'read'),
    (req, res) => {
      void bucketMessagesController.listMessages(req, res);
    }
  );
  router.get(
    '/:bucketId/messages/:messageId',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('messages', 'read'),
    (req, res) => {
      void bucketMessagesController.getMessage(req, res);
    }
  );
  router.post(
    '/:bucketId/messages',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('messages', 'create'),
    validateBody(createMessageSchema),
    (req, res) => {
      void bucketMessagesController.createMessage(req, res);
    }
  );
  router.patch(
    '/:bucketId/messages/:messageId',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('messages', 'update'),
    validateBody(updateMessageSchema),
    (req, res) => {
      void bucketMessagesController.updateMessage(req, res);
    }
  );
  router.delete(
    '/:bucketId/messages/:messageId',
    requireAuth,
    requireCrud('buckets', 'read'),
    requireCrud('messages', 'delete'),
    (req, res) => {
      void bucketMessagesController.deleteMessage(req, res);
    }
  );

  return router;
}
