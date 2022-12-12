import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../knexfile';
import { env } from '../config/vars';

export const devDatabase = Knex(knexConfig.development);
export const testDatabase = Knex(knexConfig.test);
export const prodDatabase = Knex(knexConfig.production);

const database =
  env === 'test'
    ? testDatabase
    : env === 'production'
    ? prodDatabase
    : devDatabase;

// Give the knex instance to objection.
Model.knex(database);

export default Model;
