/** Validated body for POST /users. Required fields guaranteed by createUserSchema. */
export interface CreateUserBody {
  email: string;
  password: string;
  displayName: string | null;
  profileVisibility: boolean;
}

/** Validated body for PATCH /users/:id. At least one field present. */
export interface UpdateUserBody {
  email?: string;
  displayName?: string | null;
  profileVisibility?: boolean;
}

/** Validated body for POST /users/:id/change-password. */
export interface ChangeUserPasswordBody {
  newPassword: string;
}
