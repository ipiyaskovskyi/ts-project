import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import type { Optional } from "sequelize";
import { User } from "./User.model.js";
import type { Status, Priority } from "../dto/Task.js";

export interface TaskAttributes {
  id: number;
  title: string;
  description?: string | null;
  type?: string | null;
  status: Status;
  priority: Priority;
  deadline?: Date | null;
  assigneeId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes
  extends Optional<
    TaskAttributes,
    | "id"
    | "description"
    | "type"
    | "status"
    | "priority"
    | "deadline"
    | "assigneeId"
    | "createdAt"
    | "updatedAt"
  > {}

@Table({
  tableName: "tasks",
  timestamps: true,
})
export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare type?: string | null;

  @AllowNull(false)
  @Default("draft")
  @Column({
    type: DataType.ENUM("draft", "in_progress", "editing", "done"),
  })
  declare status: Status;

  @AllowNull(false)
  @Default("medium")
  @Column({
    type: DataType.ENUM("low", "medium", "high", "urgent"),
  })
  declare priority: Priority;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deadline?: Date | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "assigneeId",
  })
  declare assigneeId?: number | null;

  @BelongsTo(() => User, {
    foreignKey: "assigneeId",
    as: "assignee",
  })
  declare assignee?: User;

  @CreatedAt
  @Column({ field: "createdAt", type: DataType.DATE })
  declare readonly createdAt: Date;

  @UpdatedAt
  @Column({ field: "updatedAt", type: DataType.DATE })
  declare readonly updatedAt: Date;
}
