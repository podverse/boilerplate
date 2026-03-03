import { Router } from 'express';
import type { RequestHandler } from 'express';
import { validateBody } from '../middleware/validateBody.js';
import {
  createBucketSchema,
  updateBucketSchema,
  createTopicSchema,
  createBucketAdminSchema,
  updateBucketAdminSchema,
  createMessageSchema,
  updateMessageSchema,
  publicSubmitMessageSchema,
} from '../schemas/buckets.js';
import * as bucketsController from '../controllers/bucketsController.js';
import * as bucketAdminsController from '../controllers/bucketAdminsController.js';
import * as bucketMessagesController from '../controllers/bucketMessagesController.js';

export function createBucketsRouter(requireAuthMiddleware: RequestHandler): Router {
  const router = Router();

  router.get('/', requireAuthMiddleware, bucketsController.listBuckets);
  router.post(
    '/',
    requireAuthMiddleware,
    validateBody(createBucketSchema),
    bucketsController.createBucket
  );
  router.get('/public/:id', bucketMessagesController.getPublicBucket);
  router.get('/public/:id/messages', bucketMessagesController.listPublicMessages);
  router.post(
    '/public/:id/messages',
    validateBody(publicSubmitMessageSchema),
    bucketMessagesController.publicSubmitMessage
  );

  router.get('/:id', requireAuthMiddleware, bucketsController.getBucket);
  router.patch(
    '/:id',
    requireAuthMiddleware,
    validateBody(updateBucketSchema),
    bucketsController.updateBucket
  );
  router.delete('/:id', requireAuthMiddleware, bucketsController.deleteBucket);

  router.get('/:bucketId/buckets', requireAuthMiddleware, bucketsController.listTopics);
  router.post(
    '/:bucketId/buckets',
    requireAuthMiddleware,
    validateBody(createTopicSchema),
    bucketsController.createTopic
  );

  router.get('/:bucketId/admins', requireAuthMiddleware, bucketAdminsController.listBucketAdmins);
  router.post(
    '/:bucketId/admins',
    requireAuthMiddleware,
    validateBody(createBucketAdminSchema),
    bucketAdminsController.createBucketAdmin
  );
  router.patch(
    '/:bucketId/admins/:userId',
    requireAuthMiddleware,
    validateBody(updateBucketAdminSchema),
    bucketAdminsController.updateBucketAdmin
  );
  router.delete(
    '/:bucketId/admins/:userId',
    requireAuthMiddleware,
    bucketAdminsController.deleteBucketAdmin
  );

  router.get('/:bucketId/messages', requireAuthMiddleware, bucketMessagesController.listMessages);
  router.post(
    '/:bucketId/messages',
    requireAuthMiddleware,
    validateBody(createMessageSchema),
    bucketMessagesController.createMessage
  );
  router.get('/:bucketId/messages/:id', requireAuthMiddleware, bucketMessagesController.getMessage);
  router.patch(
    '/:bucketId/messages/:id',
    requireAuthMiddleware,
    validateBody(updateMessageSchema),
    bucketMessagesController.updateMessage
  );
  router.delete(
    '/:bucketId/messages/:id',
    requireAuthMiddleware,
    bucketMessagesController.deleteMessage
  );

  return router;
}
