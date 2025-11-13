import { sequelize } from '../config/database.js';
import { User } from './User.model.js';
import { Task } from './Task.model.js';

sequelize.addModels([User, Task]);

export { sequelize, User, Task };
