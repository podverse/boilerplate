import { v4 as uuidv4 } from 'uuid';

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
}
