import type { UserWithRelations } from '../types/UserWithRelations.js';
import { appDataSource } from '../data-source.js';
import { User } from '../entities/User.js';
import { UserCredentials } from '../entities/UserCredentials.js';
import { UserBio } from '../entities/UserBio.js';

const USER_RELATIONS = ['credentials', 'bio'] as const;

export class UserService {
  static async findById(id: string): Promise<UserWithRelations | null> {
    const repo = appDataSource.getRepository(User);
    return repo.findOne({
      where: { id },
      relations: [...USER_RELATIONS],
    }) as Promise<UserWithRelations | null>;
  }

  static async findByEmail(email: string): Promise<UserWithRelations | null> {
    const credRepo = appDataSource.getRepository(UserCredentials);
    const cred = await credRepo.findOne({ where: { email } });
    if (cred === null) return null;
    return this.findById(cred.userId) as Promise<UserWithRelations | null>;
  }

  /**
   * Create a user with credentials (and optionally bio) in a single transaction.
   * The DB enforces that every user has exactly one user_credentials row (created in the same
   * transaction) and that user_credentials cannot be deleted directly—delete the user only
   * (CASCADE removes credentials and bio). Display name (user_bio) is optional in main.
   * This method sets the ensure_user_has_credentials constraint to DEFERRED at the start of
   * the transaction so the check runs at commit and sees both user and credentials rows.
   */
  static async create(data: {
    email: string;
    password: string;
    displayName?: string | null;
    profileVisibility?: boolean;
  }): Promise<UserWithRelations> {
    const qr = appDataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      await qr.manager.query('SET CONSTRAINTS ensure_user_has_credentials DEFERRED');
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
      const withRelations = await this.findById(savedUser.id);
      if (withRelations !== null) return withRelations;
      throw new Error('User created but failed to load with relations');
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  static async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const repo = appDataSource.getRepository(UserCredentials);
    await repo.update({ userId }, { passwordHash: hashedPassword });
  }

  static async setEmailVerifiedAt(userId: string): Promise<void> {
    const repo = appDataSource.getRepository(User);
    await repo.update(userId, { emailVerifiedAt: new Date() });
  }

  static async updateEmail(userId: string, newEmail: string): Promise<void> {
    const repo = appDataSource.getRepository(UserCredentials);
    await repo.update({ userId }, { email: newEmail });
  }
}
