import { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'bank_accounts',
    function (table: CreateTableBuilder) {
      table.increments('id').primary().unsigned();
      table.string('bank_name');
      table.string('bank_number');
      table.string('account_holder_name');
      table.string('account_number');
      table.date('expiration_date');
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index();
      table.timestamps(true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('bank_accounts');
}
