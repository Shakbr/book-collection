import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import errorHandler from '@middlewares/errorHandler';

const app = express();
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', routes);
app.use(errorHandler);

export default app;
