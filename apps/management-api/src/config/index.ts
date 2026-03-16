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

const authMode = parseAuthMode(getEnv('AUTH_MODE'));
const authModeCapabilities = getAuthModeCapabilities(authMode);

/** User-Agent suffix when USER_AGENT is blank. Boilerplate uses version 1 (Podverse uses 5). */
const USER_AGENT_SUFFIX = ' Bot Local/Management-API/1';

export const config = {
  authMode,
  authModeCapabilities,
  port: Number.parseInt(getEnv('MANAGEMENT_API_PORT'), 10),
  brandName: getEnv('BRAND_NAME'),
  /** Effective User-Agent for outbound requests. When USER_AGENT is blank, built from BRAND_NAME + suffix. */
  userAgent: getEffectiveUserAgent({
    userAgentRaw: getEnvOptional('USER_AGENT'),
    brandName: getEnv('BRAND_NAME'),
    suffix: USER_AGENT_SUFFIX,
  }),
  jwtSecret: getEnv('MANAGEMENT_JWT_SECRET'),
  apiVersionPath: normalizeVersionPath(getEnvOptional('MANAGEMENT_API_VERSION_PATH') ?? 'v1'),
  /** Access token expiry in seconds (JWT and cookie max-age). Required; e.g. 900 = 15m. */
  accessTokenMaxAgeSeconds: Number.parseInt(getEnv('MANAGEMENT_JWT_ACCESS_EXPIRY_SECONDS'), 10),
  refreshTokenMaxAgeSeconds: Number.parseInt(getEnv('MANAGEMENT_JWT_REFRESH_EXPIRY_SECONDS'), 10),
  sessionCookieName: getEnv('MANAGEMENT_SESSION_COOKIE_NAME'),
  refreshCookieName: getEnv('MANAGEMENT_REFRESH_COOKIE_NAME'),
  corsOrigins: parseCorsOrigins(getEnvOptional('MANAGEMENT_CORS_ORIGINS')),
  cookieSecure: process.env.NODE_ENV === 'production',
  cookieSameSite: parseCookieSameSite(
    getEnv('MANAGEMENT_COOKIE_SAME_SITE'),
    'MANAGEMENT_COOKIE_SAME_SITE'
  ),
  /** Invitation/set-password link expiry in hours for admin-created users. */
  userInvitationTtlHours: Number.parseInt(getEnv('USER_INVITATION_TTL_HOURS'), 10),
  /** Main web app base URL (optional). Used to build invitation/set-password links. */
  webAppUrl: getEnvOptional('WEB_APP_URL'),
};
