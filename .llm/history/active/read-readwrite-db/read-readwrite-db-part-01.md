# Read / Read-Write Database Connections

- **Started:** 2025-03-02
- **Context:** Use read DB user for read-only service methods and read-write user for methods that write; no single method uses both connections (to keep transactions feasible).

### Session 1 - 2025-03-02

#### Prompt (Developer)

It looks like boilerplate has read and read write database users that should be available But it looks like ORM only makes use of get read write. I think the intention of having both users is to Use read within service methods that only ever need to read and to use read write Within service methods where write or write and read are both used. Note that we do not want one service method to use both database connections because that would make transactions difficult to do in the future So crawl through boilerplate and if there is a method that only uses Read operations, it should use the read database connection and for the methods that involve write somewhere it should use the read write connection

#### Key Decisions

- ORM exports `appDataSourceRead` (DB_READ_*) and `appDataSourceReadWrite` (DB_READ_WRITE_*); `appDataSource` kept as alias for read-write for backward compat.
- UserService: findById, findByEmail use read; create, updatePassword, setEmailVerifiedAt, updateEmail use read-write. create() loads created user with relations via same read-write connection (no call to findById) to avoid mixing connections.
- VerificationTokenService and RefreshTokenService: all methods use read-write (all involve write). consumeToken methods use token.user from relation instead of UserService.findById to avoid mixing connections.
- management-api usersController: listUsers uses appDataSourceRead; updateUser/deleteUser use appDataSourceReadWrite.
- Apps and tests initialize and destroy both appDataSourceRead and appDataSourceReadWrite.

#### Files Created/Modified

- packages/orm/src/data-source.ts (read + read-write DataSources)
- packages/orm/src/index.ts (export appDataSourceRead, appDataSourceReadWrite)
- packages/orm/src/services/UserService.ts
- packages/orm/src/services/VerificationTokenService.ts
- packages/orm/src/services/RefreshTokenService.ts
- apps/api/src/index.ts
- apps/management-api/src/index.ts
- apps/management-api/src/controllers/usersController.ts
- apps/api/src/test/global-setup.mjs (DB_READ_* in test env)
- apps/api/src/test/auth.test.ts, auth-mailer.test.ts, auth-rate-limit.test.ts, auth-locale.test.ts, auth-no-mailer.test.ts
- apps/management-api/src/test/management-admins-permissions.test.ts, management-users-permissions.test.ts, management-api.test.ts, management-api-rate-limit.test.ts
