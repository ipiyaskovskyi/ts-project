import {
  Model,
  DataTypes,
  type Optional,
  type HasManyGetAssociationsMixin,
} from 'sequelize';
import { sequelize } from '../db/sequelize';
import type { Task } from './Task.model';

export interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare firstname: string;
  declare lastname: string;
  declare email: string;
  declare password: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare getTasks: HasManyGetAssociationsMixin<Task>;
  declare tasks?: Task[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);
