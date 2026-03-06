/** Validated body for POST /login. */
export interface LoginBody {
  email: string;
  password: string;
}

/** Validated body for POST /signup. */
export interface SignupBody {
  email: string;
  username: string;
  password: string;
  displayName?: string | null;
}

/** Validated body for POST /change-password (authenticated). */
export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

/** Validated body for POST /verify-email. */
export interface VerifyEmailBody {
  token: string;
}

/** Validated body for POST /forgot-password. */
export interface ForgotPasswordBody {
  email: string;
}

/** Validated body for POST /reset-password. */
export interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

/** Validated body for POST /auth/set-password (set password via token from username-only invite). */
export interface SetPasswordBody {
  token: string;
  newPassword: string;
}

/** Validated body for POST /request-email-change. */
export interface RequestEmailChangeBody {
  newEmail: string;
}

/** Validated body for POST /confirm-email-change. */
export interface ConfirmEmailChangeBody {
  token: string;
}

/** Validated body for PATCH /auth/me (update profile). */
export interface UpdateProfileBody {
  displayName?: string | null;
  username?: string | null;
}
