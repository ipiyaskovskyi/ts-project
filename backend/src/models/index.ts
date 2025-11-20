import { sequelize } from "../config/database";
import { User } from "./User.model";
import { Task } from "./Task.model";

sequelize.addModels([User, Task]);

export { sequelize, User, Task };
