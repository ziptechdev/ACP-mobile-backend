import { Model, RelationMappings } from 'objection';
import BaseModel from './BaseModel';
import User from './User';

export default class JumioVerificationProcesses extends BaseModel {
  static get tableName(): string {
    return 'jumio_verification_processes';
  }

  id!: number;
  username: string;
  accountId: string;
  workflowExecutionId: string;
  status!: string;
  token: string;
  createdAt!: string;
  updatedAt!: string;

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'jumio_verification_processes.username',
          to: 'users.username',
        },
      },
    };
  }
}
