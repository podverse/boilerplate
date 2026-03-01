/**
 * Test-only helper: create a super admin in the management DB for integration tests.
 * Not used by the app; bootstrap/setup for deployment belongs in root scripts/
 * (e.g. scripts/management-api/create-super-admin.mjs) and must not ship in Docker.
 */
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import {
  managementDataSource,
  ManagementUser,
  ManagementUserCredentials,
  ManagementUserBio,
  ManagementUserService,
} from '@boilerplate/management-orm';

const SALT_ROUNDS = 10;

export async function createSuperAdminForTest(email: string, password: string): Promise<void> {
  const existing = await ManagementUserService.findSuperAdmin();
  if (existing !== null) {
    return;
  }
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await managementDataSource.transaction(async (manager) => {
    const userRepo = manager.getRepository(ManagementUser);
    const credRepo = manager.getRepository(ManagementUserCredentials);
    const bioRepo = manager.getRepository(ManagementUserBio);

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
      displayName: 'Super Admin',
    });
    await bioRepo.save(bio);
  });
}
