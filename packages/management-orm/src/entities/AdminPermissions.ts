import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { ManagementUser } from './ManagementUser.js';

export type EventVisibility = 'own' | 'all_admins' | 'all';

/** CRUD bitmask: create=1, read=2, update=4, delete=8. Value 0–15. */
export const CrudMask = { create: 1, read: 2, update: 4, delete: 8 } as const;

export type CrudOp = keyof typeof CrudMask;

export function hasCrud(crud: number, op: CrudOp): boolean {
  return (crud & CrudMask[op]) !== 0;
}

@Entity('admin_permissions')
export class AdminPermissions {
  @PrimaryColumn({ name: 'admin_id', type: 'uuid' })
  adminId!: string;

  @Column({ name: 'admins_crud', type: 'integer', default: 0 })
  adminsCrud!: number;

  @Column({ name: 'users_crud', type: 'integer', default: 0 })
  usersCrud!: number;

  @Column({ name: 'can_change_passwords', type: 'boolean', default: false })
  canChangePasswords!: boolean;

  @Column({ name: 'can_assign_permissions', type: 'boolean', default: false })
  canAssignPermissions!: boolean;

  @Column({ name: 'event_visibility', type: 'text', default: 'own' })
  eventVisibility!: EventVisibility;

  @OneToOne(() => ManagementUser, (u) => u.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  managementUser!: ManagementUser;
}
