import * as dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import validateEnv from '@utils/validateEnv';
import routes from './routes';

dotenv.config();
validateEnv();

const ExpressConfig = (): Application => {
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
