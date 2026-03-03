import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { UserCredentials } from './UserCredentials.js';
import { UserBio } from './UserBio.js';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'short_id', length: 12, unique: true })
  shortId!: string;

  @Column({ name: 'profile_visibility', type: 'boolean', default: false })
  profileVisibility!: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToOne(() => UserCredentials, (c) => c.user)
  credentials!: UserCredentials;

  @OneToOne(() => UserBio, (b) => b.user)
  bio!: UserBio;
}
