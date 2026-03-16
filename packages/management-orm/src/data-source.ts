/**
 * TypeORM DataSource for the management store (Postgres).
 * Set MANAGEMENT_DB_HOST, MANAGEMENT_DB_PORT, MANAGEMENT_DB_NAME, MANAGEMENT_DB_USERNAME,
 * MANAGEMENT_DB_PASSWORD (validate at app startup before using).
 * Run infra/management-database/combined/init_management_database.sql once to create the schema.
 */
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';

import { AdminPermissions } from './entities/AdminPermissions.js';
import { ManagementAdminRole } from './entities/ManagementAdminRole.js';
import { ManagementEvent } from './entities/ManagementEvent.js';
import { ManagementRefreshToken } from './entities/ManagementRefreshToken.js';
import { ManagementUser } from './entities/ManagementUser.js';
import { ManagementUserBio } from './entities/ManagementUserBio.js';
import { ManagementUserCredentials } from './entities/ManagementUserCredentials.js';

function getManagementOptions(): DataSourceOptions {
  const host = process.env.MANAGEMENT_DB_HOST;
  const port = process.env.MANAGEMENT_DB_PORT;
  const database = process.env.MANAGEMENT_DB_NAME;
  const username = process.env.MANAGEMENT_DB_USERNAME;
  const password = process.env.MANAGEMENT_DB_PASSWORD;
  if (
    host === undefined ||
    port === undefined ||
    database === undefined ||
    username === undefined ||
    password === undefined
  ) {
    throw new Error(
      'Management DataSource requires MANAGEMENT_DB_HOST, MANAGEMENT_DB_PORT, MANAGEMENT_DB_NAME, MANAGEMENT_DB_USERNAME, MANAGEMENT_DB_PASSWORD (validate at startup).'
    );
  }
  return {
    type: 'postgres',
    host,
    port: Number.parseInt(port, 10),
    database,
    username,
    password,
    entities: [
      ManagementUser,
      ManagementUserCredentials,
      ManagementUserBio,
      AdminPermissions,
      ManagementAdminRole,
      ManagementEvent,
      ManagementRefreshToken,
    ],
    synchronize: false,
    logging: false,
  };
}

export const managementDataSource = new DataSource(getManagementOptions());
