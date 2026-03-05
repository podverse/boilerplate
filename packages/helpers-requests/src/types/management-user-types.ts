/** Main-app user as returned by GET /users and GET /users/:id (safe, no credentials). */
export interface PublicMainAppUser {
  id: string;
  email: string;
  displayName: string | null;
}

/** Response shape for GET /users. */
export interface ListUsersData {
  users: PublicMainAppUser[];
}

/** Validated body for POST /users. Required fields guaranteed by createUserSchema. */
export interface CreateUserBody {
  email: string;
  password: string;
  displayName: string | null;
}

/** Validated body for PATCH /users/:id. At least one field present. */
export interface UpdateUserBody {
  email?: string;
  displayName?: string | null;
}

/** Validated body for POST /users/:id/change-password. */
export interface ChangeUserPasswordBody {
  newPassword: string;
}
