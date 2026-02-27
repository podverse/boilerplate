import { v4 as uuidv4 } from 'uuid';

import type { EventVisibility } from '../entities/AdminPermissions.js';
import { managementDataSource } from '../data-source.js';
import { ManagementEvent } from '../entities/ManagementEvent.js';
import type { ActorType } from '../entities/ManagementEvent.js';

type RecordEventParams = {
  actorId: string;
  actorType: ActorType;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  details?: string | null;
};

export type ListEventsOptions = {
  visibility: EventVisibility;
  actorId: string;
  actorType: ActorType;
  limit?: number;
  offset?: number;
};

export class ManagementEventService {
  static async record(params: RecordEventParams): Promise<ManagementEvent> {
    const repo = managementDataSource.getRepository(ManagementEvent);
    const event = repo.create({
      id: uuidv4(),
      actorId: params.actorId,
      actorType: params.actorType,
      action: params.action,
      targetType: params.targetType ?? null,
      targetId: params.targetId ?? null,
      details: params.details ?? null,
    });
    return repo.save(event);
  }

  /**
   * List events filtered by visibility. Super admin: use visibility 'all'.
   * Admin: use their event_visibility (own | all_admins | all).
   */
  static async findEventsWithVisibility(options: ListEventsOptions): Promise<ManagementEvent[]> {
    const repo = managementDataSource.getRepository(ManagementEvent);
    const qb = repo
      .createQueryBuilder('e')
      .orderBy('e.timestamp', 'DESC')
      .take(options.limit ?? 100)
      .skip(options.offset ?? 0);

    if (options.visibility === 'own') {
      qb.andWhere('e.actor_id = :actorId', { actorId: options.actorId });
    } else if (options.visibility === 'all_admins') {
      qb.andWhere("e.actor_type = 'admin'");
    }
    return qb.getMany();
  }
}
