import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
});

export default sequelize;
