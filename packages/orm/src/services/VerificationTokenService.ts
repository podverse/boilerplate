import { appDataSource } from '../data-source.js';
import type { User } from '../entities/User.js';
import { VerificationToken } from '../entities/VerificationToken.js';
import { UserService } from './UserService.js';

export type VerificationKind = 'email_verify' | 'password_reset' | 'email_change';

export interface ConsumedToken {
  user: User;
  payload: Record<string, unknown> | null;
}

export class VerificationTokenService {
  static async createToken(
    userId: string,
    kind: VerificationKind,
    tokenHash: string,
    expiresAt: Date,
    payload: Record<string, unknown> | null = null
  ): Promise<VerificationToken> {
    const repo = appDataSource.getRepository(VerificationToken);
    const token = repo.create({
      userId,
      kind,
      tokenHash,
      expiresAt,
      payload,
    });
    return repo.save(token);
  }

  static async consumeToken(
    tokenHash: string,
    kind: VerificationKind
  ): Promise<ConsumedToken | null> {
    const repo = appDataSource.getRepository(VerificationToken);
    const token = await repo.findOne({
      where: { tokenHash, kind },
      relations: ['user'],
    });
    if (token === null) return null;
    if (token.expiresAt < new Date()) return null;

    const user = await UserService.findById(token.userId);
    if (user === null) return null;

    await repo.remove(token);
    return {
      user,
      payload: token.payload,
    };
  }
}
