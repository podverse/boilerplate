import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';

import { EMAIL_MAX_LENGTH, PASSWORD_HASH_LENGTH } from '@boilerplate/helpers';

import { User } from './User.js';

@Entity('user_credentials')
export class UserCredentials {
  @PrimaryColumn('uuid')
  userId!: string;

  @Column({ type: 'varchar', length: EMAIL_MAX_LENGTH, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: PASSWORD_HASH_LENGTH })
  password!: string;

  @OneToOne(() => User, (u) => u.credentials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
