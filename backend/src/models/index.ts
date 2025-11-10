import path from 'node:path';
import { Sequelize } from 'sequelize';
import { User, setSequelizeInstance as setUserSequelize } from './User.model.js';
import { Task, setSequelizeInstance as setTaskSequelize } from './Task.model.js';

const isTest = process.env.NODE_ENV === 'test';
const dbPath =
  process.env.DB_STORAGE ??
  path.resolve(process.cwd(), 'backend', isTest ? 'test.sqlite' : 'database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

setUserSequelize(sequelize);
setTaskSequelize(sequelize);

Task.belongsTo(User, {
  foreignKey: 'assigneeId',
  as: 'assignee',
});

User.hasMany(Task, {
  foreignKey: 'assigneeId',
  as: 'tasks',
});

export { User, Task };

