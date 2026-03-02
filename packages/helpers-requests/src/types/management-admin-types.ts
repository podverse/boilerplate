/** Event visibility for admin permissions. Matches @boilerplate/management-orm EventVisibility. */
export type EventVisibility = 'own' | 'all_admins' | 'all';

/**
 * Safe shape for an admin in API list/get responses. Matches management-api managementUserToJson.
 * Never includes credentials; use for typing GET /admins and GET /admins/:id data.
 */
export interface PublicManagementUser {
  id: string;
  email: string;
  displayName: string;
  isSuperAdmin: boolean;
  createdAt: string;
  createdBy: string | null;
  permissions?: {
    adminsCrud: number;
    usersCrud: number;
    eventVisibility: EventVisibility;
  } | null;
}

/** Response data for GET /admins (paginated list). */
export interface ListAdminsData {
  admins: PublicManagementUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  truncatedTotal?: true;
}

/** Validated body for POST /admins. All required fields guaranteed by createAdminSchema. */
export interface CreateAdminBody {
  email: string;
  password: string;
  displayName: string;
  adminsCrud: number;
  usersCrud: number;
  eventVisibility: EventVisibility;
}

/** Validated body for PATCH /admins/:id. At least one field present; validated by updateAdminSchema. */
export interface UpdateAdminBody {
  email?: string;
  displayName?: string;
  password?: string;
  adminsCrud?: number;
  usersCrud?: number;
  eventVisibility?: EventVisibility;
}
