import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import type { Bucket } from './Bucket.js';

export type BucketAdminInvitationStatus = 'pending' | 'accepted' | 'rejected';

@Entity('bucket_admin_invitation')
export class BucketAdminInvitation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'bucket_id' })
  bucketId!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  token!: string;

  @Column({ name: 'bucket_crud', type: 'integer', default: 0 })
  bucketCrud!: number;

  @Column({ name: 'message_crud', type: 'integer', default: 0 })
  messageCrud!: number;

  @Column({ name: 'admin_crud', type: 'integer', default: 2 })
  adminCrud!: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: BucketAdminInvitationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt!: Date;

  @ManyToOne('Bucket', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bucket_id' })
  bucket!: Bucket;
}
