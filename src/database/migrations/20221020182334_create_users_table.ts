import { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;
import { EligibilityCheckStatus } from '../../models/EligibilityCheckStatus';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: CreateTableBuilder) => {
    table.increments('id').primary().unsigned();

    //TODO implement enum
    table.tinyint('kyc_status').nullable().defaultTo(null);
    table.string('eligibility_check_id').unique().nullable().defaultTo(null);
    table.string('application_id').unique().nullable().defaultTo(null);
    table
      .enu('eligibility_check_status', Object.values(EligibilityCheckStatus), {
        useNative: true,
        enumName: 'eligibility_check_status',
      })
      .nullable()
      .defaultTo(null)
      .index();
    table.string('first_name').notNullable().index();
    table.string('last_name').notNullable().index();
    table.string('middle_name').nullable().defaultTo(null);
    table.string('username').unique().index().nullable().defaultTo(null);
    table.string('password').nullable().defaultTo(null);
    table.string('zip_code').nullable().defaultTo(null);
    table.date('day_of_birth').nullable().defaultTo(null);
    table
      .integer('social_security_number')
      .unsigned()
      .unique()
      .notNullable()
      .index();
    table.date('date_of_birth').nullable().defaultTo(null);
    table.string('address').nullable().defaultTo(null);
    table.string('city').nullable().defaultTo(null);
    table.string('state').nullable().defaultTo(null);
    table.integer('phone_number').unsigned().defaultTo(null);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
  return knex.schema.raw('DROP TYPE eligibility_check_status;');
}
