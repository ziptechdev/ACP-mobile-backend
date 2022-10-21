import { JSONSchema, Model, RelationMappings } from 'objection';

export default class BankAccount extends Model {
  static get tableName(): string {
    return 'bank_accounts';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: [
        'bank_name',
        'bank_number',
        'account_holder_name',
        'account_number',
        'expiration_date',
      ],

      properties: {
        id: { type: 'integer' },
        bank_name: { type: 'string' },
        bank_number: { type: 'integer' },
        account_holder_name: { type: 'string' },
        account_number: { type: 'integer' },
        expiration_date: { type: 'string' },
      },
    };
  }
}
