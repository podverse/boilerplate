import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  EMAIL_MAX_LENGTH,
  PASSWORD_HASH_LENGTH,
  SHORT_TEXT_MAX_LENGTH,
} from '@boilerplate/helpers';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: EMAIL_MAX_LENGTH, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: PASSWORD_HASH_LENGTH })
  password!: string;

  @Column({ type: 'varchar', length: SHORT_TEXT_MAX_LENGTH, nullable: true })
  displayName!: string | null;

  @Column({ name: 'profile_visibility', type: 'boolean', default: false })
  profileVisibility!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
