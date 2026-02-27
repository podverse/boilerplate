import {
  managementDataSource,
  ManagementUser,
  ManagementUserCredentials,
  ManagementUserBio,
  ManagementUserService,
} from '@boilerplate/management-orm';
import { v4 as uuidv4 } from 'uuid';

import { hashPassword } from './auth/hash.js';

/**
 * Ensure exactly one super admin exists. If SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD
 * are set and no super admin exists, create one. Call after management DB is initialized.
 */
export async function bootstrapSuperAdmin(): Promise<void> {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  if (email === undefined || email === '' || password === undefined || password === '') {
    return;
  }
  const existing = await ManagementUserService.findSuperAdmin();
  if (existing !== null) {
    return;
  }
  const userRepo = managementDataSource.getRepository(ManagementUser);
  const credRepo = managementDataSource.getRepository(ManagementUserCredentials);
  const bioRepo = managementDataSource.getRepository(ManagementUserBio);

  const id = uuidv4();
  const passwordHash = await hashPassword(password);
  const user = userRepo.create({
    id,
    isSuperAdmin: true,
    createdBy: null,
  });
  await userRepo.save(user);
  const cred = credRepo.create({
    managementUserId: id,
    email,
    passwordHash,
  });
  await credRepo.save(cred);
  const bio = bioRepo.create({
    managementUserId: id,
    displayName: null,
  });
  await bioRepo.save(bio);
}
