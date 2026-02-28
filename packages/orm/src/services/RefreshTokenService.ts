import { appDataSource } from '../data-source.js';
import type { User } from '../entities/User.js';
import { RefreshToken } from '../entities/RefreshToken.js';
import { UserService } from './UserService.js';

export class RefreshTokenService {
  static async createToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<RefreshToken> {
    const repo = appDataSource.getRepository(RefreshToken);
    const token = repo.create({ userId, tokenHash, expiresAt });
    return repo.save(token);
  }

  /**
   * Find refresh token by hash, verify not expired, delete it (rotation), return user.
   * Returns null if not found or expired.
   */
  static async consumeToken(tokenHash: string): Promise<User | null> {
    const repo = appDataSource.getRepository(RefreshToken);
    const token = await repo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });
    if (token === null) return null;
    if (token.expiresAt < new Date()) {
      await repo.remove(token);
      return null;
    }

    const user = await UserService.findById(token.userId);
    if (user === null) return null;

    await repo.remove(token);
    return user;
  }

  /**
   * Delete refresh token by hash (e.g. on logout when we have the cookie).
   */
  static async revokeByTokenHash(tokenHash: string): Promise<void> {
    const repo = appDataSource.getRepository(RefreshToken);
    await repo.delete({ tokenHash });
  }

  /**
   * Revoke all refresh tokens for a user (e.g. on logout all / security).
   */
  static async revokeAllForUser(userId: string): Promise<void> {
    const repo = appDataSource.getRepository(RefreshToken);
    await repo.delete({ userId });
  }
}
