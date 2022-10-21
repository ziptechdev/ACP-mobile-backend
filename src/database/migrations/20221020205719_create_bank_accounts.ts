import { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'bank_accounts',
    function (table: CreateTableBuilder) {
      table.increments('id').primary().unsigned();
      table.string('bank_name');
      table.integer('bank_number').unsigned();
      table.string('account_holder_name');
      table.integer('account_number').unsigned();
      table.date('expiration_date');
      table.timestamps(true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('bank_accounts');
}
