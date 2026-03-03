import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { SHORT_TEXT_MAX_LENGTH } from '@boilerplate/helpers';

import type { User } from './User.js';

@Entity('bucket')
export class Bucket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'owner_id' })
  ownerId!: string;

  @Column({ type: 'varchar', length: SHORT_TEXT_MAX_LENGTH })
  name!: string;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic!: boolean;

  @Column({ name: 'parent_bucket_id', type: 'uuid', nullable: true })
  parentBucketId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @ManyToOne('Bucket', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_bucket_id' })
  parentBucket!: Bucket | null;

  @OneToMany('Bucket', (b: Bucket) => b.parentBucket)
  topics!: Bucket[];
}
