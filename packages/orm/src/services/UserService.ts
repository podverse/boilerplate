import type { UserWithRelations } from '../types/UserWithRelations.js';
import { appDataSourceRead, appDataSourceReadWrite } from '../data-source.js';
import { User } from '../entities/User.js';
import { UserCredentials } from '../entities/UserCredentials.js';
import { UserBio } from '../entities/UserBio.js';

const USER_RELATIONS = ['credentials', 'bio'] as const;

export class UserService {
  static async findById(id: string): Promise<UserWithRelations | null> {
    const repo = appDataSourceRead.getRepository(User);
    return repo.findOne({
      where: { id },
      relations: [...USER_RELATIONS],
    }) as Promise<UserWithRelations | null>;
  }

  static async findByEmail(email: string): Promise<UserWithRelations | null> {
    const credRepo = appDataSourceRead.getRepository(UserCredentials);
    const cred = await credRepo.findOne({ where: { email } });
    if (cred === null) return null;
    return this.findById(cred.userId) as Promise<UserWithRelations | null>;
  }

  /**
   * Create a user with credentials (and optionally bio) in a single transaction.
   * Atomicity is enforced at the application layer; FK ON DELETE CASCADE on user_credentials
   * and user_bio handles cleanup when a user row is deleted.
   * Display name (user_bio) is optional in main.
   */
  static async create(data: {
    email: string;
    password: string;
    displayName?: string | null;
    profileVisibility?: boolean;
  }): Promise<UserWithRelations> {
    const qr = appDataSourceReadWrite.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const userRepo = qr.manager.getRepository(User);
      const credRepo = qr.manager.getRepository(UserCredentials);
      const bioRepo = qr.manager.getRepository(UserBio);

      const user = userRepo.create({
        profileVisibility: data.profileVisibility ?? false,
      });
      const savedUser = await userRepo.save(user);

      const cred = credRepo.create({
        userId: savedUser.id,
        email: data.email,
        passwordHash: data.password,
      });
      await credRepo.save(cred);

      const bio = bioRepo.create({
        userId: savedUser.id,
        displayName: data.displayName ?? null,
      });
      await bioRepo.save(bio);

      await qr.commitTransaction();
      const withRelations = await userRepo.findOne({
        where: { id: savedUser.id },
        relations: [...USER_RELATIONS],
      });
      if (withRelations !== null) return withRelations as UserWithRelations;
      throw new Error('User created but failed to load with relations');
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  static async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const repo = appDataSourceReadWrite.getRepository(UserCredentials);
    await repo.update({ userId }, { passwordHash: hashedPassword });
  }

  static async setEmailVerifiedAt(userId: string): Promise<void> {
    const repo = appDataSourceReadWrite.getRepository(User);
    await repo.update(userId, { emailVerifiedAt: new Date() });
  }

  static async updateEmail(userId: string, newEmail: string): Promise<void> {
    const repo = appDataSourceReadWrite.getRepository(UserCredentials);
    await repo.update({ userId }, { email: newEmail });
  }

  static async updateDisplayName(userId: string, displayName: string | null): Promise<void> {
    const repo = appDataSourceReadWrite.getRepository(UserBio);
    await repo.update({ userId }, { displayName });
  }

  static async updateProfileVisibility(userId: string, profileVisibility: boolean): Promise<void> {
    const repo = appDataSourceReadWrite.getRepository(User);
    await repo.update(userId, { profileVisibility });
  }
}
