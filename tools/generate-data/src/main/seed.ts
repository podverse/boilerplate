/**
 * Seeds the main DB with users, user_credentials, and user_bio.
 * Call only after loading apps/api .env so appDataSource has DB_*.
 * For columns with multiple eligible values (e.g. boolean, nullable), a value is chosen randomly per row.
 */
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

import { appDataSource, User, UserBio, UserCredentials } from '@boilerplate/orm';

import { SHORT_TEXT_MAX_LENGTH } from '@boilerplate/helpers';

const TEST_PASSWORD_PLAIN = 'Test!1Aa';

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

export async function seedMain(rows: number): Promise<void> {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }

  const passwordHash = await getPasswordHash();

  for (let i = 0; i < rows; i += 1) {
    await appDataSource.transaction(async (manager) => {
      // Force deferred check so user + credentials are visible when constraint runs at commit.
      await manager.query('SET CONSTRAINTS ALL DEFERRED');
      const uRepo = manager.getRepository(User);
      const cRepo = manager.getRepository(UserCredentials);
      const bRepo = manager.getRepository(UserBio);

      const user = uRepo.create({
        profileVisibility: faker.datatype.boolean(),
        emailVerifiedAt: faker.datatype.boolean(0.3) ? faker.date.past() : null,
      });
      await uRepo.save(user);

      const email =
        i === 0
          ? faker.internet.email()
          : `${faker.string.alphanumeric(8)}-${i}-${faker.internet.email()}`;
      const credentials = cRepo.create({
        userId: user.id,
        email,
        passwordHash,
      });
      await cRepo.save(credentials);

      const displayName = faker.datatype.boolean(0.8)
        ? truncateDisplayName(faker.person.fullName())
        : null;
      const bio = bRepo.create({
        userId: user.id,
        displayName,
      });
      await bRepo.save(bio);
    });
  }

  process.stdout.write(`Seeded main DB: ${rows} user(s).\n`);
}
