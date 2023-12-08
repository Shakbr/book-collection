import * as dotenv from 'dotenv';
dotenv.config();

import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import validateEnv from '@utils/validateEnvUtils';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';

validateEnv();

const ExpressConfig = (): Application => {
  const app = express();
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(helmet());
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.use('/api', routes);
  app.use(errorHandler);

  return app;
};

export default ExpressConfig;
