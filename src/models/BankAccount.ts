import { JSONSchema, Model, RelationMappings } from 'objection';
import BaseModel from './BaseModel';
import User from './User';

export default class BankAccount extends BaseModel {
  static get tableName(): string {
    return 'bank_accounts';
  }

  id!: number;
  bank_name: string;
  bank_number: string;
  account_holder_name: string;
  account_number: string;
  expiration_date: string;
  user_id: number;

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: [
        'bank_name',
        'bank_number',
        'account_holder_name',
        'account_number',
        'expiration_date',
        'user_id',
      ],

      properties: {
        id: { type: 'integer' },
        bank_name: { type: 'string' },
        bank_number: { type: 'string' },
        account_holder_name: { type: 'string' },
        account_number: { type: 'string' },
        expiration_date: { type: 'string' },
        user_id: { type: ['integer'] },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'bank_accounts.user_id',
          to: 'users.id',
        },
      },
    };
  }
}
