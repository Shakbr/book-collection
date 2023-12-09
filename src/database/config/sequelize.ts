import { Sequelize } from 'sequelize';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const sequelize = isTestEnvironment
  ? new Sequelize(null, null, null, { dialect: 'sqlite', storage: ':memory:', logging: false })
  : new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
    });

export default sequelize;
