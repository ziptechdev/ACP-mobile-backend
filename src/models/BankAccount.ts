import { JSONSchema, Model, RelationMappings } from 'objection';
import BaseModel from './BaseModel';
import User from './User';

export default class BankAccount extends BaseModel {
  static get tableName(): string {
    return 'bank_accounts';
  }

  id!: number;
  bankName: string;
  bankNumber: string;
  accountHolderName: string;
  accountNumber: string;
  expirationDate: string;
  userId!: number;

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: [
        'bankName',
        'bankNumber',
        'accountHolderName',
        'accountNumber',
        'expirationDate',
      ],
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
