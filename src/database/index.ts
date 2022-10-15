import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../knexfile';
import { env } from '../config/vars';

export const devDatabase = Knex(knexConfig.development);
export const testDatabase = Knex(knexConfig.test);

const database = env === 'test' ? testDatabase : devDatabase;

// Give the knex instance to objection.
Model.knex(database);

export default Model;
