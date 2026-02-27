import type { Request, Response } from 'express';
import { ManagementEventService } from '@boilerplate/management-orm';
import type { ActorType } from '@boilerplate/management-orm';

/**
 * Safe shape for event in API responses. No sensitive data.
 */
function eventToJson(e: {
  id: string;
  actorId: string;
  actorType: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  timestamp: Date;
  details: string | null;
}) {
  return {
    id: e.id,
    actorId: e.actorId,
    actorType: e.actorType,
    action: e.action,
    targetType: e.targetType,
    targetId: e.targetId,
    timestamp: e.timestamp instanceof Date ? e.timestamp.toISOString() : e.timestamp,
    details: e.details,
  };
}

export async function listEvents(req: Request, res: Response): Promise<void> {
  const user = req.managementUser;
  if (user === undefined) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  const limit = Number(req.query.limit) || 100;
  const offset = Number(req.query.offset) || 0;
  const visibility = user.isSuperAdmin ? 'all' : (user.permissions?.eventVisibility ?? 'own');
  const events = await ManagementEventService.findEventsWithVisibility({
    visibility,
    actorId: user.id,
    actorType: (user.isSuperAdmin ? 'super_admin' : 'admin') as ActorType,
    limit: Math.min(limit, 500),
    offset,
  });
  res.status(200).json({
    events: events.map(eventToJson),
  });
}
