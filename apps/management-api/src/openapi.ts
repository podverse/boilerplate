/**
 * OpenAPI 3.0 spec for the Management API. Served at /api-docs for Swagger UI.
 */
export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Boilerplate Management API',
    version: '0.1.2',
    description:
      'Management API for super admin and admins. JWT from POST /auth/login. Use **Authorize** to set the Bearer token. Permissions (admins_crud, users_crud bitmasks, can_change_passwords, can_assign_permissions, event_visibility) apply to admins; super admin has full access.',
  },
  servers: [{ url: '/v1', description: 'API v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT from POST /v1/auth/login',
      },
    },
    schemas: {
      ManagementUser: {
        type: 'object',
        description:
          'Management user (super admin or admin). Credentials (e.g. passwordHash) are never returned.',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          displayName: { type: 'string' },
          isSuperAdmin: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          createdBy: { type: 'string', format: 'uuid', nullable: true },
          permissions: {
            type: 'object',
            nullable: true,
            properties: {
              adminsCrud: {
                type: 'integer',
                minimum: 0,
                maximum: 15,
                description: 'CRUD bitmask: create=1, read=2, update=4, delete=8',
              },
              usersCrud: {
                type: 'integer',
                minimum: 0,
                maximum: 15,
                description: 'CRUD bitmask for main-app users',
              },
              canChangePasswords: { type: 'boolean' },
              canAssignPermissions: { type: 'boolean' },
              eventVisibility: { type: 'string', enum: ['own', 'all_admins', 'all'] },
            },
          },
        },
      },
      MainUser: {
        type: 'object',
        description: 'Main-app user (id, email, displayName only; passwordHash never returned).',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          displayName: { type: 'string', nullable: true },
        },
      },
      Event: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          actorId: { type: 'string' },
          actorType: { type: 'string', enum: ['super_admin', 'admin'] },
          actorDisplayName: { type: 'string', nullable: true },
          action: { type: 'string' },
          targetType: { type: 'string', nullable: true },
          targetId: { type: 'string', nullable: true },
          timestamp: { type: 'string', format: 'date-time' },
          details: { type: 'string', nullable: true },
        },
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'JWT for Authorization: Bearer' },
          user: { $ref: '#/components/schemas/ManagementUser' },
        },
      },
      CreateAdminBody: {
        type: 'object',
        required: ['email', 'password', 'displayName'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          displayName: { type: 'string', maxLength: 50, minLength: 1 },
          adminsCrud: { type: 'integer', minimum: 0, maximum: 15, default: 0 },
          usersCrud: { type: 'integer', minimum: 0, maximum: 15, default: 0 },
          canChangePasswords: { type: 'boolean', default: false },
          canAssignPermissions: { type: 'boolean', default: false },
          eventVisibility: { type: 'string', enum: ['own', 'all_admins', 'all'], default: 'own' },
        },
      },
      UpdateAdminBody: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          displayName: { type: 'string', maxLength: 50, minLength: 1 },
          password: { type: 'string', minLength: 8 },
          adminsCrud: { type: 'integer', minimum: 0, maximum: 15 },
          usersCrud: { type: 'integer', minimum: 0, maximum: 15 },
          canChangePasswords: { type: 'boolean' },
          canAssignPermissions: { type: 'boolean' },
          eventVisibility: { type: 'string', enum: ['own', 'all_admins', 'all'] },
        },
      },
      ChangePasswordBody: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', minLength: 1 },
          newPassword: { type: 'string', minLength: 8 },
        },
      },
      CreateUserBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          displayName: { type: 'string', maxLength: 50, nullable: true },
          profileVisibility: { type: 'boolean', default: false },
        },
      },
      UpdateUserBody: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          displayName: { type: 'string', maxLength: 50, nullable: true },
          profileVisibility: { type: 'boolean' },
        },
      },
      ChangeUserPasswordBody: {
        type: 'object',
        required: ['newPassword'],
        properties: { newPassword: { type: 'string', minLength: 8 } },
      },
      ErrorMessage: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
    },
  },
  paths: {
    '/': {
      get: {
        summary: 'Root',
        description: 'Hello message and env info',
        operationId: 'root',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    env: { type: 'object', properties: { port: { type: 'integer' } } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Health check',
        description: 'Liveness/readiness; returns app name',
        operationId: 'health',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    app: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login',
        description:
          'Authenticate as super admin or admin; returns JWT and user. Use the token in Authorize for protected routes.',
        operationId: 'authLogin',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } },
          },
        },
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } },
            },
          },
          '400': {
            description: 'Email and password required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Current management user',
        description: 'Returns the authenticated super admin or admin. Requires Bearer token.',
        operationId: 'authMe',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/ManagementUser' } },
                },
              },
            },
          },
          '401': {
            description: 'Missing or invalid token',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
    '/admins': {
      get: {
        summary: 'List admins',
        description: 'List all admins (non–super-admin). Requires admins read permission.',
        operationId: 'listAdmins',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number (1-based)',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 100 },
            description: 'Max records per page (capped at server max)',
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by display name or email (case-insensitive substring)',
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    admins: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ManagementUser' },
                    },
                    total: { type: 'integer', description: 'Total matching records (capped)' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    truncatedTotal: {
                      type: 'boolean',
                      description: 'Present and true when actual total exceeds the cap',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
      post: {
        summary: 'Create admin',
        description: 'Create a new admin. Super admin only.',
        operationId: 'createAdmin',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateAdminBody' } },
          },
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { admin: { $ref: '#/components/schemas/ManagementUser' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Super admin only',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '409': {
            description: 'Email already in use',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
    '/admins/change-password': {
      post: {
        summary: 'Change own password',
        description:
          'Update password for the authenticated management user. Requires Bearer token.',
        operationId: 'changePassword',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordBody' } },
          },
        },
        responses: {
          '204': { description: 'Password updated' },
          '400': {
            description: 'currentPassword and newPassword required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '401': {
            description: 'Authentication required or current password incorrect',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
    '/admins/{id}': {
      get: {
        summary: 'Get admin by ID',
        description: 'Returns one admin. Requires admins read permission.',
        operationId: 'getAdmin',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { admin: { $ref: '#/components/schemas/ManagementUser' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '404': {
            description: 'Admin not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
      patch: {
        summary: 'Update admin',
        description:
          'Update admin. Permission fields (adminsCrud, usersCrud, etc.) can only be changed by super admin.',
        operationId: 'updateAdmin',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateAdminBody' } },
          },
        },
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { admin: { $ref: '#/components/schemas/ManagementUser' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions or only super admin can update permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '404': {
            description: 'Admin not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
      delete: {
        summary: 'Delete admin',
        description:
          'Remove an admin. Requires admins delete permission. Super admin cannot be deleted.',
        operationId: 'deleteAdmin',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '204': { description: 'Deleted' },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '404': {
            description: 'Admin not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        summary: 'List main-app users',
        description: 'List all main-app users. Requires users read permission.',
        operationId: 'listUsers',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: { type: 'array', items: { $ref: '#/components/schemas/MainUser' } },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
      post: {
        summary: 'Create main-app user',
        description: 'Create a new main-app user. Requires users create permission.',
        operationId: 'createUser',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateUserBody' } },
          },
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/MainUser' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '409': {
            description: 'Email already in use',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get main-app user by ID',
        operationId: 'getUser',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/MainUser' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
      patch: {
        summary: 'Update main-app user',
        operationId: 'updateUser',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateUserBody' } },
          },
        },
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/MainUser' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
      delete: {
        summary: 'Delete main-app user',
        operationId: 'deleteUser',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '204': { description: 'Deleted' },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
    '/users/{id}/change-password': {
      post: {
        summary: 'Change main-app user password',
        description:
          'Set new password for a main-app user. Requires can_change_passwords or super admin.',
        operationId: 'changeUserPassword',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ChangeUserPasswordBody' } },
          },
        },
        responses: {
          '204': { description: 'Password updated' },
          '400': {
            description: 'newPassword required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Insufficient permissions',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
    '/events': {
      get: {
        summary: 'List audit events',
        description:
          'Returns events filtered by role and event_visibility: super admin sees all; admins see events according to their event_visibility (own, all_admins, or all).',
        operationId: 'listEvents',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number (1-based)',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 100 },
            description: 'Max events per page (capped at server max)',
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', enum: ['recent', 'oldest'], default: 'recent' },
            description: 'Sort order: newest first (recent) or oldest first (oldest)',
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description:
              'Filter by action, actor_type, target_type, target_id, or details (case-insensitive substring)',
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    events: { type: 'array', items: { $ref: '#/components/schemas/Event' } },
                    total: { type: 'integer', description: 'Total matching events (capped)' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    truncatedTotal: {
                      type: 'boolean',
                      description: 'Present and true when actual total exceeds the cap',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
  },
} as const;
