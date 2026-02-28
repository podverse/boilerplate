import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { EMAIL_MAX_LENGTH, PASSWORD_HASH_LENGTH } from '@boilerplate/helpers';

import type { ManagementUser } from './ManagementUser.js';

@Entity('management_user_credentials')
export class ManagementUserCredentials {
  @PrimaryColumn({ name: 'management_user_id', type: 'uuid' })
  managementUserId!: string;

  @Column({ type: 'varchar', length: EMAIL_MAX_LENGTH, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: PASSWORD_HASH_LENGTH })
  passwordHash!: string;

  @OneToOne('ManagementUser', 'credentials', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'management_user_id' })
  managementUser!: ManagementUser;
}
