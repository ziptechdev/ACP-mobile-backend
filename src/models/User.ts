import { JSONSchema, Model, RelationMappings } from 'objection';
import BaseModel from './BaseModel';
import BankAccount from './BankAccount';
import UserTokens from './UserTokens';
import JumioVerificationProcesses from './JumioVerificationProcesses';

export default class User extends BaseModel {
  id!: number;
  username: string;
  password: string;
  firstName!: string;
  lastName!: string;
  middleName: string;
  zipCode: string;
  address: string;
  city: string;
  state: string;
  phoneNumber!: string;
  dateOfBirth: string;
  socialSecurityNumber!: string;
  kycStatus: number; // TODO enum
  eligibilityCheckId: string;
  applicationId: string;
  eligibilityCheckStatus: string;
  count!: number;
  token!: { access: string; refresh: string };
  tokens!: Array<UserTokens>;
  jumioVerificationProcess!: JumioVerificationProcesses;

  static get tableName(): string {
    return 'users';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'socialSecurityNumber',
        'phoneNumber',
      ],
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      bankAccount: {
        relation: Model.HasOneRelation,
        modelClass: BankAccount,
        join: {
          from: 'users.id',
          to: 'bank_accounts.user_id',
        },
      },
      tokens: {
        relation: Model.HasManyRelation,
        modelClass: UserTokens,
        join: {
          from: 'users.id',
          to: 'user_tokens.user_id',
        },
      },
      jumioVerificationProcess: {
        relation: Model.HasOneRelation,
        modelClass: JumioVerificationProcesses,
        join: {
          from: 'users.username',
          to: 'jumio_verification_processes.user_refference',
        },
      },
    };
  }
}
