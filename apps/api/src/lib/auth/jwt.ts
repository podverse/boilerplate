import jwt, { type SignOptions } from 'jsonwebtoken';
import type { UserWithRelations } from '@boilerplate/orm';

const DEFAULT_EXPIRY = '7d';

export interface JwtPayload {
  sub: string;
  email: string;
}

export function signToken(
  user: UserWithRelations,
  secret: string,
  expiresIn: string = DEFAULT_EXPIRY
): string {
  const options = { expiresIn } as SignOptions;
  return jwt.sign(
    { sub: user.id, email: user.credentials.email } as JwtPayload,
    secret,
    options
  );
}

export function verifyToken(token: string, secret: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded !== null && typeof decoded.sub === 'string' ? decoded : null;
  } catch {
    return null;
  }
}
