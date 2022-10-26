import Model from '../database';

export default class BaseModel extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get modelPaths(): string[] {
    return [__dirname];
  }

  $beforeInsert(): void {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }
}
