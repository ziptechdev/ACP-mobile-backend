import { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'user_tokens',
    function (table: CreateTableBuilder) {
      table.increments('id').primary().unsigned();
      table.text('token');
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
  return knex.schema.dropTable('user_tokens');
}
