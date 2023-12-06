import * as dotenv from 'dotenv';
dotenv.config();

import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import validateEnv from '@utils/validateEnv';
import routes from './routes';
import { DataSource } from 'typeorm';
import config from './config/ormconfig';

validateEnv();

const dataSource = new DataSource(config);

const ExpressConfig = async (): Promise<Application> => {
  // Initialize the TypeORM connection
  await dataSource
    .initialize()
    .then(() => console.log('Database connected successfully'))
    .catch((error) => {
      console.error('Error during Data Source initialization', error);
      process.exit(1);
    });

  const app = express();
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(helmet());
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.use(routes);

  return app;
};

export default ExpressConfig;
