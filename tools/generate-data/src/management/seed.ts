/**
 * Seeds the management DB with management_user, credentials, bio, admin_permissions, and management_event.
 * Call only after loading apps/management-api .env so managementDataSource has MANAGEMENT_DB_*.
 * Conditionally creates a super admin (superadmin@example.com) only if one does not already exist
 * (e.g. create-super-admin.mjs may have run during local startup). Regular seeded users are
 * always non–super-admin admins.
 * For columns with multiple eligible values (e.g. enums, booleans, nullables), a value is chosen randomly per row.
 */
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import {
  managementDataSource,
  AdminPermissions,
  ManagementEvent,
  ManagementUser,
  ManagementUserBio,
  ManagementUserCredentials,
} from '@boilerplate/management-orm';

import type { ActorType, EventVisibility } from '@boilerplate/management-orm';
import { SHORT_TEXT_MAX_LENGTH } from '@boilerplate/helpers';

const TEST_PASSWORD_PLAIN = 'Test!1Aa';
const SUPER_ADMIN_EMAIL = 'superadmin@example.com';

const EVENT_VISIBILITY_VALUES: EventVisibility[] = ['own', 'all_admins', 'all'];

const MANAGEMENT_EVENT_ACTIONS = [
  'user_created',
  'user_updated',
  'user_deleted',
  'user_password_changed',
  'admin_created',
  'admin_updated',
  'admin_deleted',
  'password_changed',
] as const;

const TARGET_TYPES = ['user', 'admin'] as const;

let cachedPasswordHash: string | null = null;

async function getPasswordHash(): Promise<string> {
  if (cachedPasswordHash !== null) return cachedPasswordHash;
  cachedPasswordHash = await bcrypt.hash(TEST_PASSWORD_PLAIN, 10);
  return cachedPasswordHash;
}

function truncateDisplayName(name: string): string {
  if (name.length <= SHORT_TEXT_MAX_LENGTH) return name;
  return name.slice(0, SHORT_TEXT_MAX_LENGTH);
}

function randomCrud(): number {
  return faker.number.int({ min: 0, max: 15 });
}

function randomEventVisibility(): EventVisibility {
  return faker.helpers.arrayElement(EVENT_VISIBILITY_VALUES);
}

function randomAction(): string {
  return faker.helpers.arrayElement([...MANAGEMENT_EVENT_ACTIONS]);
}

/** Seed management_event rows: one or more per management user, with plausible actions/targets. */
async function seedManagementEvents(
  eventRepo: ReturnType<typeof managementDataSource.getRepository<ManagementEvent>>,
  managementUserIds: { id: string; isSuperAdmin: boolean }[],
  count: number
): Promise<void> {
  if (managementUserIds.length === 0) return;

  for (let i = 0; i < count; i += 1) {
    const actor = faker.helpers.arrayElement(managementUserIds);
    const actorType: ActorType = actor.isSuperAdmin ? 'super_admin' : 'admin';
    const action = randomAction();
    const hasTarget = faker.datatype.boolean(0.7);
    const targetType = hasTarget ? faker.helpers.arrayElement([...TARGET_TYPES]) : null;
    const targetId =
      hasTarget && managementUserIds.length > 0
        ? faker.helpers.arrayElement(managementUserIds).id
        : null;
    const details = faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null;

    const event = eventRepo.create({
      id: uuidv4(),
      actorId: actor.id,
      actorType,
      action,
      targetType,
      targetId,
      timestamp: faker.date.recent({ days: 30 }),
      details,
    });
    await eventRepo.save(event);
  }
}

/** Create super admin (superadmin@example.com) only if none exists. */
async function ensureSuperAdmin(
  userRepo: ReturnType<typeof managementDataSource.getRepository<ManagementUser>>,
  credentialsRepo: ReturnType<typeof managementDataSource.getRepository<ManagementUserCredentials>>,
  bioRepo: ReturnType<typeof managementDataSource.getRepository<ManagementUserBio>>,
  passwordHash: string
): Promise<void> {
  const existing = await userRepo.findOne({
    where: { isSuperAdmin: true },
    select: ['id'],
  });
  if (existing !== null) {
    process.stdout.write('Super admin already exists; skipping super admin creation.\n');
    return;
  }

  const id = uuidv4();
  const user = userRepo.create({
    id,
    isSuperAdmin: true,
    createdBy: null,
  });
  await userRepo.save(user);

  const credentials = credentialsRepo.create({
    managementUserId: id,
    email: SUPER_ADMIN_EMAIL,
    passwordHash,
  });
  await credentialsRepo.save(credentials);

  const bio = bioRepo.create({
    managementUserId: id,
    displayName: null,
  });
  await bioRepo.save(bio);

  process.stdout.write(`Created super admin (${SUPER_ADMIN_EMAIL}).\n`);
}

export async function seedManagement(rows: number): Promise<void> {
  if (!managementDataSource.isInitialized) {
    await managementDataSource.initialize();
  }

  const userRepo = managementDataSource.getRepository(ManagementUser);
  const credentialsRepo = managementDataSource.getRepository(ManagementUserCredentials);
  const bioRepo = managementDataSource.getRepository(ManagementUserBio);
  const permissionsRepo = managementDataSource.getRepository(AdminPermissions);
  const eventRepo = managementDataSource.getRepository(ManagementEvent);
  const passwordHash = await getPasswordHash();

  await ensureSuperAdmin(userRepo, credentialsRepo, bioRepo, passwordHash);

  for (let i = 0; i < rows; i += 1) {
    const id = uuidv4();
    const user = userRepo.create({
      id,
      isSuperAdmin: false,
      createdBy: null,
    });
    await userRepo.save(user);

    const email =
      i === 0
        ? faker.internet.email()
        : `${faker.string.alphanumeric(8)}-${i}-${faker.internet.email()}`;
    const credentials = credentialsRepo.create({
      managementUserId: id,
      email,
      passwordHash,
    });
    await credentialsRepo.save(credentials);

    const displayName = faker.datatype.boolean(0.8)
      ? truncateDisplayName(faker.person.fullName())
      : null;
    const bio = bioRepo.create({
      managementUserId: id,
      displayName,
    });
    await bioRepo.save(bio);

    const permissions = permissionsRepo.create({
      adminId: id,
      adminsCrud: randomCrud(),
      usersCrud: randomCrud(),
      canChangePasswords: faker.datatype.boolean(),
      canAssignPermissions: faker.datatype.boolean(),
      eventVisibility: randomEventVisibility(),
    });
    await permissionsRepo.save(permissions);
  }

  const managementUserIds = await userRepo.find({
    select: ['id', 'isSuperAdmin'],
  });
  const eventCount = Math.min(rows * 3, Math.max(rows + 10, 20));
  await seedManagementEvents(eventRepo, managementUserIds, eventCount);

  process.stdout.write(
    `Seeded management DB: ${rows} management user(s), ${eventCount} management event(s).\n`
  );
}
