import { JSONSchema, Model, RelationMappings } from 'objection';
import BaseModel from './BaseModel';
import BankAccount from './BankAccount';

export default class User extends BaseModel {
  id!: number;
  username: string;
  password: string;
  firstName!: string;
  lastName!: string;
  middleName: string;
  zipCode!: string;
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

  static get tableName(): string {
    return 'users';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['first_name', 'last_name', 'social_security_number'],

      properties: {
        id: { type: 'integer' },
        kyc_status: { type: ['integer', 'null'] },
        eligibility_check_id: { type: ['string', 'null'] },
        application_id: { type: ['string', 'null'] },
        eligibility_check_status: { type: ['string', 'null'] },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        middle_name: { type: ['string', 'null'] },
        email: { type: ['string', 'null'] },
        password: { type: ['string', 'null'] },
        zip_code: { type: ['string', 'null'] },
        social_security_number: { type: 'integer' },
        day_of_birth: { type: ['string', 'null'] },
        address: { type: ['string', 'null'] },
        city: { type: ['string', 'null'] },
        state: { type: ['string', 'null'] },
        phone_number: { type: ['integer', 'null'] },
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      bank_account: {
        relation: Model.HasOneRelation,
        modelClass: BankAccount,
        join: {
          from: 'users.id',
          to: 'bank_accounts.user_id',
        },
      },
    };
  }
}
