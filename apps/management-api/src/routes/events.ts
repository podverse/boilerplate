import type { RequestHandler } from 'express';
import { Router } from 'express';
import * as eventsController from '../controllers/eventsController.js';

export function createEventsRouter(requireAuth: RequestHandler): Router {
  const router = Router();
  router.get('/', requireAuth, (req, res) => {
    void eventsController.listEvents(req, res);
  });
  return router;
}
