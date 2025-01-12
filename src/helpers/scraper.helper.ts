import { Scraper } from 'agent-twitter-client';

export const getScraper = async () => {
    const scraper = new Scraper();
    await scraper.login(process.env.TWITTER_USERNAME as string, process.env.TWITTER_PASSWORD as string);
    return scraper;
}
