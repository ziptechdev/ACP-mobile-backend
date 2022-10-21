import { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: CreateTableBuilder) => {
    table.increments('id').primary().unsigned();

    //TODO implement enum
    table.tinyint('kyc_status').nullable().defaultTo(null);
    table.string('eligibility_check_id').nullable().defaultTo(null);
    table.integer('bank_account_id').unsigned().unique().index();
    table.string('first_name').index();
    table.string('last_name').index();
    table.string('middle_name').nullable().defaultTo(null);
    table.string('email').unique().index().nullable().defaultTo(null);
    table.string('password').nullable().defaultTo(null);
    table.string('zip_code').nullable().defaultTo(null);
    table.integer('social_security_number').unsigned().unique().index();
    table.date('day_of_birth').nullable().defaultTo(null);
    table.string('address').nullable().defaultTo(null);
    table.string('city').nullable().defaultTo(null);
    table.string('state').nullable().defaultTo(null);
    table.integer('phone_number').unsigned().nullable().defaultTo(null);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
