import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import type { Optional } from "sequelize";
import { Task } from "./Task.model";

export interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  mobilePhone?: string | null;
  country?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "password" | "mobilePhone" | "country" | "createdAt" | "updatedAt"
  > {}

@Table({
  tableName: "users",
  timestamps: true,
})
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
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
  declare firstname: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare lastname: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING,
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare mobilePhone?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare country?: string | null;

  @CreatedAt
  @Column({ field: "createdAt", type: DataType.DATE })
  declare readonly createdAt: Date;

  @UpdatedAt
  @Column({ field: "updatedAt", type: DataType.DATE })
  declare readonly updatedAt: Date;

  @HasMany(() => Task, {
    foreignKey: "assigneeId",
    as: "tasks",
  })
  declare tasks?: Task[];
}
