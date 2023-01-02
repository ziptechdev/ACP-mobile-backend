import { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;
import { JumioVerificationProcessStatus } from '../../models/JumioVerificationProcessStatus';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'jumio_verification_processes',
    function (table: CreateTableBuilder) {
      table.increments('id').primary().unsigned();
      table.string('user_refference').unique().index();
      table.string('account_id').unique().index();
      table.string('workflow_execution_id').unique().index();
      table
        .enu('status', Object.values(JumioVerificationProcessStatus), {
          useNative: true,
          enumName: 'jumio_user_verification_status',
        })
        .defaultTo('PENDING')
        .index();
      table.text('token').unique();
      table.timestamps(true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('jumio_verification_processes');
  return knex.schema.raw('DROP TYPE jumio_user_verification_status;');
}
