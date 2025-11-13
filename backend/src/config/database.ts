import { Sequelize } from 'sequelize-typescript';

const isTest = process.env.NODE_ENV === 'test';

let sequelizeInstance: Sequelize;

if (isTest) {
  sequelizeInstance = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else {
  const host = process.env.POSTGRES_HOST ?? 'localhost';
  const port = Number(process.env.POSTGRES_PORT ?? 5432);
  const username = process.env.POSTGRES_USER ?? 'ipiaskovskyi';
  const password = process.env.POSTGRES_PASSWORD ?? '';
  const database = process.env.POSTGRES_DB ?? 'db_development';

  sequelizeInstance = new Sequelize({
    dialect: 'postgres',
    host,
    port,
    username,
    password,
    database,
    logging: false,
  });
}

export const sequelize = sequelizeInstance;

export default sequelize;
