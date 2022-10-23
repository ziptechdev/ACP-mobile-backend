import { testDatabase } from '../../src/database';

export const migrateDb = (): Promise<void> => {
  return testDatabase.migrate.latest();
};

export const rollbackDb = async (): Promise<void> => {
  await testDatabase.migrate.rollback();
  return testDatabase.destroy();
};

export const seedDb = (): Promise<[string[]]> => {
  return testDatabase.seed.run();
};

export const unseedDb = async (): Promise<void> => {
  await testDatabase.schema.raw(
    'TRUNCATE bank_accounts RESTART IDENTITY CASCADE'
  );
  await testDatabase.schema.raw('TRUNCATE users RESTART IDENTITY CASCADE');
};

export const destroyDb = (): Promise<void> => {
  return testDatabase.destroy();
};

export * from './endpoints';
