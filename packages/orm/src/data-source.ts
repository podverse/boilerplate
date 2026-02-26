/**
 * TypeORM DataSource using read-write DB credentials (DB_READ_WRITE_*).
 * Validate DB_READ_USERNAME, DB_READ_PASSWORD, DB_READ_WRITE_USERNAME, DB_READ_WRITE_PASSWORD
 * at app startup before using this.
 */
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';

import { User } from './entities/User.js';
import { UserCredentials } from './entities/UserCredentials.js';
import { UserBio } from './entities/UserBio.js';
import { VerificationToken } from './entities/VerificationToken.js';

function getReadWriteOptions(): DataSourceOptions {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_NAME;
  const username = process.env.DB_READ_WRITE_USERNAME;
  const password = process.env.DB_READ_WRITE_PASSWORD;
  if (
    host === undefined ||
    port === undefined ||
    database === undefined ||
    username === undefined ||
    password === undefined
  ) {
    throw new Error(
      'DataSource requires DB_HOST, DB_PORT, DB_NAME, DB_READ_WRITE_USERNAME, DB_READ_WRITE_PASSWORD (validate at startup).'
    );
  }
  return {
    type: 'postgres',
    host,
    port: Number.parseInt(port, 10),
    database,
    username,
    password,
    entities: [User, UserCredentials, UserBio, VerificationToken],
    synchronize: false,
    logging: false,
  };
}

export const appDataSource = new DataSource(getReadWriteOptions());
