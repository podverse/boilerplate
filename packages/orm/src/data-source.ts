/**
 * TypeORM DataSources: read-only (DB_READ_*) and read-write (DB_READ_WRITE_*).
 * Use the read connection in service methods that only read; use read-write where writes occur.
 * Validate DB_READ_* and DB_READ_WRITE_* at app startup before using.
 */
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';

import { User } from './entities/User.js';
import { UserCredentials } from './entities/UserCredentials.js';
import { UserBio } from './entities/UserBio.js';
import { VerificationToken } from './entities/VerificationToken.js';
import { RefreshToken } from './entities/RefreshToken.js';
import { Bucket } from './entities/Bucket.js';
import { BucketSettings } from './entities/BucketSettings.js';
import { BucketAdmin } from './entities/BucketAdmin.js';
import { BucketAdminInvitation } from './entities/BucketAdminInvitation.js';
import { BucketMessage } from './entities/BucketMessage.js';

const ENTITIES = [
  User,
  UserCredentials,
  UserBio,
  VerificationToken,
  RefreshToken,
  Bucket,
  BucketSettings,
  BucketAdmin,
  BucketAdminInvitation,
  BucketMessage,
];

function getReadOptions(): DataSourceOptions {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_NAME;
  const username = process.env.DB_READ_USERNAME;
  const password = process.env.DB_READ_PASSWORD;
  if (
    host === undefined ||
    port === undefined ||
    database === undefined ||
    username === undefined ||
    password === undefined
  ) {
    throw new Error(
      'Read DataSource requires DB_HOST, DB_PORT, DB_NAME, DB_READ_USERNAME, DB_READ_PASSWORD (validate at startup).'
    );
  }
  return {
    type: 'postgres',
    host,
    port: Number.parseInt(port, 10),
    database,
    username,
    password,
    entities: ENTITIES,
    synchronize: false,
    logging: false,
  };
}

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
      'Read-write DataSource requires DB_HOST, DB_PORT, DB_NAME, DB_READ_WRITE_USERNAME, DB_READ_WRITE_PASSWORD (validate at startup).'
    );
  }
  return {
    type: 'postgres',
    host,
    port: Number.parseInt(port, 10),
    database,
    username,
    password,
    entities: ENTITIES,
    synchronize: false,
    logging: false,
  };
}

export const appDataSourceRead = new DataSource(getReadOptions());
export const appDataSourceReadWrite = new DataSource(getReadWriteOptions());

/** @deprecated Use appDataSourceRead or appDataSourceReadWrite. Kept for backward compat. */
export const appDataSource = appDataSourceReadWrite;
