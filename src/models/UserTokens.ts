import { JSONSchema, Model, RelationMappings } from 'objection';
import BaseModel from './BaseModel';
import User from './User';

export default class UserTokens extends BaseModel {
  static get tableName(): string {
    return 'user_tokens';
  }

  id!: number;
  refresh: string;
  access: string;
  userId!: number;
  createdAt!: string;
  updatedAt!: string;

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_tokens.user_id',
          to: 'users.id',
        },
      },
    };
  }
}
