import {
  getEffectiveUserAgent,
  normalizeVersionPath,
  parseCookieSameSite,
  parseCorsOrigins,
} from '@boilerplate/helpers';

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

const getEnvOptional = (key: string): string | undefined =>
  process.env[key] === undefined || process.env[key] === '' ? undefined : process.env[key];

const AUTH_MODE_ADMIN_ONLY_USERNAME = 'admin_only_username';
const AUTH_MODE_ADMIN_ONLY_EMAIL = 'admin_only_email';
const AUTH_MODE_USER_SIGNUP_EMAIL = 'user_signup_email';

export type AuthMode =
  | typeof AUTH_MODE_ADMIN_ONLY_USERNAME
  | typeof AUTH_MODE_ADMIN_ONLY_EMAIL
  | typeof AUTH_MODE_USER_SIGNUP_EMAIL;

export type AuthModeCapabilities = {
  canPublicSignup: boolean;
  canUseEmailVerificationFlows: boolean;
  canIssueAdminInviteLink: boolean;
  requiresEmailAtInviteCompletion: boolean;
};

const parseAuthMode = (value: string): AuthMode => {
  if (value === AUTH_MODE_ADMIN_ONLY_USERNAME) {
    return AUTH_MODE_ADMIN_ONLY_USERNAME;
  }
  if (value === AUTH_MODE_ADMIN_ONLY_EMAIL) {
    return AUTH_MODE_ADMIN_ONLY_EMAIL;
  }
  if (value === AUTH_MODE_USER_SIGNUP_EMAIL) {
    return AUTH_MODE_USER_SIGNUP_EMAIL;
  }
  throw new Error(
    `Invalid AUTH_MODE: ${value}. Expected one of: ${AUTH_MODE_ADMIN_ONLY_USERNAME}, ${AUTH_MODE_ADMIN_ONLY_EMAIL}, ${AUTH_MODE_USER_SIGNUP_EMAIL}`
  );
};

export const getAuthModeCapabilities = (authMode: AuthMode): AuthModeCapabilities => {
  if (authMode === AUTH_MODE_ADMIN_ONLY_USERNAME) {
    return {
      canPublicSignup: false,
      canUseEmailVerificationFlows: false,
      canIssueAdminInviteLink: true,
      requiresEmailAtInviteCompletion: false,
    };
  }
  if (authMode === AUTH_MODE_ADMIN_ONLY_EMAIL) {
    return {
      canPublicSignup: false,
      canUseEmailVerificationFlows: true,
      canIssueAdminInviteLink: true,
      requiresEmailAtInviteCompletion: true,
    };
  }
  return {
    canPublicSignup: true,
    canUseEmailVerificationFlows: true,
    canIssueAdminInviteLink: false,
    requiresEmailAtInviteCompletion: false,
  };
};

/** Signup (POST /auth/signup) is enabled only when AUTH_MODE=user_signup_email. */
export const isSignupEnabled = (): boolean => {
  const authMode = parseAuthMode(getEnv('AUTH_MODE'));
  return getAuthModeCapabilities(authMode).canPublicSignup;
};

const authMode = parseAuthMode(getEnv('AUTH_MODE'));
const authModeCapabilities = getAuthModeCapabilities(authMode);

/** User-Agent suffix when USER_AGENT is blank. Boilerplate uses version 1 (Podverse uses 5). */
const USER_AGENT_SUFFIX = ' Bot Local/API/1';

export const config = {
  /** Auth mode (required at startup): admin_only_username, admin_only_email, user_signup_email. */
  authMode,
  authModeCapabilities,
  port: Number.parseInt(getEnv('API_PORT'), 10),
  brandName: getEnv('BRAND_NAME'),
  /** Effective User-Agent for outbound requests. When USER_AGENT is blank, built from BRAND_NAME + suffix. */
  userAgent: getEffectiveUserAgent({
    userAgentRaw: getEnvOptional('USER_AGENT'),
    brandName: getEnv('BRAND_NAME'),
    suffix: USER_AGENT_SUFFIX,
  }),
  jwtSecret: getEnv('JWT_SECRET'),
  /** API version path prefix (e.g. /v1). Optional; set API_VERSION_PATH in env. */
  apiVersionPath: normalizeVersionPath(getEnvOptional('API_VERSION_PATH') ?? 'v1'),
  /** Access token expiry in seconds (JWT and cookie max-age). Required; e.g. 900 = 15m. */
  accessTokenMaxAgeSeconds: Number.parseInt(getEnv('JWT_ACCESS_EXPIRY_SECONDS'), 10),
  /** Refresh token cookie max-age in seconds (e.g. 604800 = 7d). Required. */
  refreshTokenMaxAgeSeconds: Number.parseInt(getEnv('JWT_REFRESH_EXPIRY_SECONDS'), 10),
  /** Cookie names for session (access) and refresh. Required. */
  sessionCookieName: getEnv('SESSION_COOKIE_NAME'),
  refreshCookieName: getEnv('REFRESH_COOKIE_NAME'),
  /** CORS allowed origins. Optional; empty/missing = allow all (dev). */
  corsOrigins: parseCorsOrigins(getEnvOptional('CORS_ORIGINS')),
  /** Secure cookies in production. */
  cookieSecure: process.env.NODE_ENV === 'production',
  /** SameSite: lax, strict, or none. Required. */
  cookieSameSite: parseCookieSameSite(getEnv('COOKIE_SAME_SITE'), 'COOKIE_SAME_SITE'),
};
