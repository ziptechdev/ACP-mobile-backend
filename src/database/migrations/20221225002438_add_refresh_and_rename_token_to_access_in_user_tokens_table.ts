import { Knex } from 'knex';
import AlterTableBuilder = Knex.AlterTableBuilder;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(
    'user_tokens',
    function (table: AlterTableBuilder) {
      table.text('refresh').nullable().after('id');
      table.renameColumn('token', 'access');
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(
    'user_tokens',
    function (table: AlterTableBuilder) {
      table.dropColumn('refresh');
      table.renameColumn('access', 'token');
    }
  );
}
