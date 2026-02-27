import { Entity, PrimaryColumn, Column } from 'typeorm';

export type ActorType = 'super_admin' | 'admin';

@Entity('management_event')
export class ManagementEvent {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'actor_id', type: 'text' })
  actorId!: string;

  @Column({ name: 'actor_type', type: 'text' })
  actorType!: ActorType;

  @Column({ type: 'text' })
  action!: string;

  @Column({ name: 'target_type', type: 'text', nullable: true })
  targetType!: string | null;

  @Column({ name: 'target_id', type: 'text', nullable: true })
  targetId!: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;

  @Column({ type: 'text', nullable: true })
  details!: string | null;
}
