import express, { Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import errorHandler from './middlewares/errors.middleware';
import routes from './routes';
import { Scraper } from 'agent-twitter-client';
import logger from './helpers/logger.heper';

// CREATE EXPRESS APP
const app: Application = express();

// MIDDLEWARES
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api', routes);
app.use(errorHandler);

// SCRAPER
const scraper = new Scraper();

// GET SCRAPER
const authenticateScraper = async () => {
  try {
    logger.info(`Logging in to Twitter`);
    await scraper.login(
      process.env.TWITTER_USERNAME as string,
      process.env.TWITTER_PASSWORD as string,
      process.env.TWITTER_EMAIL as string
    );
    logger.success(`Logged in to Twitter`);
    return scraper;
  } catch (error) {
    logger.error(`Error logging in to Twitter: ${error}`);
  }
};

// CALL SCRAPER
authenticateScraper();

// EXPORT APP
export { scraper };
export default app;
