import { Scraper } from 'agent-twitter-client';
import logger from './logger.heper';

export const getScraper = async () => {
    const scraper = new Scraper();
    logger.debug(`Logging in to Twitter`);
    await scraper.login(process.env.TWITTER_USERNAME as string, process.env.TWITTER_PASSWORD as string, process.env.TWITTER_EMAIL as string);
    logger.info(`Logged in to Twitter`);
    return scraper;
}
