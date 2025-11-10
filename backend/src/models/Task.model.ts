import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';
import { setSequelizeInstance as setUserSequelize } from './User.model.js';
import type { Status, Priority } from '../dto/Task.js';

let sequelizeInstance: Sequelize;
let isInitialized = false;

export function setSequelizeInstance(instance: Sequelize) {
  sequelizeInstance = instance;
  setUserSequelize(instance);
  if (!isInitialized) {
    Task.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM('todo', 'in-progress', 'done'),
          allowNull: false,
          defaultValue: 'todo',
        },
        priority: {
          type: DataTypes.ENUM('low', 'medium', 'high'),
          allowNull: false,
          defaultValue: 'medium',
        },
        deadline: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        assigneeId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Task',
        tableName: 'tasks',
      }
    );
    isInitialized = true;
  }
}

export interface TaskAttributes {
  id: number;
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  deadline?: Date | null;
  assigneeId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'description' | 'status' | 'priority' | 'deadline' | 'assigneeId' | 'createdAt' | 'updatedAt'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: number;
  declare title: string;
  declare description?: string | null;
  declare status: Status;
  declare priority: Priority;
  declare deadline?: Date | null;
  declare assigneeId?: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

