import express, { Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import errorHandler from './middlewares/errors.middleware';
import routes from './routes';

// CREATE EXPRESS APP
const app: Application = express();

// MIDDLEWARES
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api', routes);
app.use(errorHandler);

export default app;
