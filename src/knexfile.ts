import { testDbUri, dbUri } from './config/vars';
import { knexSnakeCaseMappers } from 'objection';
import { types } from 'pg';

types.setTypeParser(20, BigInt); // Type Id 20 = BIGINT | BIGSERIAL

const config = {
  development: {
    client: 'pg',
    connection: dbUri,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + '/database/migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: __dirname + '/database/seeds/development',
      extension: 'ts',
    },
    ...knexSnakeCaseMappers(),
  },

  test: {
    client: 'pg',
    connection: testDbUri,
    migrations: {
      directory: __dirname + '/database/migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: __dirname + '/database/seeds/test',
      extension: 'ts',
    },
    ...knexSnakeCaseMappers(),
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: dbUri,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + '/database/migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: __dirname + '/database/seeds/production',
      extension: 'ts',
    },
    ...knexSnakeCaseMappers(),
  },
};

export default config;
module.exports = config;
