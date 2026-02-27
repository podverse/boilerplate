import jwt, { type SignOptions } from 'jsonwebtoken';
import type { ManagementUser } from '@boilerplate/management-orm';

const DEFAULT_EXPIRY = '7d';

export interface ManagementJwtPayload {
  sub: string;
  email: string;
  isSuperAdmin: boolean;
}

export function signManagementToken(
  user: ManagementUser,
  secret: string,
  expiresIn: string = DEFAULT_EXPIRY
): string {
  const options = { expiresIn } as SignOptions;
  return jwt.sign(
    {
      sub: user.id,
      email: user.credentials.email,
      isSuperAdmin: user.isSuperAdmin,
    } as ManagementJwtPayload,
    secret,
    options
  );
}

export function verifyManagementToken(token: string, secret: string): ManagementJwtPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as ManagementJwtPayload;
    return decoded !== null &&
      typeof decoded.sub === 'string' &&
      typeof decoded.email === 'string' &&
      typeof decoded.isSuperAdmin === 'boolean'
      ? decoded
      : null;
  } catch {
    return null;
  }
}
