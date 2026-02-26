/**
 * OpenAPI 3.0 spec for the Boilerplate API. Served at /api-docs for Swagger UI.
 */
export const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Boilerplate API',
    version: '0.1.2',
    description:
      'HTTP API with JWT auth. Use **Authorize** to set a Bearer token from login/signup, then call protected endpoints.',
  },
  servers: [{ url: '/v1', description: 'API v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT from POST /v1/auth/login or POST /v1/auth/signup',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'User ID' },
          email: { type: 'string', format: 'email' },
          displayName: { type: 'string', nullable: true },
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
          user: { $ref: '#/components/schemas/User' },
        },
      },
      ChangePasswordBody: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', minLength: 1 },
          newPassword: { type: 'string', minLength: 1 },
        },
      },
      SignupBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 },
          displayName: { type: 'string', nullable: true },
        },
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
        description: 'Authenticate with email and password; returns JWT and user. Use the token in Authorize for protected routes.',
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
    '/auth/logout': {
      post: {
        summary: 'Logout',
        description: 'Client should discard the token; server returns 204.',
        operationId: 'authLogout',
        responses: {
          '204': { description: 'No content' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Current user',
        description: 'Returns the authenticated user. Requires Bearer token.',
        operationId: 'authMe',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { $ref: '#/components/schemas/User' } },
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
    '/auth/change-password': {
      post: {
        summary: 'Change password',
        description: 'Updates password for the authenticated user. Requires Bearer token.',
        operationId: 'authChangePassword',
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
    '/auth/signup': {
      post: {
        summary: 'Sign up',
        description:
          'Register a new user when MAILER_ENABLED is true. When signup is disabled (admin_only), returns 403. Returns 201 with a success message in all success cases (new user receives token and user; existing email receives generic message only, to avoid account enumeration).',
        operationId: 'authSignup',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/SignupBody' } },
          },
        },
        responses: {
          '201': {
            description: 'Created or already registered (generic success; new users receive token and user)',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/LoginResponse' },
                    { type: 'object', properties: { message: { type: 'string', example: 'Registration complete.' } } },
                  ],
                },
              },
            },
          },
          '400': {
            description: 'Email and password required',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
          '403': {
            description: 'Registration is by admin only',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
            },
          },
        },
      },
    },
  },
} as const;
